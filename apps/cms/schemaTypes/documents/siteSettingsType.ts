import { defineField, defineType } from 'sanity';
import { SiteSettingsIcon } from '../shared/icons';

export const siteSettingsType = defineType({
	name: 'siteSettings',
	title: 'Ajustes del sitio',
	icon: SiteSettingsIcon,
	type: 'document',
	fields: [
		defineField({
			name: 'maintenanceMode',
			title: 'Activar modo mantenimiento',
			type: 'boolean',
			initialValue: false,
			description: 'Cuando esté activo, la web pública mostrará únicamente la pantalla de mantenimiento.'
		}),
		defineField({
			name: 'maintenanceTitle',
			title: 'Título de mantenimiento',
			type: 'string',
			initialValue: 'Estamos trabajando en la web de Selvatic',
			hidden: ({ document }) => !document?.maintenanceMode
		}),
		defineField({
			name: 'maintenanceMessage',
			title: 'Mensaje de mantenimiento',
			type: 'text',
			rows: 4,
			initialValue:
				'Muy pronto volveremos con la experiencia completa. Gracias por tu paciencia mientras terminamos de preparar el sitio.',
			hidden: ({ document }) => !document?.maintenanceMode
		})
	],
	preview: {
		select: {
			maintenanceMode: 'maintenanceMode'
		},
		prepare(selection: { maintenanceMode?: boolean }) {
			return {
				title: 'Ajustes del sitio',
				subtitle: selection.maintenanceMode ? 'Mantenimiento activado' : 'Mantenimiento desactivado'
			};
		}
	}
});
