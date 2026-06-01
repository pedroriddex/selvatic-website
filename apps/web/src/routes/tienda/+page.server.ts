import { loadCatalogPage } from '$lib/features/catalog/server/catalog-page';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, url }) => loadCatalogPage(fetch, url)) satisfies PageServerLoad;
