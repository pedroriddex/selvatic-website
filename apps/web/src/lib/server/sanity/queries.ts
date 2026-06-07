import {
	designSettingsProjection,
	pageProjection,
	productProjection,
	serviceProjection,
	siteSettingsProjection
} from './projections';

export const productListQuery = `
	*[
		_type == "product" &&
		!(_id in path("drafts.**")) &&
		coalesce(isActive, true) == true
	] | order(_updatedAt desc)[0...24] {
		${productProjection}
	}
`;

export const productBySlugQuery = `
	*[
		_type == "product" &&
		!(_id in path("drafts.**")) &&
		slug.current == $slug
	][0] {
		${productProjection}
	}
`;

export const productIdsBySlugsQuery = `
	*[
		_type == "product" &&
		!(_id in path("drafts.**")) &&
		slug.current in $slugs
	] {
		_id,
		"slug": slug.current
	}
`;

export const serviceListQuery = `
	*[
		_type == "service" &&
		!(_id in path("drafts.**"))
	] | order(featured desc, _updatedAt desc)[0...24] {
		${serviceProjection}
	}
`;

export const siteSettingsQuery = `
	*[
		_type == "siteSettings" &&
		_id == "siteSettings" &&
		!(_id in path("drafts.**"))
	][0] {
		${siteSettingsProjection}
	}
`;

export const pageByKeyQuery = `
	*[
		_id == $id &&
		!(_id in path("drafts.**"))
	][0] {
		${pageProjection}
	}
`;

export const pagesQuery = `
	*[
		_id in path("page.*") &&
		!(_id in path("drafts.**"))
	] {
		${pageProjection}
	}
`;

export const designSettingsQuery = `
	*[
		_type == "designSettings" &&
		_id == "designSettings" &&
		!(_id in path("drafts.**"))
	][0] {
		${designSettingsProjection}
	}
`;
