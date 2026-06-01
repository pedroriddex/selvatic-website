import { defineField, defineType } from 'sanity';
import { PageTextBlockIcon } from '../shared/icons';

export const pageTextBlockType = defineType({
	name: 'pageTextBlock',
	title: 'Texto editable',
	icon: PageTextBlockIcon,
	type: 'object',
	fields: [
		defineField({
			name: 'key',
			title: 'Clave interna',
			type: 'string',
			readOnly: true,
			description: 'Identificador técnico. No hace falta editarlo.'
		}),
		defineField({
			name: 'label',
			title: 'Dónde aparece',
			type: 'string',
			readOnly: true,
			description: 'Referencia para saber qué texto estás editando.'
		}),
		defineField({
			name: 'value',
			title: 'Texto',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required()
		})
	],
	preview: {
		select: {
			title: 'label',
			subtitle: 'value'
		},
		prepare(selection: { title?: string; subtitle?: string }) {
			return {
				title: selection.title || 'Texto editable',
				subtitle: selection.subtitle
			};
		}
	}
});
