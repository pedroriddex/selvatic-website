export const productListQuery = `
	*[
		_type == "product" &&
		!(_id in path("drafts.**")) &&
		coalesce(isActive, true) == true
	] | order(_updatedAt desc)[0...24] {
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
		"imageUrl": image.asset->url
	}
`;

export const serviceListQuery = `
	*[
		_type == "service" &&
		!(_id in path("drafts.**"))
	] | order(featured desc, _updatedAt desc)[0...24] {
		_id,
		title,
		"slug": slug.current,
		summary,
		content,
		startingPrice,
		featured
	}
`;

export const productBySlugQuery = `
	*[
		_type == "product" &&
		!(_id in path("drafts.**")) &&
		slug.current == $slug
	][0] {
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
		"imageUrl": image.asset->url
	}
`;
