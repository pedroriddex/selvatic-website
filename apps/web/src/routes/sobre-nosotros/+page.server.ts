import { loadAboutPage } from '$lib/features/about/server/about-page';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => loadAboutPage(fetch)) satisfies PageServerLoad;
