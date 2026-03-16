import { defineField, defineType } from 'sanity';

export const serviceType = defineType({
	name: 'service',
	title: 'Servicios',
	type: 'document',
	fields: [
		defineField({ name: 'title', title: 'Título', type: 'string', validation: (rule) => rule.required().min(2) }),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (rule) => rule.required()
		}),
		defineField({ name: 'summary', title: 'Resumen', type: 'text', rows: 3 }),
		defineField({ name: 'content', title: 'Contenido', type: 'text', rows: 8 }),
		defineField({ name: 'startingPrice', title: 'Precio inicial', type: 'number', validation: (rule) => rule.min(0) }),
		defineField({ name: 'featured', title: 'Destacado', type: 'boolean', initialValue: false })
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'slug.current'
		}
	}
});
