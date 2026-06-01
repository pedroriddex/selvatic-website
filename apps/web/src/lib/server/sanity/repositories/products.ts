import { dev } from '$app/environment';
import type { DataHealth, Product } from '$lib/types';
import { combineDataHealth, DATA_HEALTH_OK, dataHealthFromError } from '$lib/server/data-health';
import { isCriticalDataError, toAppError } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { sanityQuery } from '../client';
import { mapProduct } from '../mappers';
import { productBySlugQuery, productListQuery } from '../queries';
import { externalFetch } from '../shared';

export type ProductsResult = {
	products: Product[];
	dataHealth: DataHealth;
};

export async function getProductsResult(
	_fetchFn: typeof fetch,
	requestId = createRequestId()
): Promise<ProductsResult> {
	const scope = 'sanity.getProducts';

	try {
		const result = await sanityQuery<Record<string, unknown>[]>(
			externalFetch,
			productListQuery,
			{},
			{ scope, requestId }
		);

		return {
			products: result.map(mapProduct).filter((product): product is Product => product !== null),
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

export async function getProducts(fetchFn: typeof fetch): Promise<Product[]> {
	const { products } = await getProductsResult(fetchFn);
	return products;
}

export async function getProductBySlug(
	_fetchFn: typeof fetch,
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

	return mapProduct(result);
}

export const mergeProductHealth = (...items: DataHealth[]): DataHealth => combineDataHealth(...items);
