import { loadServicesPage } from '$lib/features/services/server/services-page';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => loadServicesPage(fetch)) satisfies PageServerLoad;
