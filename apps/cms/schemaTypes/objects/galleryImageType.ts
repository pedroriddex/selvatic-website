import { defineField, defineType } from 'sanity';
import { ProductImageIcon } from '../shared/icons';

export const galleryImageType = defineType({
	name: 'galleryImage',
	title: 'Imagen de galería',
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
		})
	],
	preview: {
		select: {
			title: 'alt',
			media: 'image'
		},
		prepare(selection: { title?: string; media?: unknown }) {
			return {
				title: selection.title || 'Imagen de galería',
				media: selection.media as never
			};
		}
	}
});
