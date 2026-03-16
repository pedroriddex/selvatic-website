import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { closeProductLightbox, openProductLightbox, productLightbox } from './product-lightbox';

describe('product lightbox store', () => {
	it('opens and closes with provided payload', () => {
		openProductLightbox('/media/producto.webp', 'Producto');
		expect(get(productLightbox)).toEqual({
			open: true,
			src: '/media/producto.webp',
			alt: 'Producto'
		});

		closeProductLightbox();
		expect(get(productLightbox)).toEqual({
			open: false,
			src: '',
			alt: ''
		});
	});

	it('ignores open when src is empty', () => {
		closeProductLightbox();
		openProductLightbox('', 'Sin imagen');
		expect(get(productLightbox).open).toBe(false);
	});
});

