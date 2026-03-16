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
			price: 35,
			currency: 'EUR',
			stock: 7,
			stripePriceId: 'price_123',
			isActive: true
		});
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
