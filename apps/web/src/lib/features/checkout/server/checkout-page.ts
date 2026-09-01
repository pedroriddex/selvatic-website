import { env as publicEnv } from '$env/dynamic/public';
import { ONLINE_STORE_ENABLED, STORE_LOCK_TITLE } from '$lib/config/store';
import { computeEffectiveUnitAmountCents, describeSelections } from '$lib/domain/cart/variants';
import {
	getShippingRestriction,
	isPostalCodeAllowed,
	normalizePostalCode
} from '$lib/domain/shipping/postal-codes';
import { toAppError } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { getPageContentResult, getProductBySlug, getSiteSettingsResult } from '$lib/server/sanity';
import { getStripeClient } from '$lib/server/stripe';
import { fail, isRedirect, redirect } from '@sveltejs/kit';
import type Stripe from 'stripe';
import { z } from 'zod';

const SHIPPING_AMOUNT_CENTS = 490;

const checkoutSchema = z.object({
	items: z
		.array(
			z.object({
				slug: z.string().trim().min(1),
				quantity: z.coerce.number().int().min(1).max(10),
				// El cliente solo envía qué opción eligió; NUNCA importes ni suplementos.
				selections: z
					.array(
						z.object({
							groupName: z.string().trim().min(1).max(120),
							optionLabel: z.string().trim().min(1).max(120)
						})
					)
					.max(10)
					.optional()
					.default([])
			})
		)
		.min(1)
		.max(24)
});

export async function loadCheckoutPage(url: URL, fetchFn: typeof fetch) {
	const requestId = createRequestId();
	const [pageContentResult, siteSettingsResult] = await Promise.all([
		getPageContentResult(fetchFn, 'checkout', requestId),
		getSiteSettingsResult(fetchFn, requestId)
	]);
	const shippingRestriction = getShippingRestriction(siteSettingsResult.settings);

	return {
		status: url.searchParams.get('status') ?? null,
		sessionId: url.searchParams.get('session_id') ?? null,
		pageContent: pageContentResult.page,
		// Solo se expone si la restricción está activa; la lista de códigos se
		// queda en el servidor (la validación real ocurre en la action).
		shippingPostalCodeRequired: shippingRestriction.enabled
	};
}

