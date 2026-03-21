import type { ContactRequestInput, DataHealth, Product, Service } from '$lib/types';
import type Stripe from 'stripe';
import { dev } from '$app/environment';
import { resolveProductImageUrl } from '$lib/config/product-images';
import { combineDataHealth, DATA_HEALTH_OK, dataHealthFromError } from './data-health';
import { isCriticalDataError, toAppError } from './errors';
import { createRequestId, logger } from './logger';
import { mapProduct, mapService } from './sanity-mappers';
import { sanityMutate, sanityQuery } from './sanity-client';
import { productBySlugQuery, productListQuery, serviceListQuery } from './sanity-queries';

type ProductsResult = {
	products: Product[];
	dataHealth: DataHealth;
};

type ServicesResult = {
	services: Service[];
	dataHealth: DataHealth;
};

const withLaunchProductImage = (product: Product): Product => ({
	...product,
	imageUrl: resolveProductImageUrl(product.slug, product.imageUrl)
});

// Sanity is an external API. Using the request-scoped SvelteKit fetch here forwards
// origin metadata from the incoming page request, which can trip Sanity CORS rules
// in local development. The server-global fetch avoids that issue cleanly.
const externalFetch: typeof fetch = (...args) => globalThis.fetch(...args);

const sanitize = (value: string): string => value.replace(/[^a-zA-Z0-9_.-]/g, '-');

const toNumber = (value: unknown, fallback = 0): number => {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === 'string') {
		const parsed = Number.parseFloat(value);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}

	return fallback;
};

export async function getProductsResult(fetchFn: typeof fetch, requestId = createRequestId()): Promise<ProductsResult> {
	const scope = 'sanity.getProducts';

	try {
		const result = await sanityQuery<Record<string, unknown>[]>(externalFetch, productListQuery, {}, { scope, requestId });
		return {
			products: result
				.map(mapProduct)
				.filter((product): product is Product => product !== null)
				.map(withLaunchProductImage),
			dataHealth: DATA_HEALTH_OK
		};
	} catch (error) {
		const normalized = toAppError(error, {
			scope,
			requestId,
			message: 'No se pudieron cargar los productos.'
		});

		logger.error(normalized, {
			scope,
			requestId,
			message: 'No se pudieron cargar los productos.'
		});

		if (!dev && isCriticalDataError(normalized)) {
			throw normalized;
		}

		return {
			products: [],
			dataHealth: dataHealthFromError(normalized, {
				scope,
				requestId,
				message: 'No se pudieron cargar productos en este momento.'
			})
		};
	}
}

export async function getServicesResult(fetchFn: typeof fetch, requestId = createRequestId()): Promise<ServicesResult> {
	const scope = 'sanity.getServices';

	try {
		const result = await sanityQuery<Record<string, unknown>[]>(externalFetch, serviceListQuery, {}, { scope, requestId });
		return {
			services: result.map(mapService).filter((service): service is Service => service !== null),
			dataHealth: DATA_HEALTH_OK
		};
	} catch (error) {
		const normalized = toAppError(error, {
			scope,
			requestId,
			message: 'No se pudieron cargar los servicios.'
		});

		logger.error(normalized, {
			scope,
			requestId,
			message: 'No se pudieron cargar los servicios.'
		});

		if (!dev && isCriticalDataError(normalized)) {
			throw normalized;
		}

		return {
			services: [],
			dataHealth: dataHealthFromError(normalized, {
				scope,
				requestId,
				message: 'No se pudieron cargar servicios en este momento.'
			})
		};
	}
}

export async function getProducts(fetchFn: typeof fetch): Promise<Product[]> {
	const { products } = await getProductsResult(fetchFn);
	return products;
}

export async function getServices(fetchFn: typeof fetch): Promise<Service[]> {
	const { services } = await getServicesResult(fetchFn);
	return services;
}

export async function getProductBySlug(
	fetchFn: typeof fetch,
	slug: string,
	requestId = createRequestId()
): Promise<Product | null> {
	const scope = 'sanity.getProductBySlug';
	const result = await sanityQuery<Record<string, unknown> | null>(
		externalFetch,
		productBySlugQuery,
		{ slug },
		{ scope, requestId }
	);

	if (!result) {
		return null;
	}

	const product = mapProduct(result);
	return product ? withLaunchProductImage(product) : null;
}

export async function createContactRequest(
	fetchFn: typeof fetch,
	input: ContactRequestInput,
	requestId = createRequestId()
): Promise<void> {
	const scope = 'sanity.createContactRequest';
	const contactDoc = {
		_type: 'contactRequest',
		name: input.name,
		email: input.email,
		phone: input.phone,
		service: input.service,
		message: input.message,
		sourcePage: input.sourcePage ?? '/contacto',
		status: 'new',
		receivedAt: new Date().toISOString()
	};

	await sanityMutate(externalFetch, [{ create: contactDoc }], { scope, requestId });
}

export async function createOrderFromCheckoutSession(
	fetchFn: typeof fetch,
	session: Stripe.Checkout.Session,
	lineItems: Stripe.LineItem[],
	requestId = createRequestId()
): Promise<void> {
	const scope = 'sanity.createOrderFromCheckoutSession';
	const paymentIntent =
		typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;

	const items = lineItems.map((line) => {
		const quantity = Math.max(1, line.quantity ?? 1);
		const unitAmount = toNumber(line.amount_subtotal, 0) / quantity;
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
			amountSubtotal: toNumber(line.amount_subtotal, 0) / 100,
			amountTotal: toNumber(line.amount_total, 0) / 100,
			unitAmount: unitAmount / 100,
			currency: (line.currency ?? session.currency ?? 'eur').toUpperCase(),
			stripePriceId: priceId,
			stripeProductId
		};
	});

	const orderId = `order.${sanitize(session.id)}`;
	const orderDoc = {
		_id: orderId,
		_type: 'order',
		orderNumber: session.id,
		stripeSessionId: session.id,
		stripePaymentIntentId: paymentIntent,
		customerEmail: session.customer_details?.email,
		amountTotal: toNumber(session.amount_total, 0) / 100,
		currency: (session.currency ?? 'eur').toUpperCase(),
		status: session.payment_status === 'paid' ? 'paid' : 'pending',
		items,
		metadata: JSON.stringify(session.metadata ?? {}),
		paidAt: session.payment_status === 'paid' ? new Date().toISOString() : undefined,
		receivedAt: new Date().toISOString()
	};

	await sanityMutate(externalFetch, [{ createIfNotExists: orderDoc }], { scope, requestId });
}

export const mergeDataHealth = (...items: DataHealth[]): DataHealth => combineDataHealth(...items);
