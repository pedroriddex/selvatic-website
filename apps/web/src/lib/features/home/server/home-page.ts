import { createRequestId } from '$lib/server/logger';
import { getPageContentResult, getProductsResult, getServicesResult, mergeDataHealth } from '$lib/server/sanity';

export async function loadHomePage(fetchFn: typeof fetch) {
	const requestId = createRequestId();
	const [productsResult, servicesResult] = await Promise.all([
		getProductsResult(fetchFn, requestId),
		getServicesResult(fetchFn, requestId)
	]);
	const pageContentResult = await getPageContentResult(fetchFn, 'home', requestId);

	return {
		products: productsResult.products.slice(0, 8),
		services: servicesResult.services.slice(0, 3),
		pageContent: pageContentResult.page,
		dataHealth: {
			products: productsResult.dataHealth,
			services: servicesResult.dataHealth,
			pageContent: pageContentResult.dataHealth,
			overall: mergeDataHealth(productsResult.dataHealth, servicesResult.dataHealth, pageContentResult.dataHealth)
		}
	};
}
