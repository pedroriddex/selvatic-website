import { writable } from 'svelte/store';

export type CartNoticeState = {
	visible: boolean;
	message: string;
};

const initialState: CartNoticeState = {
	visible: false,
	message: ''
};

const { subscribe, set } = writable<CartNoticeState>(initialState);
let hideTimer: ReturnType<typeof setTimeout> | undefined;

const clearHideTimer = (): void => {
	if (hideTimer) {
		clearTimeout(hideTimer);
		hideTimer = undefined;
	}
};

export const cartNoticeStore = {
	subscribe
};

export const showCartNotice = (productName: string, qty = 1): void => {
	const normalizedName = productName.trim() || 'Producto';
	const normalizedQty = Number.isFinite(qty) ? Math.max(1, Math.trunc(qty)) : 1;

	clearHideTimer();
	set({
		visible: true,
		message: `+${normalizedQty} ${normalizedName}`
	});

	hideTimer = setTimeout(() => {
		set(initialState);
		hideTimer = undefined;
	}, 1800);
};

export const clearCartNotice = (): void => {
	clearHideTimer();
	set(initialState);
};
