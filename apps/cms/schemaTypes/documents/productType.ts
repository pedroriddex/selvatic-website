import { defineField, defineType } from 'sanity';

const PRODUCT_CATEGORY_OPTIONS = [
	{ title: 'Ramos secos', value: 'ramos-secos' },
	{ title: 'Centros secos', value: 'centros-secos' },
	{ title: 'Letras secas', value: 'letras-secas' },
	{ title: 'Plantas', value: 'plantas' }
] as const;

const PRODUCT_CATEGORY_LABELS = PRODUCT_CATEGORY_OPTIONS.reduce<Record<string, string>>(
	(labels, option) => {
		labels[option.value] = option.title;
		return labels;
	},
	{}
);

export const productType = defineType({
	name: 'product',
	title: 'Productos',
	type: 'document',
	fields: [
		defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (rule) => rule.required().min(2) }),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'name', maxLength: 96 },
			validation: (rule) => rule.required()
		}),
		defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 4 }),
		defineField({
			name: 'category',
			title: 'Categoría',
			type: 'string',
			initialValue: 'ramos-secos',
			options: {
				list: PRODUCT_CATEGORY_OPTIONS
			},
			validation: (rule) => rule.required()
		}),
		defineField({ name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true } }),
		defineField({
			name: 'price',
			title: 'Precio',
			type: 'number',
			validation: (rule) => rule.required().min(0)
		}),
		defineField({
			name: 'currency',
			title: 'Moneda',
			type: 'string',
			initialValue: 'EUR',
			validation: (rule) => rule.required().max(3),
			options: {
				list: [{ title: 'EUR', value: 'EUR' }]
			}
		}),
		defineField({
			name: 'stock',
			title: 'Stock',
			type: 'number',
			initialValue: 0,
			validation: (rule) => rule.required().integer().min(0)
		}),
		defineField({ name: 'stripePriceId', title: 'Stripe Price ID', type: 'string' }),
		defineField({ name: 'isActive', title: 'Activo', type: 'boolean', initialValue: true })
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'slug.current',
			category: 'category',
			media: 'image'
		},
		prepare(selection: { title?: string; subtitle?: string; category?: string; media?: unknown }) {
			const categoryLabel =
				typeof selection.category === 'string' ? PRODUCT_CATEGORY_LABELS[selection.category] : undefined;

			return {
				title: selection.title,
				subtitle: [selection.subtitle, categoryLabel].filter(Boolean).join(' · '),
				media: selection.media
			};
		}
	}
});
