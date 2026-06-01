import { describe, expect, it } from 'vitest';
import { mapProduct, mapService } from './sanity-mappers';

describe('sanity mappers', () => {
	it('maps a product entity', () => {
		const mapped = mapProduct({
			_id: 'product-01',
			name: 'Ramo Test',
			slug: 'ramo-test',
			category: 'ramos-secos',
			description: 'Descripción',
			imageUrl: 'https://cdn.test/image.webp',
			gallery: [],
			price: 35,
			currency: 'eur',
			stock: 7,
			stripePriceId: 'price_123',
			isActive: true
		});

		expect(mapped).toEqual({
			id: 'product-01',
			documentId: 'product-01',
			name: 'Ramo Test',
			slug: 'ramo-test',
			category: 'ramos-secos',
			description: 'Descripción',
			imageUrl: 'https://cdn.test/image.webp',
			gallery: [],
			price: 35,
			currency: 'EUR',
			stock: 7,
			stripePriceId: 'price_123',
			isActive: true
		});
	});


	it('uses the selected primary product gallery image', () => {
		const mapped = mapProduct({
			_id: 'product-gallery',
			name: 'Producto con galería',
			slug: 'producto-galeria',
			category: 'plantas',
			legacyImageUrl: 'https://cdn.test/legacy.webp',
			gallery: [
				{ url: 'https://cdn.test/secondary.webp', alt: 'Secundaria', isPrimary: false },
				{ url: 'https://cdn.test/main.webp', alt: 'Principal', isPrimary: true }
			],
			price: 42,
			currency: 'eur',
			stock: 3
		});

		expect(mapped?.imageUrl).toBe('https://cdn.test/main.webp');
		expect(mapped?.gallery).toEqual([
			{ url: 'https://cdn.test/secondary.webp', alt: 'Secundaria', isPrimary: false },
			{ url: 'https://cdn.test/main.webp', alt: 'Principal', isPrimary: true }
		]);
	});

	it('returns null for incomplete entities', () => {
		expect(
			mapProduct({
				_id: '',
				name: 'Sin id',
				slug: 'sin-id',
				category: 'ramos-secos'
			})
		).toBeNull();
	});

	it('sets category as null when it is invalid', () => {
		const mapped = mapProduct({
			_id: 'product-02',
			name: 'Producto sin categoría válida',
			slug: 'producto-sin-categoria',
			category: 'otro',
			price: 10,
			currency: 'eur',
			stock: 2
		});

		expect(mapped?.category).toBeNull();
	});

	it('maps a service entity with defaults', () => {
		const mapped = mapService({
			_id: 'service-01',
			title: 'Decoración',
			slug: 'decoracion',
			summary: 'Resumen',
			content: 'Contenido',
			startingPrice: 120
		});

		expect(mapped).toEqual({
			id: 'service-01',
			documentId: 'service-01',
			title: 'Decoración',
			slug: 'decoracion',
			summary: 'Resumen',
			content: 'Contenido',
			startingPrice: 120,
			featured: false
		});
	});
});
