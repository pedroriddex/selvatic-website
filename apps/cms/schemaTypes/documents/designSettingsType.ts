import { defineField, defineType } from 'sanity';
import { DesignIcon } from '../shared/icons';

const colorField = (name: string, title: string, description: string, initialHex: string) =>
	defineField({
		name,
		title,
		type: 'color',
		description,
		initialValue: { _type: 'color', hex: initialHex },
		options: {
			disableAlpha: true
		}
	});

export const designSettingsType = defineType({
	name: 'designSettings',
	title: 'Diseño',
	icon: DesignIcon,
	type: 'document',
	fields: [
		colorField('light', 'Color claro principal', 'Fondos claros y zonas de aire de la web.', '#EBF1E5'),
		colorField('dark', 'Color oscuro principal', 'Texto principal, líneas y botones oscuros.', '#222D22'),
		colorField('accent', 'Color de acento', 'Botones destacados, estados activos y detalles de interacción.', '#222D22'),
		colorField('accentHover', 'Color de acento al pasar el ratón', 'Variante para hover/focus de botones destacados.', '#344034'),
		colorField('accentInk', 'Texto sobre acento', 'Color del texto cuando aparece sobre botones o fondos de acento.', '#EBF1E5'),
		colorField('surface', 'Superficie clara', 'Tarjetas, campos y bloques sobre el fondo principal.', '#FFFFFF'),
		colorField('success', 'Estado correcto', 'Mensajes de confirmación o estado positivo.', '#222D22'),
		colorField('warning', 'Estado aviso', 'Mensajes de aviso o información degradada.', '#B08B38'),
		colorField('error', 'Estado error', 'Errores de formularios y validaciones.', '#9B4B4B')
	],
	preview: {
		prepare() {
			return {
				title: 'Diseño',
				subtitle: 'Paleta global de la web'
			};
		}
	}
});
