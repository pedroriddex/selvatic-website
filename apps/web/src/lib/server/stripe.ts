import { env } from '$env/dynamic/private';
import Stripe from 'stripe';
import { AppException } from './errors';

let stripeClient: Stripe | undefined;

export function getStripeClient(): Stripe {
	const secretKey = env.STRIPE_SECRET_KEY?.trim();

	if (!secretKey) {
		throw new AppException({
			code: 'CONFIG',
			scope: 'stripe.getStripeClient',
			message: 'Falta STRIPE_SECRET_KEY en las variables de entorno.'
		});
	}

	if (!stripeClient) {
		stripeClient = new Stripe(secretKey);
	}

	return stripeClient;
}
