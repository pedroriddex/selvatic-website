import { defineField, defineType } from 'sanity';
import { ProductIcon } from '../shared/icons';
import { PRODUCT_CATEGORY_LABELS, PRODUCT_CATEGORY_OPTIONS } from '../shared/productCategories';

export const productType = defineType({
	name: 'product',
	title: 'Productos',
	icon: ProductIcon,
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
		defineField({
			name: 'image',
			title: 'Imagen principal anterior',
			type: 'image',
			options: { hotspot: true },
			description:
				'Campo antiguo. Se mantiene como respaldo si todavía no has añadido galería.'
		}),
		defineField({
			name: 'gallery',
			title: 'Galería de imágenes',
			type: 'array',
			of: [{ type: 'productImage' }],
			description:
				'Añade una o varias imágenes y marca una de ellas como principal para tarjetas y carrito.',
			validation: (rule) =>
				rule.custom((items) => {
					if (!Array.isArray(items) || items.length === 0) {
						return true;
					}

					const primaryCount = items.filter((item) => item?.isPrimary === true).length;
					if (primaryCount === 0) {
						return 'Selecciona una imagen como principal.';
					}

					if (primaryCount > 1) {
						return 'Solo puede haber una imagen principal.';
					}

					return true;
				})
		}),
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
			legacyImage: 'image',
			gallery: 'gallery'
		},
		prepare(selection: {
			title?: string;
			subtitle?: string;
			category?: string;
			legacyImage?: unknown;
			gallery?: { image?: unknown; isPrimary?: boolean }[];
		}) {
			const categoryLabel =
				typeof selection.category === 'string' ? PRODUCT_CATEGORY_LABELS[selection.category] : undefined;
			const galleryImage = Array.isArray(selection.gallery)
				? (selection.gallery.find((item) => item?.isPrimary)?.image ?? selection.gallery[0]?.image)
				: undefined;

			return {
				title: selection.title,
				subtitle: [selection.subtitle, categoryLabel].filter(Boolean).join(' · '),
				media: galleryImage ?? selection.legacyImage
			};
		}
	}
});
