import { PAGE_DEFAULTS } from '$lib/features/content/model/page-content';

export const productProjection = `
	_id,
	name,
	"slug": slug.current,
	category,
	description,
	price,
	currency,
	stock,
	"variantGroups": variantGroups[]{
		name,
		"required": coalesce(required, false),
		"pricingMode": coalesce(pricingMode, "add"),
		"options": options[]{
			label,
			"priceModifier": coalesce(priceModifier, 0),
			"imageUrl": image.asset->url
		}
	},
	stripePriceId,
	isActive,
	"legacyImageUrl": image.asset->url,
	"gallery": gallery[]{
		"isPrimary": coalesce(isPrimary, false),
		alt,
		"url": image.asset->url
	}
`;

export const serviceProjection = `
	_id,
	title,
	"slug": slug.current,
	summary,
	content,
	startingPrice,
	featured
`;

export const siteSettingsProjection = `
	maintenanceMode,
	maintenanceTitle,
	maintenanceMessage,
	shippingPostalCodesEnabled,
	shippingPostalCodes,
	shippingOutOfRangeMessage
`;

// Cada página es un documento con campos con nombre (a__b). Se proyectan todos
// los atributos; el mapper reconstruye el diccionario de textos (a__b -> a.b).
// Las imágenes editables se proyectan aparte como "img__<campo>" con su URL
// resuelta, porque el spread `...` solo devuelve la referencia al asset.
const pageImageProjections = [
	...new Set(
		PAGE_DEFAULTS.flatMap((page) =>
			(page.images ?? []).map((image) => image.key.replace(/\./g, '__'))
		)
	)
]
	.map((field) => `"img__${field}": ${field}.asset->url`)
	.join(',\n\t');

export const pageProjection = `
	...,
	${pageImageProjections}
`;

export const designSettingsProjection = `
	"light": light.hex,
	"dark": dark.hex,
	"accent": accent.hex,
	"accentHover": accentHover.hex,
	"accentInk": accentInk.hex,
	"surface": surface.hex,
	"success": success.hex,
	"warning": warning.hex,
	"error": error.hex
`;
