import type { Product } from '$lib/domain/product/types';
import type { Service } from '$lib/domain/service/types';
import type { SiteSettings } from '$lib/domain/site-settings/types';
import type { DesignSettings, PageContent, PageKey } from '$lib/types';
import { isProductCategory } from '$lib/domain/product/categories';
import { PAGE_KEYS } from '$lib/domain/page-content/types';
import { mergeDesignSettings } from '$lib/features/design/model/design-settings';
import { toFiniteNumber } from './shared';

const toText = (value: unknown): string | undefined => {
	if (typeof value !== 'string') {
		return undefined;
	}

	const normalized = value.trim();
	return normalized.length > 0 ? normalized : undefined;
};

export const mapProduct = (entity: Record<string, unknown>): Product | null => {
	const id = toText(entity._id);
	const name = toText(entity.name);
	const slug = toText(entity.slug);

	if (!id || !name || !slug) {
		return null;
	}

	const gallery = Array.isArray(entity.gallery)
		? entity.gallery
				.map((item) => {
					if (!item || typeof item !== 'object') {
						return null;
					}

					const image = item as Record<string, unknown>;
					const url = toText(image.url);
					if (!url) {
						return null;
					}

					return {
						url,
						alt: toText(image.alt),
						isPrimary: image.isPrimary === true
					};
				})
				.filter((image): image is NonNullable<typeof image> => image !== null)
		: [];
	const primaryImage = gallery.find((image) => image.isPrimary) ?? gallery[0];
	const imageUrl = primaryImage?.url ?? toText(entity.legacyImageUrl) ?? toText(entity.imageUrl);

	const variantGroups = Array.isArray(entity.variantGroups)
		? entity.variantGroups
				.map((group) => {
					if (!group || typeof group !== 'object') {
						return null;
					}

					const groupEntity = group as Record<string, unknown>;
					const name = toText(groupEntity.name);
					if (!name) {
						return null;
					}

					const options = Array.isArray(groupEntity.options)
						? groupEntity.options
								.map((option) => {
									if (!option || typeof option !== 'object') {
										return null;
									}

									const optionEntity = option as Record<string, unknown>;
									const label = toText(optionEntity.label);
									if (!label) {
										return null;
									}

									return {
										label,
										priceModifier: Math.max(0, toFiniteNumber(optionEntity.priceModifier, 0))
									};
								})
								.filter((option): option is NonNullable<typeof option> => option !== null)
						: [];

					if (options.length === 0) {
						return null;
					}

					return {
						name,
						required: groupEntity.required === true,
						options
					};
				})
				.filter((group): group is NonNullable<typeof group> => group !== null)
		: [];

	return {
		id,
		documentId: id,
		name,
		slug,
		category: isProductCategory(entity.category) ? entity.category : null,
		description: toText(entity.description),
		imageUrl,
		gallery,
		price: Math.max(0, toFiniteNumber(entity.price, 0)),
		currency: (toText(entity.currency) ?? 'EUR').toUpperCase(),
		stock: Math.max(0, Math.round(toFiniteNumber(entity.stock, 0))),
		variantGroups,
		stripePriceId: toText(entity.stripePriceId) ?? null,
		isActive: typeof entity.isActive === 'boolean' ? entity.isActive : true
	};
};

const isPageKey = (value: unknown): value is PageKey =>
	typeof value === 'string' && (PAGE_KEYS as readonly string[]).includes(value);

export const mapPageContent = (entity: Record<string, unknown>): PageContent | null => {
	const key = entity.key;
	if (!isPageKey(key)) {
		return null;
	}

	// Los textos editables son campos con nombre "a__b" en el documento de página.
	// Se reconstruye el diccionario con claves punteadas ("a.b").
	const texts: Record<string, string> = {};
	for (const [field, rawValue] of Object.entries(entity)) {
		if (!field.includes('__')) {
			continue;
		}
		const value = toText(rawValue);
		if (value) {
			texts[field.replace(/__/g, '.')] = value;
		}
	}

	const content: PageContent = { key, texts };

	const seoTitle = toText(entity.seoTitle);
	if (seoTitle) {
		content.seoTitle = seoTitle;
	}

	const seoDescription = toText(entity.seoDescription);
	if (seoDescription) {
		content.seoDescription = seoDescription;
	}

	return content;
};

export const mapDesignSettings = (
	entity: Record<string, unknown> | null | undefined
): DesignSettings | null => {
	if (!entity) {
		return null;
	}

	return mergeDesignSettings({
		light: toText(entity.light),
		dark: toText(entity.dark),
		accent: toText(entity.accent),
		accentHover: toText(entity.accentHover),
		accentInk: toText(entity.accentInk),
		surface: toText(entity.surface),
		success: toText(entity.success),
		warning: toText(entity.warning),
		error: toText(entity.error)
	});
};

export const mapService = (entity: Record<string, unknown>): Service | null => {
	const id = toText(entity._id);
	const title = toText(entity.title);
	const slug = toText(entity.slug);

	if (!id || !title || !slug) {
		return null;
	}

	return {
		id,
		documentId: id,
		title,
		slug,
		summary: toText(entity.summary),
		content: toText(entity.content),
		startingPrice: Math.max(0, toFiniteNumber(entity.startingPrice, 0)),
		featured: typeof entity.featured === 'boolean' ? entity.featured : false
	};
};

export const mapSiteSettings = (entity: Record<string, unknown> | null | undefined): SiteSettings | null => {
	if (!entity) {
		return null;
	}

	return {
		maintenanceMode: entity.maintenanceMode === true,
		maintenanceTitle: toText(entity.maintenanceTitle),
		maintenanceMessage: toText(entity.maintenanceMessage)
	};
};
