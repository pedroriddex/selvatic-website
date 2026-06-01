import { loadHomePage } from '$lib/features/home/server/home-page';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => loadHomePage(fetch)) satisfies PageServerLoad;
