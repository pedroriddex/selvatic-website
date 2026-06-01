import { loadCatalogProductPage } from '$lib/features/catalog/server/catalog-page';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, params }) =>
	loadCatalogProductPage(fetch, params.slug)) satisfies PageServerLoad;
