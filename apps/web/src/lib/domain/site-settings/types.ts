export interface SiteSettings {
	maintenanceMode: boolean;
	maintenanceTitle?: string;
	maintenanceMessage?: string;
	/** Si está activo, solo se completan pedidos con código postal de la lista. */
	shippingPostalCodesEnabled: boolean;
	shippingPostalCodes: string[];
	shippingOutOfRangeMessage?: string;
}
