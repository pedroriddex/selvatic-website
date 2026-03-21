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

export const showNotice = (message: string, duration = 1800): void => {
	clearHideTimer();
	set({
		visible: true,
		message
	});

	hideTimer = setTimeout(() => {
		set(initialState);
		hideTimer = undefined;
	}, duration);
};

export const showCartNotice = (productName: string, qty = 1): void => {
	const normalizedName = productName.trim() || 'Producto';
	const normalizedQty = Number.isFinite(qty) ? Math.max(1, Math.trunc(qty)) : 1;
	showNotice(`+${normalizedQty} ${normalizedName}`);
};

export const clearCartNotice = (): void => {
	clearHideTimer();
	set(initialState);
};
