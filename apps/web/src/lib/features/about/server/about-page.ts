import { createRequestId } from '$lib/server/logger';
import { getPageContentResult } from '$lib/server/sanity';

export async function loadAboutPage(fetchFn: typeof fetch) {
	const requestId = createRequestId();
	const pageContentResult = await getPageContentResult(fetchFn, 'about', requestId);

	return {
		pageContent: pageContentResult.page,
		dataHealth: pageContentResult.dataHealth
	};
}
