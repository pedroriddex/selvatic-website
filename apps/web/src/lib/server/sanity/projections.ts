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
		"options": options[]{
			label,
			"priceModifier": coalesce(priceModifier, 0)
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
	maintenanceMessage
`;

// Cada página es un documento con campos con nombre (a__b). Se proyectan todos
// los atributos; el mapper reconstruye el diccionario de textos (a__b -> a.b).
export const pageProjection = `...`;

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
