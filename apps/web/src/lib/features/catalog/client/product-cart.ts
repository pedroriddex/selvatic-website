import { ONLINE_STORE_ENABLED, STORE_LOCK_TITLE } from '$lib/config/store';
import { addItemToCart } from '$lib/state/cart';
import { showCartNotice, showNotice } from '$lib/state/cart-notice';
import type { Product } from '$lib/types';

export const addProductToCartWithFeedback = (
	product: Pick<Product, 'slug' | 'name' | 'imageUrl' | 'price' | 'currency' | 'stock'>
) => {
	if (!ONLINE_STORE_ENABLED) {
		showNotice(STORE_LOCK_TITLE, 2400);
		return {
			ok: false,
			error: STORE_LOCK_TITLE,
			locked: true
		} as const;
	}

	const result = addItemToCart({
		slug: product.slug,
		name: product.name,
		imageUrl: product.imageUrl,
		price: product.price,
		currency: product.currency,
		stock: product.stock,
		quantity: 1
	});

	if (result.ok) {
		showCartNotice(product.name, 1);
		return {
			ok: true,
			locked: false
		} as const;
	}

	return {
		ok: false,
		error: result.error,
		locked: false
	} as const;
};
