import { contactPageActions, loadContactPage } from '$lib/features/contact/server/contact-page';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ fetch }) => loadContactPage(fetch)) satisfies PageServerLoad;

export const actions = contactPageActions satisfies Actions;
