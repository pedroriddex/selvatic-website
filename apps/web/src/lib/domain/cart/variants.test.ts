import { describe, expect, it } from 'vitest';
import {
	canonicalSelectionSignature,
	computeEffectiveUnitAmountCents,
	lineIdFor,
	normalizeSelections
} from './variants';
import type { VariantGroup } from '$lib/domain/product/types';

const variantGroups: VariantGroup[] = [
	{
		name: 'Tamaño',
		required: true,
		pricingMode: 'add',
		options: [
			{ label: 'Pequeño', priceModifier: 0 },
			{ label: 'Grande', priceModifier: 8 }
		]
	},
	{
		name: 'Jarrón',
		required: false,
		pricingMode: 'add',
		options: [
			{ label: 'Sin jarrón', priceModifier: 0 },
			{ label: 'Con jarrón', priceModifier: 12 }
		]
	}
];

const product = { price: 25, variantGroups };

describe('selección canónica', () => {
	it('firma vacía sin selecciones', () => {
		expect(canonicalSelectionSignature([])).toBe('');
		expect(canonicalSelectionSignature(undefined)).toBe('');
	});

	it('la firma es independiente del orden', () => {
		const a = canonicalSelectionSignature([
			{ groupName: 'Tamaño', optionLabel: 'Grande' },
			{ groupName: 'Jarrón', optionLabel: 'Con jarrón' }
		]);
		const b = canonicalSelectionSignature([
			{ groupName: 'Jarrón', optionLabel: 'Con jarrón' },
			{ groupName: 'Tamaño', optionLabel: 'Grande' }
		]);
		expect(a).toBe(b);
	});

	it('normaliza y deduplica por grupo', () => {
		expect(
			normalizeSelections([
				{ groupName: ' Tamaño ', optionLabel: ' Grande ' },
				{ groupName: 'Tamaño', optionLabel: 'Pequeño' },
				{ groupName: '', optionLabel: 'x' }
			])
		).toEqual([{ groupName: 'Tamaño', optionLabel: 'Grande' }]);
	});

	it('lineId es el slug cuando no hay opciones, y compuesto cuando las hay', () => {
		expect(lineIdFor('ramo', [])).toBe('ramo');
		expect(lineIdFor('ramo', [{ groupName: 'Tamaño', optionLabel: 'Grande' }])).toBe(
			`ramo#${canonicalSelectionSignature([{ groupName: 'Tamaño', optionLabel: 'Grande' }])}`
		);
	});
});

describe('computeEffectiveUnitAmountCents', () => {
	it('suma los suplementos en céntimos', () => {
		const result = computeEffectiveUnitAmountCents(product, [
			{ groupName: 'Tamaño', optionLabel: 'Grande' },
			{ groupName: 'Jarrón', optionLabel: 'Con jarrón' }
		]);
		expect(result).toEqual({
			ok: true,
			amountCents: 2500 + 800 + 1200,
			resolved: [
				{ groupName: 'Jarrón', optionLabel: 'Con jarrón', priceModifier: 12 },
				{ groupName: 'Tamaño', optionLabel: 'Grande', priceModifier: 8 }
			]
		});
	});

	it('acepta solo el grupo obligatorio', () => {
		const result = computeEffectiveUnitAmountCents(product, [
			{ groupName: 'Tamaño', optionLabel: 'Pequeño' }
		]);
		expect(result).toEqual({ ok: true, amountCents: 2500, resolved: [{ groupName: 'Tamaño', optionLabel: 'Pequeño', priceModifier: 0 }] });
	});

	it('resuelve sin distinguir mayúsculas/acentos de entrada usando la etiqueta del producto', () => {
		const result = computeEffectiveUnitAmountCents(product, [
			{ groupName: 'tamaño', optionLabel: 'grande' }
		]);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.amountCents).toBe(3300);
			expect(result.resolved[0]).toEqual({ groupName: 'Tamaño', optionLabel: 'Grande', priceModifier: 8 });
		}
	});

	it('rechaza grupo obligatorio sin elegir', () => {
		const result = computeEffectiveUnitAmountCents(product, []);
		expect(result.ok).toBe(false);
	});

	it('rechaza opción inexistente', () => {
		const result = computeEffectiveUnitAmountCents(product, [
			{ groupName: 'Tamaño', optionLabel: 'Mediano' }
		]);
		expect(result.ok).toBe(false);
	});

	it('rechaza grupo inexistente', () => {
		const result = computeEffectiveUnitAmountCents(product, [
			{ groupName: 'Color', optionLabel: 'Rojo' }
		]);
		expect(result.ok).toBe(false);
	});

	it('rechaza dos opciones del mismo grupo', () => {
		const result = computeEffectiveUnitAmountCents(product, [
			{ groupName: 'Tamaño', optionLabel: 'Pequeño' },
			{ groupName: 'Tamaño', optionLabel: 'Grande' }
		]);
		expect(result.ok).toBe(false);
	});

	it('producto sin variantes: precio base', () => {
		const result = computeEffectiveUnitAmountCents({ price: 10, variantGroups: [] }, []);
		expect(result).toEqual({ ok: true, amountCents: 1000, resolved: [] });
	});

	it('rechaza precio base inválido', () => {
		const result = computeEffectiveUnitAmountCents({ price: 0, variantGroups: [] }, []);
		expect(result.ok).toBe(false);
	});
});

