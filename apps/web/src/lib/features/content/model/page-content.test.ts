import { describe, expect, it } from 'vitest';
import { getDefaultPageContent, mergePageContent, textFor } from './page-content';

describe('borrado editorial de textos', () => {
	it('si el documento existe, SUS textos mandan: un campo ausente o vacío se oculta', () => {
		const merged = mergePageContent('about', {
			key: 'about',
			texts: { 'intro.title': 'Título propio', 'origin.p2': '' },
			images: {},
			galleries: {}
		});

		expect(textFor(merged, 'intro.title')).toBe('Título propio');
		// '' guardado = vacío intencionado.
		expect(textFor(merged, 'origin.p2')).toBe('');
		// Ausente en un documento existente = borrado con unset: también vacío
		// (las claves nuevas de código se siembran con backfill-page-texts.mjs).
		expect(textFor(merged, 'origin.p1')).toBe('');
	});

	it('sin documento (Sanity caído o página sin sembrar) se usan los textos de serie', () => {
		const merged = mergePageContent('about', null);
		expect(textFor(merged, 'origin.p1')).toBe(getDefaultPageContent('about').texts['origin.p1']);
	});

	it('una clave desconocida devuelve cadena vacía, nunca la clave cruda', () => {
		const content = getDefaultPageContent('about');
		expect(textFor(content, 'no.existe')).toBe('');
	});
});
