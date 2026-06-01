import { defineField, defineType } from 'sanity';
import { ProductImageIcon } from '../shared/icons';

export const productImageType = defineType({
	name: 'productImage',
	title: 'Imagen de producto',
	icon: ProductImageIcon,
	type: 'object',
	fields: [
		defineField({
			name: 'image',
			title: 'Imagen',
			type: 'image',
			options: { hotspot: true },
			validation: (rule) => rule.required()
		}),
		defineField({
			name: 'alt',
			title: 'Texto alternativo',
			type: 'string',
			description: 'Describe brevemente la imagen para accesibilidad y SEO.'
		}),
		defineField({
			name: 'isPrimary',
			title: 'Usar como imagen principal',
			type: 'boolean',
			initialValue: false,
			description: 'Esta será la imagen que aparece en las tarjetas de producto.'
		})
	],
	preview: {
		select: {
			title: 'alt',
			isPrimary: 'isPrimary',
			media: 'image'
		},
		prepare(selection: { title?: string; isPrimary?: boolean; media?: unknown }) {
			return {
				title: selection.title || 'Imagen de producto',
				subtitle: selection.isPrimary ? 'Imagen principal' : undefined,
				media: selection.media
			};
		}
	}
});
