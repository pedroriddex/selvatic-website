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
			variantGroups: [],
			stripePriceId: 'price_123',
			isActive: true
		});
	});

	it('maps product variant groups and drops invalid ones', () => {
		const mapped = mapProduct({
			_id: 'product-variants',
			name: 'Producto con variantes',
			slug: 'producto-variantes',
			category: 'ramos-secos',
			price: 25,
			currency: 'eur',
			stock: 4,
			variantGroups: [
				{
					name: 'Tamaño',
					required: true,
					options: [
						{ label: 'Pequeño', priceModifier: 0 },
						{ label: 'Grande', priceModifier: 8 },
						{ label: 'Sin nombre', priceModifier: -5 }
					]
				},
				{ name: 'Grupo sin opciones', required: false, options: [] },
				{ name: '', required: false, options: [{ label: 'X', priceModifier: 1 }] }
			]
		});

		expect(mapped?.variantGroups).toEqual([
			{
				name: 'Tamaño',
				required: true,
				// Sin pricingMode en el documento (datos antiguos) => modo 'add'.
				pricingMode: 'add',
				options: [
					{ label: 'Pequeño', priceModifier: 0, imageUrl: undefined },
					{ label: 'Grande', priceModifier: 8, imageUrl: undefined },
					{ label: 'Sin nombre', priceModifier: 0, imageUrl: undefined }
				]
			}
		]);
	});

	it('maps variant pricing mode and option image', () => {
		const mapped = mapProduct({
			_id: 'product-variants-set',
			name: 'Producto con precio por opción',
			slug: 'producto-precio-opcion',
			price: 25,
			currency: 'eur',
			stock: 4,
			variantGroups: [
				{
					name: 'Tamaño',
					required: true,
					pricingMode: 'set',
					options: [{ label: 'Grande', priceModifier: 42, imageUrl: 'https://cdn.test/grande.webp' }]
				}
			]
		});

		expect(mapped?.variantGroups[0]?.pricingMode).toBe('set');
		expect(mapped?.variantGroups[0]?.options[0]?.imageUrl).toBe('https://cdn.test/grande.webp');
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
