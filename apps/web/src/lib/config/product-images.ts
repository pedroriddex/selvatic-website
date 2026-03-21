const PRODUCT_IMAGE_POOL = [
	'/media/selvatic-images/atelier-setup.webp',
	'/media/selvatic-images/ramo-color-studio.webp',
	'/media/selvatic-images/ramo-color-studio-alt.webp',
	'/media/selvatic-images/detalle-floral-pastel.webp',
	'/media/selvatic-images/bouquet-lazo-coral.webp',
	'/media/selvatic-images/bouquet-lazo-coral-alt.webp',
	'/media/selvatic-images/composicion-invernal.webp'
] as const;

const PRODUCT_IMAGE_OVERRIDES: Record<string, string> = {
	'monstera-deliciosa-mac': '/media/selvatic-images/atelier-setup.webp'
};

const hashString = (value: string): number => {
	let hash = 0;

	for (let index = 0; index < value.length; index += 1) {
		hash = (hash << 5) - hash + value.charCodeAt(index);
		hash |= 0;
	}

	return Math.abs(hash);
};

export const resolveProductImageUrl = (slug?: string | null, fallbackUrl?: string | null): string | undefined => {
	if (slug && PRODUCT_IMAGE_OVERRIDES[slug]) {
		return PRODUCT_IMAGE_OVERRIDES[slug];
	}

	if (slug && PRODUCT_IMAGE_POOL.length > 0) {
		return PRODUCT_IMAGE_POOL[hashString(slug) % PRODUCT_IMAGE_POOL.length];
	}

	return fallbackUrl ?? undefined;
};

