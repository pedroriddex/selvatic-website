import { checkoutPageActions, loadCheckoutPage } from '$lib/features/checkout/server/checkout-page';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ url, fetch }) => loadCheckoutPage(url, fetch)) satisfies PageServerLoad;

export const actions = checkoutPageActions satisfies Actions;
