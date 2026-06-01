import { createElement } from 'react';
import type { ComponentType, SVGProps } from 'react';

type StudioIcon = ComponentType<SVGProps<SVGSVGElement>>;

const createStudioIcon = (displayName: string, paths: string[]): StudioIcon => {
	const Icon: StudioIcon = (props) =>
		createElement(
			'svg',
			{
				viewBox: '0 0 24 24',
				width: '1em',
				height: '1em',
				fill: 'none',
				stroke: 'currentColor',
				strokeWidth: 1.8,
				strokeLinecap: 'round',
				strokeLinejoin: 'round',
				'aria-hidden': true,
				...props
			},
			paths.map((d, index) => createElement('path', { key: `${displayName}-${index}`, d }))
		);

	Icon.displayName = displayName;
	return Icon;
};

export const PagesIcon = createStudioIcon('PagesIcon', [
	'M7 3.5h7l3 3v14H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z',
	'M14 3.5v4h4',
	'M8.5 11h7',
	'M8.5 14.5h7',
	'M8.5 18h4.5'
]);

export const DesignIcon = createStudioIcon('DesignIcon', [
	'M5 5h5.5v5.5H5Z',
	'M13.5 5H19v5.5h-5.5Z',
	'M5 13.5h5.5V19H5Z',
	'M13.5 13.5H19V19h-5.5Z'
]);

export const ProductIcon = createStudioIcon('ProductIcon', [
	'M6.5 8.5h11l-.7 11H7.2Z',
	'M9 8.5a3 3 0 0 1 6 0',
	'M9.5 12.2h5'
]);

export const ServiceIcon = createStudioIcon('ServiceIcon', [
	'M12 20v-8',
	'M12 12c-3.2-1.1-5.2-3-5.8-5.7 2.8-.4 5.1.5 6.8 2.7',
	'M12 12c3.2-1.1 5.2-3 5.8-5.7-2.8-.4-5.1.5-6.8 2.7',
	'M8.4 17.6c1.4.6 2.6.9 3.6.9s2.2-.3 3.6-.9'
]);

export const ContactRequestIcon = createStudioIcon('ContactRequestIcon', [
	'M4.5 6.5h15v11h-15Z',
	'M5 7l7 5.6L19 7',
	'M5.5 17l5-4',
	'M18.5 17l-5-4'
]);

export const OrderIcon = createStudioIcon('OrderIcon', [
	'M7 3.5h10v17l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2Z',
	'M9.5 8h5',
	'M9.5 11.5h5',
	'M9.5 15h3'
]);

export const SiteSettingsIcon = createStudioIcon('SiteSettingsIcon', [
	'M5 7h14',
	'M5 12h14',
	'M5 17h14',
	'M9 7v0',
	'M15 12v0',
	'M11 17v0'
]);

export const HomeIcon = createStudioIcon('HomeIcon', [
	'M4.5 11.5 12 5l7.5 6.5',
	'M6.5 10v9h11v-9',
	'M10 19v-5h4v5'
]);

export const PageTextBlockIcon = createStudioIcon('PageTextBlockIcon', [
	'M5 6h14',
	'M7 6v12',
	'M17 6v12',
	'M8 18h8',
	'M10 11h4'
]);

export const ProductImageIcon = createStudioIcon('ProductImageIcon', [
	'M4.5 5.5h15v13h-15Z',
	'M7.5 14.5l3-3 2.5 2.5 2-2 2.8 2.8',
	'M8.2 8.6h.1'
]);

export const OrderItemIcon = createStudioIcon('OrderItemIcon', [
	'M6 6.5h12',
	'M6 11h12',
	'M6 15.5h8',
	'M4 6.5h.1',
	'M4 11h.1',
	'M4 15.5h.1'
]);
