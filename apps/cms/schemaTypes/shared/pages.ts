export const PAGE_OPTIONS = [
	{ title: 'Global', value: 'global', route: '*' },
	{ title: 'Inicio', value: 'home', route: '/' },
	{ title: 'Tienda', value: 'shop', route: '/tienda' },
	{ title: 'Ficha de producto', value: 'product', route: '/tienda/[slug]' },
	{ title: 'Servicios', value: 'services', route: '/servicios' },
	{ title: 'Sobre nosotros', value: 'about', route: '/sobre-nosotros' },
	{ title: 'Contacto', value: 'contact', route: '/contacto' },
	{ title: 'Checkout', value: 'checkout', route: '/checkout' },
	{ title: 'Mantenimiento', value: 'maintenance', route: '/mantenimiento' }
] as const;

export type PageOption = (typeof PAGE_OPTIONS)[number];
export type PageKey = PageOption['value'];

export const PAGE_LABELS = PAGE_OPTIONS.reduce(
	(labels, page) => {
		labels[page.value] = page.title;
		return labels;
	},
	{} as Record<PageKey, string>
);

export const PAGE_ROUTES = PAGE_OPTIONS.reduce(
	(routes, page) => {
		routes[page.value] = page.route;
		return routes;
	},
	{} as Record<PageKey, string>
);