export const checkoutPageActions = {
	default: async ({
		request,
		fetch,
		url
	}: {
		request: Request;
		fetch: typeof globalThis.fetch;
		url: URL;
	}) => {
		if (!ONLINE_STORE_ENABLED) {
			return fail(503, {
				error: STORE_LOCK_TITLE
			});
		}

		const requestId = createRequestId();
		const formData = await request.formData();
		const rawItems = formData.get('items');
		const rawPostalCode = formData.get('postalCode');

		// Restricción de zona de envío: si está activa en Ajustes del sitio, el
		// código postal es obligatorio y debe estar en la lista permitida.
		const siteSettingsResult = await getSiteSettingsResult(fetch, requestId);
		const shippingRestriction = getShippingRestriction(siteSettingsResult.settings);
		const postalCode =
			typeof rawPostalCode === 'string' ? normalizePostalCode(rawPostalCode) : null;

		if (shippingRestriction.enabled) {
			if (!postalCode) {
				return fail(400, {
					error: 'Indica un código postal válido de 5 cifras para comprobar tu zona de envío.'
				});
			}

			if (!isPostalCodeAllowed(shippingRestriction, postalCode)) {
				return fail(400, {
					error: shippingRestriction.outOfRangeMessage,
					outOfShippingRange: true
				});
			}
		}

		let parsedItemsPayload: unknown;
		if (typeof rawItems !== 'string' || rawItems.trim().length === 0) {
			return fail(400, {
				error: 'No hay productos en el carrito.'
			});
		}

		try {
			parsedItemsPayload = JSON.parse(rawItems);
		} catch {
			return fail(400, {
				error: 'Formato de carrito inválido.'
			});
		}

		const parsed = checkoutSchema.safeParse({
			items: parsedItemsPayload
		});

		if (!parsed.success) {
			return fail(400, {
				error: 'Parámetros de checkout inválidos.'
			});
		}

		// El stock es ÚNICO por producto: se agrega la cantidad por slug aunque haya
		// varias líneas del mismo producto con distintas opciones.
		const quantitiesBySlug = new Map<string, number>();
		for (const item of parsed.data.items) {
			quantitiesBySlug.set(item.slug, (quantitiesBySlug.get(item.slug) ?? 0) + item.quantity);
		}

		const slugs = [...quantitiesBySlug.keys()];
		let products: Awaited<ReturnType<typeof getProductBySlug>>[];

		try {
			products = await Promise.all(slugs.map((slug) => getProductBySlug(fetch, slug, requestId)));
		} catch (error) {
			const normalized = toAppError(error, {
				scope: 'checkout.action.loadProducts',
				requestId,
				message: 'No se pudo validar el carrito en este momento.'
			});

			logger.error(normalized, {
				scope: 'checkout.action.loadProducts',
				requestId
			});

			return fail(500, {
				error:
					normalized.code === 'CONFIG'
						? 'La configuración de datos no está lista para checkout.'
						: 'No se pudo validar el carrito. Inténtalo de nuevo.',
				requestId
			});
		}

		const productBySlug = new Map<string, NonNullable<(typeof products)[number]>>();
		for (let index = 0; index < slugs.length; index += 1) {
			const slug = slugs[index];
			const product = products[index];
			const quantity = quantitiesBySlug.get(slug) ?? 0;

			if (!product) {
				return fail(404, {
					error: `Producto no encontrado: ${slug}.`
				});
			}

			if (!product.isActive) {
				return fail(400, {
					error: `El producto "${product.name}" no está disponible actualmente.`
				});
			}

			if (quantity < 1) {
				return fail(400, {
					error: `Cantidad inválida para "${product.name}".`
				});
			}

			if (product.stock < quantity) {
				return fail(400, {
					error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}.`
				});
			}

			productBySlug.set(slug, product);
		}

		const currencies = new Set(
			[...productBySlug.values()].map((product) => product.currency.toUpperCase())
		);
		if (currencies.size !== 1) {
			return fail(400, {
				error: 'No se pueden mezclar monedas en un mismo carrito.'
			});
		}

		const currency = [...currencies][0] ?? 'EUR';
		if (currency !== 'EUR') {
			return fail(400, {
				error: 'En esta fase, el checkout solo acepta productos en EUR.'
			});
		}

		// Líneas de Stripe: UNA por item del carrito (cada combinación de opciones
		// es una línea con su precio efectivo recalculado en el servidor).
		const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
		for (const item of parsed.data.items) {
			const product = productBySlug.get(item.slug);
			if (!product) {
				return fail(404, { error: `Producto no encontrado: ${item.slug}.` });
			}

			const pricing = computeEffectiveUnitAmountCents(product, item.selections);
			if (!pricing.ok) {
				return fail(400, { error: pricing.error });
			}

			const hasVariants = product.variantGroups.length > 0;
			// Producto sin variantes y con precio de catálogo en Stripe: respeta ese price.
			if (!hasVariants && product.stripePriceId && item.selections.length === 0) {
				lineItems.push({ price: product.stripePriceId, quantity: item.quantity });
				continue;
			}

			const optionsText = describeSelections(pricing.resolved);
			const name = optionsText
				? `${product.name} (${optionsText})`.slice(0, 250)
				: product.name;
			const description =
				[product.description, optionsText ? `Opciones — ${optionsText}` : null]
					.filter(Boolean)
					.join(' · ')
					.slice(0, 480) || undefined;

			lineItems.push({
				price_data: {
					currency: 'eur',
					product_data: {
						name,
						description,
						images: product.imageUrl ? [product.imageUrl] : undefined
					},
					unit_amount: pricing.amountCents
				},
				quantity: item.quantity
			});
		}

		try {
			const stripe = getStripeClient();
			const baseUrl = publicEnv.PUBLIC_APP_URL || url.origin;

			// metadata.cartItems sigue siendo "slug:cantidad" agregado por producto:
			// es lo que usa el webhook para descontar stock (idempotente, por slug).
			const metadataItems = [...quantitiesBySlug.entries()]
				.map(([slug, quantity]) => `${slug}:${quantity}`)
				.join('|')
				.slice(0, 500);

			const itemCount = [...quantitiesBySlug.values()].reduce((acc, quantity) => acc + quantity, 0);

			const session = await stripe.checkout.sessions.create({
				mode: 'payment',
				line_items: lineItems,
				customer_creation: 'always',
				shipping_address_collection: {
					allowed_countries: ['ES']
				},
				shipping_options: [
					{
						shipping_rate_data: {
							type: 'fixed_amount',
							display_name: 'Envío estándar',
							fixed_amount: {
								amount: SHIPPING_AMOUNT_CENTS,
								currency: 'eur'
							}
						}
					}
				],
				success_url: `${baseUrl}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${baseUrl}/checkout?status=cancel`,
				metadata: {
					cartItems: metadataItems,
					itemCount: String(itemCount),
					currency,
					...(postalCode ? { shippingPostalCode: postalCode } : {})
				}
			});

			if (!session.url) {
				return fail(500, {
					error: 'No se pudo iniciar el proceso de pago.',
					requestId
				});
			}

			throw redirect(303, session.url);
		} catch (rawError) {
			if (isRedirect(rawError)) {
				throw rawError;
			}

			const normalized = toAppError(rawError, {
				scope: 'checkout.action.createSession',
				requestId,
				message: 'No se pudo iniciar el proceso de pago.'
			});

			logger.error(normalized, {
				scope: 'checkout.action.createSession',
				requestId
			});

			return fail(500, {
				error:
					normalized.code === 'CONFIG'
						? 'La configuración de pago no está lista en este momento.'
						: 'No se pudo iniciar el proceso de pago.',
				requestId
			});
		}
	}
};
