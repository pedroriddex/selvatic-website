import { describe, expect, it } from 'vitest';
import {
	DEFAULT_SHIPPING_OUT_OF_RANGE_MESSAGE,
	getShippingRestriction,
	isPostalCodeAllowed,
	normalizePostalCode
} from './postal-codes';

describe('normalizePostalCode', () => {
	it('acepta 5 dígitos con espacios o separadores', () => {
		expect(normalizePostalCode('46001')).toBe('46001');
		expect(normalizePostalCode(' 46 001 ')).toBe('46001');
	});

	it('rechaza longitudes distintas de 5 y valores no textuales', () => {
		expect(normalizePostalCode('4600')).toBeNull();
		expect(normalizePostalCode('460011')).toBeNull();
		expect(normalizePostalCode('')).toBeNull();
		expect(normalizePostalCode(undefined)).toBeNull();
	});
});

describe('getShippingRestriction', () => {
	it('sin ajustes: desactivada con mensaje por defecto', () => {
		const restriction = getShippingRestriction(null);
		expect(restriction.enabled).toBe(false);
		expect(restriction.outOfRangeMessage).toBe(DEFAULT_SHIPPING_OUT_OF_RANGE_MESSAGE);
	});

	it('activada pero con lista vacía o inválida: NO bloquea ventas', () => {
		const restriction = getShippingRestriction({
			shippingPostalCodesEnabled: true,
			shippingPostalCodes: ['abc', '12']
		});
		expect(restriction.enabled).toBe(false);
	});

	it('normaliza la lista y respeta el mensaje personalizado', () => {
		const restriction = getShippingRestriction({
			shippingPostalCodesEnabled: true,
			shippingPostalCodes: [' 46001 ', '46920'],
			shippingOutOfRangeMessage: 'Fuera de zona.'
		});
		expect(restriction.enabled).toBe(true);
		expect(restriction.postalCodes).toEqual(['46001', '46920']);
		expect(restriction.outOfRangeMessage).toBe('Fuera de zona.');
	});
});

describe('isPostalCodeAllowed', () => {
	const restriction = getShippingRestriction({
		shippingPostalCodesEnabled: true,
		shippingPostalCodes: ['46001', '46920']
	});

	it('permite códigos de la lista', () => {
		expect(isPostalCodeAllowed(restriction, '46001')).toBe(true);
		expect(isPostalCodeAllowed(restriction, ' 46 920 ')).toBe(true);
	});

	it('bloquea códigos fuera de la lista o inválidos', () => {
		expect(isPostalCodeAllowed(restriction, '28001')).toBe(false);
		expect(isPostalCodeAllowed(restriction, 'nada')).toBe(false);
	});

	it('con la restricción desactivada permite cualquier código', () => {
		const off = getShippingRestriction(null);
		expect(isPostalCodeAllowed(off, '99999')).toBe(true);
	});
});
