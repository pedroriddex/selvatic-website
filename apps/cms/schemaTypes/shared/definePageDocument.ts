import { defineField, defineType } from 'sanity';
import { PagesIcon } from './icons';
import type { PageSpec } from './pageContentSpec';

// Títulos legibles para las pestañas (grupos). Si un prefijo no está aquí,
// se capitaliza automáticamente.
const GROUP_TITLES: Record<string, string> = {
	general: 'General',
	brand: 'Marca',
	nav: 'Navegación',
	cta: 'Botones',
	cart: 'Carrito',
	footer: 'Pie de página',
	hero: 'Portada',
	productCard: 'Tarjeta de producto',
	signal: 'Franja de iconos',
	collections: 'Colecciones',
	collection: 'Colección',
	bestSellers: 'Más vendidos',
	promo: 'Promoción',
	services: 'Servicios',
	intro: 'Introducción',
	filter: 'Filtros',
	empty: 'Estados vacíos',
	emptyServices: 'Sin servicios',
	gallery: 'Galería',
	summary: 'Resumen',
	action: 'Acciones',
	related: 'Relacionados',
	method: 'Metodología',
	material: 'Materialidad',
	presentation: 'Presentación',
	presence: 'Presencia',
	list: 'Listado',
	origin: 'Origen',
	director: 'Dirección',
	work: 'Forma de trabajar',
	contact: 'Contacto',
	process: 'Proceso',
	form: 'Formulario',
	disabled: 'Tienda pausada',
	success: 'Pago correcto',
	cancel: 'Pago cancelado'
};

const groupTitle = (group: string): string =>
	GROUP_TITLES[group] ?? group.charAt(0).toUpperCase() + group.slice(1);

export const definePageDocument = (spec: PageSpec) =>
	defineType({
		name: spec.typeName,
		title: spec.title,
		type: 'document',
		icon: PagesIcon,
		groups: [
			...spec.groups.map((group, index) => ({
				name: group,
				title: groupTitle(group),
				default: index === 0
			})),
			{ name: 'seo', title: 'SEO' }
		],
		fields: [
			// Identificador técnico de la página, no editable.
			defineField({
				name: 'key',
				title: 'Clave de página',
				type: 'string',
				readOnly: true,
				hidden: true,
				initialValue: spec.key
			}),
			...spec.fields.map((field) =>
				defineField({
					name: field.field,
					title: field.label,
					type: field.multiline ? 'text' : 'string',
					rows: field.multiline ? 3 : undefined,
					group: field.group,
					initialValue: field.initialValue
				})
			),
			defineField({
				name: 'seoTitle',
				title: 'Título SEO',
				type: 'string',
				group: 'seo',
				description: 'Aparece en la pestaña del navegador y en buscadores.',
				initialValue: spec.seoTitle
			}),
			defineField({
				name: 'seoDescription',
				title: 'Descripción SEO',
				type: 'text',
				rows: 3,
				group: 'seo',
				initialValue: spec.seoDescription
			})
		],
		preview: {
			prepare() {
				return {
					title: spec.title,
					subtitle: spec.route
				};
			}
		}
	});

export const pageDocumentTypes = (specs: PageSpec[]) => specs.map(definePageDocument);
