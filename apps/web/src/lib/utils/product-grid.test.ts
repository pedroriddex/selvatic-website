import { describe, expect, it } from 'vitest';
import {
	getBestSellerProductSpan,
	getCatalogProductSpan,
	getFeaturedProductSpan,
	getRelatedProductSpan
} from './product-grid';

describe('product-grid utils', () => {
	it('returns featured spans', () => {
		expect(getFeaturedProductSpan(0)).toContain('xl:col-span-8');
		expect(getFeaturedProductSpan(2)).toContain('xl:col-span-4');
	});

	it('returns best seller spans', () => {
		expect(getBestSellerProductSpan(0)).toContain('xl:col-span-6');
		expect(getBestSellerProductSpan(2)).toContain('xl:col-span-3');
	});

	it('returns catalog spans', () => {
		expect(getCatalogProductSpan(0)).toContain('xl:col-span-6');
		expect(getCatalogProductSpan(5)).toContain('xl:col-span-6');
		expect(getCatalogProductSpan(2)).toContain('xl:col-span-3');
	});

	it('returns related spans', () => {
		expect(getRelatedProductSpan(0)).toContain('xl:col-span-6');
		expect(getRelatedProductSpan(1)).toContain('xl:col-span-3');
	});
});

