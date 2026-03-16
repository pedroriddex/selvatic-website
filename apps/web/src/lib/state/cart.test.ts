import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$app/environment', () => ({
	browser: true,
	dev: true
}));

import {
	CART_SHIPPING_AMOUNT,
	addItemToCart,
	cartStore,
	clearCart,
	hydrateCart,
	removeItemFromCart,
	setCartItemQuantity
} from './cart';

describe('cart store', () => {
	beforeEach(() => {
		localStorage.clear();
		clearCart();
		hydrateCart();
	});

	it('adds a product and calculates totals', () => {
		const result = addItemToCart({
			slug: 'ramo-01',
			name: 'Ramo Test',
			price: 40,
			currency: 'EUR',
			stock: 8
		});

		expect(result.ok).toBe(true);

		const snapshot = get(cartStore);
		expect(snapshot.count).toBe(1);
		expect(snapshot.subtotal).toBe(40);
		expect(snapshot.shipping).toBe(CART_SHIPPING_AMOUNT);
		expect(snapshot.total).toBe(40 + CART_SHIPPING_AMOUNT);
		expect(snapshot.currency).toBe('EUR');
	});

	it('prevents mixed currencies', () => {
		addItemToCart({
			slug: 'ramo-01',
			name: 'Ramo Test',
			price: 40,
			currency: 'EUR',
			stock: 8
		});

		const result = addItemToCart({
			slug: 'bouquet-usd',
			name: 'Bouquet USD',
			price: 44,
			currency: 'USD',
			stock: 4
		});

		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toContain('No puedes mezclar monedas');
		}
	});

	it('clamps quantity by stock and removes items', () => {
		addItemToCart({
			slug: 'ramo-01',
			name: 'Ramo Test',
			price: 40,
			currency: 'EUR',
			stock: 2
		});

		setCartItemQuantity('ramo-01', 10);
		let snapshot = get(cartStore);
		expect(snapshot.items[0]?.quantity).toBe(2);

		removeItemFromCart('ramo-01');
		snapshot = get(cartStore);
		expect(snapshot.items).toHaveLength(0);
		expect(snapshot.total).toBe(0);
	});
});

