import type Stripe from 'stripe';
import { createRequestId } from '$lib/server/logger';
import { sanityMutate } from '../client';
import { externalFetch, sanitizeDocumentId, toFiniteNumber } from '../shared';

export async function createOrderFromCheckoutSession(
	_fetchFn: typeof fetch,
	session: Stripe.Checkout.Session,
	lineItems: Stripe.LineItem[],
	requestId = createRequestId()
): Promise<void> {
	const scope = 'sanity.createOrderFromCheckoutSession';
	const paymentIntent =
		typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;

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
		status: session.payment_status === 'paid' ? 'paid' : 'pending',
		items,
		metadata: JSON.stringify(session.metadata ?? {}),
		paidAt: session.payment_status === 'paid' ? new Date().toISOString() : undefined,
		receivedAt: new Date().toISOString()
	};

	await sanityMutate(externalFetch, [{ createIfNotExists: orderDoc }], { scope, requestId });
}
