import { describe, expect, it } from 'vitest';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
	it('formats EUR amounts with locale', () => {
		expect(formatCurrency(12.5, 'eur', 'es-ES')).toContain('12,50');
	});

	it('falls back when currency is invalid', () => {
		expect(formatCurrency(10, 'INVALID', 'es-ES')).toBe('€10.00');
	});
});