describe('modo de precio "set" (la opción fija el precio)', () => {
	const setGroups: VariantGroup[] = [
		{
			name: 'Tamaño',
			required: true,
			pricingMode: 'set',
			options: [
				{ label: 'Pequeño', priceModifier: 18 },
				{ label: 'Grande', priceModifier: 42 }
			]
		},
		{
			name: 'Jarrón',
			required: false,
			pricingMode: 'add',
			options: [{ label: 'Con jarrón', priceModifier: 12 }]
		}
	];
	const setProduct = { price: 25, variantGroups: setGroups };

	it('la opción sustituye al precio base', () => {
		const result = computeEffectiveUnitAmountCents(setProduct, [
			{ groupName: 'Tamaño', optionLabel: 'Grande' }
		]);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.amountCents).toBe(4200);
		}
	});

	it('los grupos "add" suman encima del precio fijado, sin importar el orden', () => {
		const directOrder = computeEffectiveUnitAmountCents(setProduct, [
			{ groupName: 'Tamaño', optionLabel: 'Pequeño' },
			{ groupName: 'Jarrón', optionLabel: 'Con jarrón' }
		]);
		const reversedOrder = computeEffectiveUnitAmountCents(setProduct, [
			{ groupName: 'Jarrón', optionLabel: 'Con jarrón' },
			{ groupName: 'Tamaño', optionLabel: 'Pequeño' }
		]);
		expect(directOrder).toEqual(reversedOrder);
		expect(directOrder.ok).toBe(true);
		if (directOrder.ok) {
			expect(directOrder.amountCents).toBe(1800 + 1200);
		}
	});

	it('sin elegir el grupo "set" opcional, se usa el precio base', () => {
		const optionalSet: VariantGroup[] = [
			{ ...setGroups[0], required: false }
		];
		const result = computeEffectiveUnitAmountCents({ price: 25, variantGroups: optionalSet }, []);
		expect(result).toEqual({ ok: true, amountCents: 2500, resolved: [] });
	});

	it('rechaza dos grupos "set" seleccionados (configuración inválida)', () => {
		const doubleSet: VariantGroup[] = [
			setGroups[0],
			{ ...setGroups[1], name: 'Formato', pricingMode: 'set' }
		];
		const result = computeEffectiveUnitAmountCents({ price: 25, variantGroups: doubleSet }, [
			{ groupName: 'Tamaño', optionLabel: 'Pequeño' },
			{ groupName: 'Formato', optionLabel: 'Con jarrón' }
		]);
		expect(result.ok).toBe(false);
	});

	it('rechaza opción "set" de importe 0 (dejaría el producto gratis)', () => {
		const freeSet: VariantGroup[] = [
			{
				name: 'Tamaño',
				required: true,
				pricingMode: 'set',
				options: [{ label: 'Pequeño', priceModifier: 0 }]
			}
		];
		const result = computeEffectiveUnitAmountCents({ price: 25, variantGroups: freeSet }, [
			{ groupName: 'Tamaño', optionLabel: 'Pequeño' }
		]);
		expect(result.ok).toBe(false);
	});

	it('grupos sin pricingMode se comportan como "add" (datos antiguos)', () => {
		const legacyGroups = [
			{
				name: 'Tamaño',
				required: false,
				options: [{ label: 'Grande', priceModifier: 8 }]
			}
		] as unknown as VariantGroup[];
		const result = computeEffectiveUnitAmountCents({ price: 25, variantGroups: legacyGroups }, [
			{ groupName: 'Tamaño', optionLabel: 'Grande' }
		]);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.amountCents).toBe(3300);
		}
	});
});
