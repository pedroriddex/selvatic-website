import { getProductsResult, getServicesResult, mergeDataHealth } from '$lib/server/sanity';
import { createRequestId } from '$lib/server/logger';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	const requestId = createRequestId();
	const [productsResult, servicesResult] = await Promise.all([
		getProductsResult(fetch, requestId),
		getServicesResult(fetch, requestId)
	]);

	return {
		products: productsResult.products.slice(0, 8),
		services: servicesResult.services.slice(0, 3),
		dataHealth: {
			products: productsResult.dataHealth,
			services: servicesResult.dataHealth,
			overall: mergeDataHealth(productsResult.dataHealth, servicesResult.dataHealth)
		}
	};
}) satisfies PageServerLoad;
