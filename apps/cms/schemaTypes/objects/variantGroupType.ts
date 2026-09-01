import { defineField, defineType } from 'sanity';

export const variantGroupType = defineType({
	name: 'variantGroup',
	title: 'Grupo de opciones',
	type: 'object',
	fields: [
		defineField({
			name: 'name',
			title: 'Nombre del grupo',
			type: 'string',
			description: 'Lo que verá el cliente como título de la elección. Ej: Tamaño, Jarrón, Acabado.',
			validation: (rule) => rule.required().min(1)
		}),
		defineField({
			name: 'required',
			title: 'Obligatorio elegir',
			type: 'boolean',
			initialValue: false,
			description: 'Si se activa, el cliente debe elegir una opción de este grupo antes de poder comprar.'
		}),
		defineField({
			name: 'pricingMode',
			title: '¿Cómo afecta al precio?',
			type: 'string',
			initialValue: 'set',
			options: {
				layout: 'radio',
				list: [
					{ title: 'La opción fija el precio del producto', value: 'set' },
					{ title: 'La opción suma su importe al precio base', value: 'add' }
				]
			},
			description:
				'"Fija el precio": el precio de la opción sustituye al precio base del producto. "Suma al precio": el importe de la opción se añade al precio base. Los grupos creados antes de este cambio funcionan en modo "suma" aunque no tengan nada marcado.'
		}),
		defineField({
			name: 'options',
			title: 'Opciones',
			type: 'array',
			of: [{ type: 'variantOption' }],
			validation: (rule) =>
				rule
					.required()
					.min(1)
					.custom((options) => {
						if (!Array.isArray(options)) {
							return true;
						}

						const labels = options
							.map((option) =>
								typeof (option as { label?: unknown })?.label === 'string'
									? ((option as { label: string }).label).trim().toLowerCase()
									: ''
							)
							.filter(Boolean);
						const hasDuplicate = labels.some((label, index) => labels.indexOf(label) !== index);

						return hasDuplicate ? 'Cada opción debe tener un nombre distinto dentro del grupo.' : true;
					})
		})
	],
	preview: {
		select: {
			title: 'name',
			required: 'required',
			pricingMode: 'pricingMode',
			options: 'options'
		},
		prepare(selection: {
			title?: string;
			required?: boolean;
			pricingMode?: string;
			options?: unknown[];
		}) {
			const count = Array.isArray(selection.options) ? selection.options.length : 0;
			const requiredLabel = selection.required ? 'Obligatorio' : 'Opcional';
			const modeLabel = selection.pricingMode === 'set' ? 'Fija el precio' : 'Suma al precio';
			return {
				title: selection.title || 'Grupo de opciones',
				subtitle: `${requiredLabel} · ${modeLabel} · ${count} opción(es)`
			};
		}
	}
});
