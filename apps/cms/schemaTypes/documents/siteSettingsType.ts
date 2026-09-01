import { defineField, defineType } from 'sanity';
import { SiteSettingsIcon } from '../shared/icons';

const POSTAL_CODE_PATTERN = /^\d{5}$/;

export const siteSettingsType = defineType({
	name: 'siteSettings',
	title: 'Ajustes del sitio',
	icon: SiteSettingsIcon,
	type: 'document',
	fieldsets: [
		{ name: 'maintenance', title: 'Modo mantenimiento', options: { collapsible: true, collapsed: false } },
		{ name: 'shipping', title: 'Zona de envío', options: { collapsible: true, collapsed: false } }
	],
	fields: [
		defineField({
			name: 'maintenanceMode',
			title: 'Activar modo mantenimiento',
			type: 'boolean',
			initialValue: false,
			fieldset: 'maintenance',
			description: 'Cuando esté activo, la web pública mostrará únicamente la pantalla de mantenimiento.'
		}),
		defineField({
			name: 'maintenanceTitle',
			title: 'Título de mantenimiento',
			type: 'string',
			initialValue: 'Estamos trabajando en la web de Selvatic',
			fieldset: 'maintenance',
			hidden: ({ document }) => !document?.maintenanceMode
		}),
		defineField({
			name: 'maintenanceMessage',
			title: 'Mensaje de mantenimiento',
			type: 'text',
			rows: 4,
			initialValue:
				'Muy pronto volveremos con la experiencia completa. Gracias por tu paciencia mientras terminamos de preparar el sitio.',
			fieldset: 'maintenance',
			hidden: ({ document }) => !document?.maintenanceMode
		}),
		defineField({
			name: 'shippingPostalCodesEnabled',
			title: 'Limitar envíos por código postal',
			type: 'boolean',
			initialValue: false,
			fieldset: 'shipping',
			description:
				'Si está activo, solo se podrán completar pedidos con un código postal de la lista de abajo. Si está apagado, se envía a cualquier código postal.'
		}),
		defineField({
			name: 'shippingPostalCodes',
			title: 'Códigos postales con envío',
			type: 'array',
			of: [
				{
					type: 'string',
					validation: (rule) =>
						rule.custom((value) =>
							typeof value === 'string' && POSTAL_CODE_PATTERN.test(value.trim())
								? true
								: 'Escribe un código postal de 5 cifras, por ejemplo 46001.'
						)
				}
			],
			fieldset: 'shipping',
			options: { layout: 'tags' },
			description:
				'Lista de códigos postales a los que sí se envía (5 cifras, por ejemplo 46001). Los pedidos con otro código postal no se podrán completar.',
			hidden: ({ document }) => !document?.shippingPostalCodesEnabled,
			validation: (rule) =>
				rule.custom((values) => {
					if (!Array.isArray(values) || values.length === 0) {
						return true;
					}

					const normalized = values
						.filter((value): value is string => typeof value === 'string')
						.map((value) => value.trim());
					const hasDuplicate = normalized.some((value, index) => normalized.indexOf(value) !== index);
					return hasDuplicate ? 'Hay códigos postales repetidos en la lista.' : true;
				})
		}),
		defineField({
			name: 'shippingOutOfRangeMessage',
			title: 'Mensaje si el código postal está fuera de zona',
			type: 'text',
			rows: 3,
			fieldset: 'shipping',
			initialValue:
				'Ahora mismo no realizamos envíos a ese código postal. Escríbenos desde la página de contacto y buscamos una solución.',
			description: 'Es el aviso que verá el cliente en el checkout si su código postal no está en la lista.',
			hidden: ({ document }) => !document?.shippingPostalCodesEnabled
		})
	],
	preview: {
		select: {
			maintenanceMode: 'maintenanceMode',
			shippingEnabled: 'shippingPostalCodesEnabled'
		},
		prepare(selection: { maintenanceMode?: boolean; shippingEnabled?: boolean }) {
			const parts = [
				selection.maintenanceMode ? 'Mantenimiento activado' : 'Mantenimiento desactivado',
				selection.shippingEnabled ? 'Envío limitado por CP' : 'Envío sin límite de CP'
			];
			return {
				title: 'Ajustes del sitio',
				subtitle: parts.join(' · ')
			};
		}
	}
});
