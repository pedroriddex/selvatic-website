import type { Product, Service } from '$lib/types';
import { isProductCategory } from '$lib/config/product-categories';

const toText = (value: unknown): string | undefined => {
	if (typeof value !== 'string') {
		return undefined;
	}

	const normalized = value.trim();
	return normalized.length > 0 ? normalized : undefined;
};

const toNumber = (value: unknown, fallback = 0): number => {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === 'string') {
		const parsed = Number.parseFloat(value);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}

	return fallback;
};

export const mapProduct = (entity: Record<string, unknown>): Product | null => {
	const id = toText(entity._id);
	const name = toText(entity.name);
	const slug = toText(entity.slug);

	if (!id || !name || !slug) {
		return null;
	}

	return {
		id,
		documentId: id,
		name,
		slug,
		category: isProductCategory(entity.category) ? entity.category : null,
		description: toText(entity.description),
		imageUrl: toText(entity.imageUrl),
		price: Math.max(0, toNumber(entity.price, 0)),
		currency: (toText(entity.currency) ?? 'EUR').toUpperCase(),
		stock: Math.max(0, Math.round(toNumber(entity.stock, 0))),
		stripePriceId: toText(entity.stripePriceId) ?? null,
		isActive: typeof entity.isActive === 'boolean' ? entity.isActive : true
	};
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
		startingPrice: Math.max(0, toNumber(entity.startingPrice, 0)),
		featured: typeof entity.featured === 'boolean' ? entity.featured : false
	};
};
