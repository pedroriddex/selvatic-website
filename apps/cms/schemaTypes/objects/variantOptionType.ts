import { defineField, defineType } from 'sanity';

export const variantOptionType = defineType({
	name: 'variantOption',
	title: 'Opción',
	type: 'object',
	fields: [
		defineField({
			name: 'label',
			title: 'Nombre de la opción',
			type: 'string',
			description: 'Lo que verá el cliente. Ej: Pequeño, Grande, Con jarrón.',
			validation: (rule) => rule.required().min(1)
		}),
		defineField({
			name: 'priceModifier',
			title: 'Precio de la opción (€)',
			type: 'number',
			initialValue: 0,
			description:
				'Según el modo del grupo: si el grupo "fija el precio", este es el precio final del producto con esta opción; si el grupo "suma al precio", esta cantidad se añade al precio base (0 = no cambia).',
			validation: (rule) => rule.min(0)
		}),
		defineField({
			name: 'image',
			title: 'Imagen de la opción',
			type: 'image',
			options: { hotspot: true },
			description:
				'Opcional. Si la añades, la foto del producto cambiará a esta imagen cuando el cliente elija esta opción.'
		})
	],
	preview: {
		select: {
			title: 'label',
			priceModifier: 'priceModifier',
			media: 'image'
		},
		prepare(selection: { title?: string; priceModifier?: number; media?: unknown }) {
			const modifier =
				typeof selection.priceModifier === 'number' && selection.priceModifier > 0
					? ` · ${selection.priceModifier} €`
					: '';
			return {
				title: `${selection.title || 'Opción'}${modifier}`,
				media: selection.media as never
			};
		}
	}
});
