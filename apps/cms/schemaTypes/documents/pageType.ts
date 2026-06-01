import { defineField, defineType } from 'sanity';
import { PagesIcon } from '../shared/icons';
import { PAGE_LABELS, PAGE_OPTIONS, PAGE_ROUTES, type PageKey } from '../shared/pages';

export const pageType = defineType({
	name: 'page',
	title: 'Páginas',
	icon: PagesIcon,
	type: 'document',
	fields: [
		defineField({
			name: 'key',
			title: 'Página',
			type: 'string',
			readOnly: true,
			options: {
				list: PAGE_OPTIONS.map((page) => ({ title: page.title, value: page.value }))
			},
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'title',
			title: 'Nombre interno',
			type: 'string',
			readOnly: true,
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'route',
			title: 'Ruta',
			type: 'string',
			readOnly: true
		}),
		defineField({
			name: 'seoTitle',
			title: 'Título SEO',
			type: 'string',
			description: 'Título que puede mostrarse en la pestaña del navegador y buscadores.'
		}),
		defineField({
			name: 'seoDescription',
			title: 'Descripción SEO',
			type: 'text',
			rows: 3
		}),
		defineField({
			name: 'texts',
			title: 'Textos de la página',
			type: 'array',
			of: [{ type: 'pageTextBlock' }],
			description: 'Edita únicamente el campo “Texto”. Las claves internas ayudan a mantener la web conectada.'
		})
	],
	preview: {
		select: {
			key: 'key',
			route: 'route'
		},
		prepare(selection: { key?: PageKey; route?: string }) {
			return {
				title: selection.key ? PAGE_LABELS[selection.key] : 'Página',
				subtitle: selection.route || (selection.key ? PAGE_ROUTES[selection.key] : undefined)
			};
		}
	}
});
