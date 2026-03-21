export type NavigationLink = {
	href: string;
	label: string;
};

export const primaryNavigation: NavigationLink[] = [
	{ href: '/', label: 'Inicio' },
	{ href: '/tienda', label: 'Tienda' },
	{ href: '/sobre-nosotros', label: 'Sobre nosotros' },
	{ href: '/servicios', label: 'Servicios' },
	{ href: '/contacto', label: 'Contacto' }
];
