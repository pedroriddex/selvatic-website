import type Stripe from 'stripe';
import { AppException } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { sanityMutate, sanityQuery } from '../client';
import { productIdsBySlugsQuery } from '../queries';
import { externalFetch, sanitizeDocumentId, toFiniteNumber } from '../shared';

const SCOPE = 'sanity.createOrderFromCheckoutSession';

/**
 * Convierte el metadato `cartItems` ("slug:cantidad|slug:cantidad") que el
 * checkout guarda en la sesión de Stripe en un mapa slug -> cantidad.
 * Es tolerante a entradas vacías o mal formadas.
 */
export function parseCartMetadata(raw: unknown): Map<string, number> {
	const quantities = new Map<string, number>();

	if (typeof raw !== 'string' || raw.trim().length === 0) {
		return quantities;
	}

	for (const part of raw.split('|')) {
		const separator = part.lastIndexOf(':');
		if (separator <= 0) {
			continue;
		}

		const slug = part.slice(0, separator).trim();
		const quantity = Number.parseInt(part.slice(separator + 1), 10);

		if (!slug || !Number.isFinite(quantity) || quantity <= 0) {
			continue;
		}

		quantities.set(slug, (quantities.get(slug) ?? 0) + quantity);
	}

	return quantities;
}

export async function createOrderFromCheckoutSession(
	_fetchFn: typeof fetch,
	session: Stripe.Checkout.Session,
	lineItems: Stripe.LineItem[],
	requestId = createRequestId()
): Promise<void> {
	const paymentIntent =
		typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
	const isPaid = session.payment_status === 'paid';

	const items = lineItems.map((line) => {
		const quantity = Math.max(1, line.quantity ?? 1);
		const unitAmount = toFiniteNumber(line.amount_subtotal, 0) / quantity;
		const priceId = typeof line.price?.id === 'string' ? line.price.id : undefined;
		const stripeProductId =
			typeof line.price?.product === 'string'
				? line.price.product
				: typeof line.price?.product?.id === 'string'
					? line.price.product.id
					: undefined;

		return {
			_type: 'orderItem',
			description: line.description,
			quantity,
			amountSubtotal: toFiniteNumber(line.amount_subtotal, 0) / 100,
			amountTotal: toFiniteNumber(line.amount_total, 0) / 100,
			unitAmount: unitAmount / 100,
			currency: (line.currency ?? session.currency ?? 'eur').toUpperCase(),
			stripePriceId: priceId,
			stripeProductId
		};
	});

	const orderId = `order.${sanitizeDocumentId(session.id)}`;
	const orderDoc = {
		_id: orderId,
		_type: 'order',
		orderNumber: session.id,
		stripeSessionId: session.id,
		stripePaymentIntentId: paymentIntent,
		customerEmail: session.customer_details?.email,
		amountTotal: toFiniteNumber(session.amount_total, 0) / 100,
		currency: (session.currency ?? 'eur').toUpperCase(),
		status: isPaid ? 'paid' : 'pending',
		inventoryAdjusted: false,
		items,
		metadata: JSON.stringify(session.metadata ?? {}),
		paidAt: isPaid ? new Date().toISOString() : undefined,
		receivedAt: new Date().toISOString()
	};

	// Idempotente: si el webhook se reenvía, no se sobrescribe el pedido existente
	// (el _id es determinista a partir del id de la sesión de Stripe).
	await sanityMutate(externalFetch, [{ createIfNotExists: orderDoc }], { scope: SCOPE, requestId });

	// El stock solo se descuenta para pedidos pagados, y exactamente una vez.
	if (isPaid) {
		await adjustInventoryForPaidOrder(orderId, session, requestId);
	}
}

/**
 * Descuenta el stock de los productos comprados exactamente una vez por sesión.
 *
 * Usa el propio pedido como cerrojo de idempotencia: el campo `inventoryAdjusted`
 * se marca a `true` dentro de la misma transacción atómica que aplica los
 * decrementos, con `ifRevisionID` para que, si llegan webhooks concurrentes (o
 * Stripe reintenta tras un commit con la conexión cortada), solo una transacción
 * tenga efecto y las demás fallen de forma segura con un 409.
 */
async function adjustInventoryForPaidOrder(
	orderId: string,
	session: Stripe.Checkout.Session,
	requestId: string
): Promise<void> {
	// auth 'write': el _id del pedido lleva punto ("order.cs_..."), así que vive
	// en una ruta de Sanity y NO es visible para consultas anónimas o de solo
	// lectura pública. Sin token aquí, el stock nunca se descontaría.
	const order = await sanityQuery<{ _rev: string; inventoryAdjusted?: boolean } | null>(
		externalFetch,
		`*[_id == $id][0]{ _rev, inventoryAdjusted }`,
		{ id: orderId },
		{ scope: SCOPE, requestId, auth: 'write' }
	);

	if (!order) {
		logger.warn(SCOPE, 'No se encontró el pedido recién creado para ajustar inventario.', {
			orderId,
			requestId
		});
		return;
	}

	// Ya ajustado en una ejecución previa: nada que hacer.
	if (order.inventoryAdjusted === true) {
		return;
	}

	const quantities = parseCartMetadata(session.metadata?.cartItems);

	if (quantities.size === 0) {
		// Sin líneas que descontar: marca el pedido como ajustado para no
		// reintentar indefinidamente en sucesivos webhooks.
		await commitInventoryAdjustment(orderId, order._rev, [], requestId);
		return;
	}

	const slugs = [...quantities.keys()];
	const products = await sanityQuery<Array<{ _id: string; slug: string }>>(
		externalFetch,
		productIdsBySlugsQuery,
		{ slugs },
		{ scope: SCOPE, requestId, auth: 'write' }
	);
	const idBySlug = new Map(products.map((product) => [product.slug, product._id]));

	const stockPatches: Array<Record<string, unknown>> = [];
	for (const [slug, quantity] of quantities) {
		const productId = idBySlug.get(slug);
		if (!productId) {
			logger.warn(SCOPE, 'Producto de un pedido pagado no encontrado al descontar stock.', {
				slug,
				orderId,
				requestId
			});
			continue;
		}

		stockPatches.push({
			patch: {
				id: productId,
				setIfMissing: { stock: 0 },
				dec: { stock: quantity }
			}
		});
	}

	await commitInventoryAdjustment(orderId, order._rev, stockPatches, requestId);
}

async function commitInventoryAdjustment(
	orderId: string,
	revision: string,
	stockPatches: Array<Record<string, unknown>>,
	requestId: string
): Promise<void> {
	const mutations = [
		{ patch: { id: orderId, ifRevisionID: revision, set: { inventoryAdjusted: true } } },
		...stockPatches
	];

	try {
		await sanityMutate(externalFetch, mutations, { scope: SCOPE, requestId });
	} catch (error) {
		// 409: otro proceso concurrente ya ajustó el inventario (revisión en
		// conflicto). La transacción es atómica, así que el stock no se descuenta
		// dos veces. Es un resultado idempotente esperado, no un fallo.
		if (error instanceof AppException && error.status === 409) {
			logger.info(SCOPE, 'Inventario ya ajustado por otro proceso (revisión en conflicto).', {
				orderId,
				requestId
			});
			return;
		}

		throw error;
	}
}
