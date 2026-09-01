import { defineField, defineType } from 'sanity';
import { ColorHexInput } from '../../src/studio/ColorHexInput';
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
		},
		components: {
			input: ColorHexInput
		}
	});

export const designSettingsType = defineType({
	name: 'designSettings',
	title: 'Diseño',
	icon: DesignIcon,
	type: 'document',
	fields: [
		colorField(
			'light',
			'Fondo de la web',
			'El color de fondo general. Se ve en toda la web, detrás de textos e imágenes.',
			'#EBF1E5'
		),
		colorField(
			'dark',
			'Color de los textos',
			'El color principal de letras, líneas y botones oscuros en toda la web.',
			'#222D22'
		),
		colorField(
			'accent',
			'Botones principales',
			'El color de los botones importantes, como "Encargar ramo" o "Finalizar compra".',
			'#222D22'
		),
		colorField(
			'accentHover',
			'Botones al pasar el ratón',
			'El color que toman esos botones cuando se pasa el cursor por encima.',
			'#344034'
		),
		colorField(
			'accentInk',
			'Texto dentro de los botones',
			'El color de la letra dentro de los botones principales.',
			'#EBF1E5'
		),
		colorField(
			'surface',
			'Fondo de tarjetas y formularios',
			'El color de las tarjetas de producto, campos de formulario y bloques sobre el fondo.',
			'#FFFFFF'
		),
		colorField(
			'success',
			'Mensajes de confirmación',
			'El color de los avisos positivos, por ejemplo al completar una compra.',
			'#222D22'
		),
		colorField(
			'warning',
			'Mensajes de aviso',
			'El color de los avisos informativos, por ejemplo si falta algún dato.',
			'#B08B38'
		),
		colorField(
			'error',
			'Mensajes de error',
			'El color de los errores, por ejemplo en un formulario mal rellenado.',
			'#9B4B4B'
		)
	],
	preview: {
		prepare() {
			return {
				title: 'Diseño',
				subtitle: 'Colores de la web'
			};
		}
	}
});
