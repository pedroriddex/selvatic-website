import type { SiteSettings } from '$lib/domain/site-settings/types';

export const DEFAULT_SHIPPING_OUT_OF_RANGE_MESSAGE =
	'Ahora mismo no realizamos envíos a ese código postal. Escríbenos desde la página de contacto y buscamos una solución.';

/** Normaliza un código postal español: deja solo dígitos y exige 5 cifras. */
export const normalizePostalCode = (value: unknown): string | null => {
	if (typeof value !== 'string') {
		return null;
	}

	const digits = value.replace(/\D/g, '');
	return digits.length === 5 ? digits : null;
};

export type ShippingRestriction = {
	enabled: boolean;
	postalCodes: string[];
	outOfRangeMessage: string;
};

/**
 * La restricción solo aplica si está activada Y hay al menos un código postal
 * válido en la lista; una lista vacía no debe bloquear todas las ventas.
 */
export const getShippingRestriction = (
	settings: Pick<
		SiteSettings,
		'shippingPostalCodesEnabled' | 'shippingPostalCodes' | 'shippingOutOfRangeMessage'
	> | null | undefined
): ShippingRestriction => {
	const postalCodes = (settings?.shippingPostalCodes ?? [])
		.map((code) => normalizePostalCode(code))
		.filter((code): code is string => code !== null);

	return {
		enabled: settings?.shippingPostalCodesEnabled === true && postalCodes.length > 0,
		postalCodes,
		outOfRangeMessage:
			settings?.shippingOutOfRangeMessage?.trim() || DEFAULT_SHIPPING_OUT_OF_RANGE_MESSAGE
	};
};

export const isPostalCodeAllowed = (
	restriction: ShippingRestriction,
	postalCode: string
): boolean => {
	if (!restriction.enabled) {
		return true;
	}

	const normalized = normalizePostalCode(postalCode);
	return normalized !== null && restriction.postalCodes.includes(normalized);
};
