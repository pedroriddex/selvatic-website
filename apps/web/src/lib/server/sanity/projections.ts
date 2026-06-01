export const productProjection = `
	_id,
	name,
	"slug": slug.current,
	category,
	description,
	price,
	currency,
	stock,
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

export const pageProjection = `
	key,
	title,
	route,
	seoTitle,
	seoDescription,
	"texts": texts[]{
		key,
		label,
		value
	}
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
