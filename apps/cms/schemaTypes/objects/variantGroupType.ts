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
			options: 'options'
		},
		prepare(selection: { title?: string; required?: boolean; options?: unknown[] }) {
			const count = Array.isArray(selection.options) ? selection.options.length : 0;
			const requiredLabel = selection.required ? 'Obligatorio' : 'Opcional';
			return {
				title: selection.title || 'Grupo de opciones',
				subtitle: `${requiredLabel} · ${count} opción(es)`
			};
		}
	}
});
