import { createRequestId } from '$lib/server/logger';
import { getPageContentResult, getServicesResult } from '$lib/server/sanity';

export async function loadServicesPage(fetchFn: typeof fetch) {
	const requestId = createRequestId();
	const [servicesResult, pageContentResult] = await Promise.all([
		getServicesResult(fetchFn, requestId),
		getPageContentResult(fetchFn, 'services', requestId)
	]);

	return {
		services: servicesResult.services,
		pageContent: pageContentResult.page,
		dataHealth: servicesResult.dataHealth
	};
}
