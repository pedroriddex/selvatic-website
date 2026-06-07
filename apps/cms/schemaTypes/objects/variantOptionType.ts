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
			title: 'Suplemento de precio (€)',
			type: 'number',
			initialValue: 0,
			description: 'Cuánto suma esta opción al precio base del producto. Usa 0 si no cambia el precio.',
			validation: (rule) => rule.min(0)
		})
	],
	preview: {
		select: {
			title: 'label',
			priceModifier: 'priceModifier'
		},
		prepare(selection: { title?: string; priceModifier?: number }) {
			const modifier =
				typeof selection.priceModifier === 'number' && selection.priceModifier > 0
					? ` · +${selection.priceModifier} €`
					: '';
			return {
				title: `${selection.title || 'Opción'}${modifier}`
			};
		}
	}
});
