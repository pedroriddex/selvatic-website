import { getServicesResult } from '$lib/server/sanity';
import { createRequestId } from '$lib/server/logger';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	const requestId = createRequestId();
	const servicesResult = await getServicesResult(fetch, requestId);

	return {
		services: servicesResult.services,
		dataHealth: servicesResult.dataHealth
	};
}) satisfies PageServerLoad;
