import type { StructureBuilder } from 'sanity/structure';
import {
	ContactRequestIcon,
	DesignIcon,
	HomeIcon,
	OrderIcon,
	PagesIcon,
	ProductIcon,
	ServiceIcon,
	SiteSettingsIcon
} from '../schemaTypes/shared/icons';
import { PAGE_SPECS } from '../schemaTypes/shared/pageContentSpec';

const PAGE_ICONS: Record<string, typeof PagesIcon> = {
	global: SiteSettingsIcon,
	home: HomeIcon,
	shop: ProductIcon,
	product: ProductIcon,
	services: ServiceIcon,
	about: PagesIcon,
	contact: ContactRequestIcon,
	checkout: OrderIcon,
	maintenance: SiteSettingsIcon
};

export const deskStructure = (S: StructureBuilder) =>
	S.list()
		.title('Contenido')
		.items([
			S.listItem()
				.title('Páginas')
				.icon(PagesIcon)
				.child(
					S.list()
						.title('Páginas')
						.items(
							PAGE_SPECS.map((page) =>
								S.listItem()
									.id(page.typeName)
									.title(page.title)
									.icon(PAGE_ICONS[page.key] ?? PagesIcon)
									.child(
										S.document().schemaType(page.typeName).documentId(`page.${page.key}`)
									)
							)
						)
				),
			S.listItem()
				.title('Diseño')
				.icon(DesignIcon)
				.child(S.document().schemaType('designSettings').documentId('designSettings')),
			S.listItem()
				.title('Ajustes del sitio')
				.icon(SiteSettingsIcon)
				.child(S.document().schemaType('siteSettings').documentId('siteSettings')),
			S.divider(),
			S.documentTypeListItem('product').title('Productos').icon(ProductIcon),
			S.documentTypeListItem('service').title('Servicios').icon(ServiceIcon),
			S.documentTypeListItem('contactRequest')
				.title('Solicitudes de contacto')
				.icon(ContactRequestIcon),
			S.documentTypeListItem('order').title('Pedidos').icon(OrderIcon)
		]);
