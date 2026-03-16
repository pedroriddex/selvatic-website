import { STRIPE_SECRET_KEY } from '$env/static/private';
import Stripe from 'stripe';
import { AppException } from './errors';

let stripeClient: Stripe | undefined;

export function getStripeClient(): Stripe {
	if (!STRIPE_SECRET_KEY) {
		throw new AppException({
			code: 'CONFIG',
			scope: 'stripe.getStripeClient',
			message: 'Falta STRIPE_SECRET_KEY en apps/web/.env'
		});
	}

	if (!stripeClient) {
		stripeClient = new Stripe(STRIPE_SECRET_KEY);
	}

	return stripeClient;
}
