import { getProductBySlug } from '$lib/server/sanity';
import { ONLINE_STORE_ENABLED, STORE_LOCK_TITLE } from '$lib/config/store';
import { toAppError } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { getStripeClient } from '$lib/server/stripe';
import { PUBLIC_APP_URL } from '$env/static/public';
import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const SHIPPING_AMOUNT_CENTS = 490;

const checkoutSchema = z.object({
	items: z
		.array(
			z.object({
				slug: z.string().trim().min(1),
				quantity: z.coerce.number().int().min(1).max(10)
			})
		)
		.min(1)
		.max(24)
});

export const load = (async ({ url }) => {
	const status = url.searchParams.get('status') ?? null;
	const sessionId = url.searchParams.get('session_id') ?? null;

	return {
		status,
		sessionId
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, fetch, url }) => {
		if (!ONLINE_STORE_ENABLED) {
			return fail(503, {
				error: STORE_LOCK_TITLE
			});
		}

		const requestId = createRequestId();
		const formData = await request.formData();
		const rawItems = formData.get('items');

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

		const resolvedItems: Array<{
			quantity: number;
			product: NonNullable<(typeof products)[number]>;
		}> = [];

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

			if (quantity < 1 || quantity > 10) {
				return fail(400, {
					error: `Cantidad inválida para "${product.name}".`
				});
			}

			if (product.stock < quantity) {
				return fail(400, {
					error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}.`
				});
			}

			resolvedItems.push({ quantity, product });
		}

		const currencies = new Set(resolvedItems.map((item) => item.product.currency.toUpperCase()));
		if (currencies.size !== 1) {
			return fail(400, {
				error: 'No se pueden mezclar monedas en un mismo carrito.'
			});
		}

		const currency = resolvedItems[0]?.product.currency.toUpperCase() ?? 'EUR';
		if (currency !== 'EUR') {
			return fail(400, {
				error: 'En esta fase, el checkout solo acepta productos en EUR.'
			});
		}

		try {
			const stripe = getStripeClient();
			const baseUrl = PUBLIC_APP_URL || url.origin;
			const lineItems = resolvedItems.map(({ product, quantity }) => {
				if (product.stripePriceId) {
					return {
						price: product.stripePriceId,
						quantity
					};
				}

				return {
					price_data: {
						currency: currency.toLowerCase(),
						product_data: {
							name: product.name,
							description: product.description,
							images: product.imageUrl ? [product.imageUrl] : undefined
						},
						unit_amount: Math.round(product.price * 100)
					},
					quantity
				};
			});

			const metadataItems = resolvedItems
				.map(({ product, quantity }) => `${product.slug}:${quantity}`)
				.join('|')
				.slice(0, 500);

			const session = await stripe.checkout.sessions.create({
				mode: 'payment',
				line_items: lineItems,
				customer_creation: 'always',
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
					itemCount: String(resolvedItems.reduce((acc, item) => acc + item.quantity, 0)),
					currency
				}
			});

			if (!session.url) {
				return fail(500, {
					error: 'Stripe no devolvió URL de checkout.',
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
				message: 'No se pudo iniciar Stripe Checkout.'
			});

			logger.error(normalized, {
				scope: 'checkout.action.createSession',
				requestId
			});

			return fail(500, {
				error:
					normalized.code === 'CONFIG'
						? 'Falta configuración de pago para continuar con Stripe.'
						: 'No se pudo iniciar el checkout con Stripe.',
				requestId
			});
		}
	}
} satisfies Actions;
