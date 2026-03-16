import { writable } from 'svelte/store';

export type ProductLightboxState = {
	open: boolean;
	src: string;
	alt: string;
};

const initialState: ProductLightboxState = {
	open: false,
	src: '',
	alt: ''
};

const { subscribe, set } = writable<ProductLightboxState>(initialState);

export const productLightbox = {
	subscribe
};

export const openProductLightbox = (src: string, alt: string): void => {
	if (!src) {
		return;
	}

	set({
		open: true,
		src,
		alt
	});
};

export const closeProductLightbox = (): void => {
	set(initialState);
};
