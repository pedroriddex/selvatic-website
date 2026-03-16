import { get } from 'svelte/store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cartNoticeStore, clearCartNotice, showCartNotice } from './cart-notice';

describe('cart notice store', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		clearCartNotice();
	});

	afterEach(() => {
		clearCartNotice();
		vi.useRealTimers();
	});

	it('shows notice message and auto-hides', () => {
		showCartNotice('Ramo Bruma', 1);
		expect(get(cartNoticeStore)).toEqual({
			visible: true,
			message: '+1 Ramo Bruma'
		});

		vi.advanceTimersByTime(1800);
		expect(get(cartNoticeStore)).toEqual({
			visible: false,
			message: ''
		});
	});

	it('replaces previous message and resets timer', () => {
		showCartNotice('Producto A', 1);
		vi.advanceTimersByTime(1000);
		showCartNotice('Producto B', 2);
		expect(get(cartNoticeStore).message).toBe('+2 Producto B');

		vi.advanceTimersByTime(1700);
		expect(get(cartNoticeStore).visible).toBe(true);

		vi.advanceTimersByTime(100);
		expect(get(cartNoticeStore).visible).toBe(false);
	});
});

