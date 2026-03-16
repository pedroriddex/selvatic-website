import { dev } from '$app/environment';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { toAppError } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { createOrderFromCheckoutSession } from '$lib/server/sanity';
import { getStripeClient } from '$lib/server/stripe';
import { json } from '@sveltejs/kit';
import type Stripe from 'stripe';

export const POST = async ({ request, fetch }) => {
	const requestId = createRequestId();

	if (!STRIPE_WEBHOOK_SECRET) {
		const message = 'Falta STRIPE_WEBHOOK_SECRET para validar el webhook de Stripe.';
		logger.error(
			new Error(message),
			{
				scope: 'stripe.webhook.config',
				requestId,
				code: 'CONFIG'
			}
		);
		return json({ error: message, requestId, environment: dev ? 'development' : 'production' }, { status: 500 });
	}

	const signature = request.headers.get('stripe-signature');
	if (!signature) {
		return json({ error: 'Falta cabecera stripe-signature' }, { status: 400 });
	}

	const rawBody = await request.text();

	let event: Stripe.Event;
	try {
		const stripe = getStripeClient();
		event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
	} catch (error) {
		logger.error(error, {
			scope: 'stripe.webhook.signature',
			requestId,
			message: 'Firma de webhook Stripe inválida.'
		});
		return json({ error: 'Firma inválida' }, { status: 400 });
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object as Stripe.Checkout.Session;
		try {
			const stripe = getStripeClient();
			const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
				limit: 100,
				expand: ['data.price.product']
			});

			await createOrderFromCheckoutSession(fetch, session, lineItems.data, requestId);
		} catch (rawError) {
			const normalized = toAppError(rawError, {
				scope: 'stripe.webhook.persistOrder',
				requestId,
				message: `No se pudo persistir pedido para sesión ${session.id}.`
			});

			logger.error(normalized, {
				scope: 'stripe.webhook.persistOrder',
				requestId,
				details: {
					sessionId: session.id
				}
			});

			return json({ error: 'No se pudo persistir el pedido.', requestId }, { status: 500 });
		}
	}

	return json({ received: true });
};
