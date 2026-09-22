import { describe, expect, it } from 'vitest';
import { getDefaultPageContent, mergePageContent, textFor } from './page-content';

describe('borrado editorial de textos', () => {
	it("un '' guardado en el CMS gana al texto de serie (campo vaciado a propósito)", () => {
		const merged = mergePageContent('about', {
			key: 'about',
			texts: { 'origin.p2': '' },
			images: {},
			galleries: {}
		});

		expect(textFor(merged, 'origin.p2')).toBe('');
		// Los campos ausentes siguen cayendo al texto de serie.
		expect(textFor(merged, 'origin.p1')).toBe(getDefaultPageContent('about').texts['origin.p1']);
	});

	it('una clave desconocida devuelve cadena vacía, nunca la clave cruda', () => {
		const content = getDefaultPageContent('about');
		expect(textFor(content, 'no.existe')).toBe('');
	});
});
