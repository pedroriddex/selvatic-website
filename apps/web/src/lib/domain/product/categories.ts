export const PRODUCT_CATEGORY_FILTER_ALL = 'all' as const;

export const PRODUCT_CATEGORY_OPTIONS = [
	{ value: 'ramos-secos', label: 'Ramos secos' },
	{ value: 'centros-secos', label: 'Centros secos' },
	{ value: 'letras-secas', label: 'Letras secas' },
	{ value: 'plantas', label: 'Plantas' }
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORY_OPTIONS)[number]['value'];
export type ProductCategoryFilter = ProductCategory | typeof PRODUCT_CATEGORY_FILTER_ALL;
export type ProductCategoryOption = (typeof PRODUCT_CATEGORY_OPTIONS)[number];

const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = PRODUCT_CATEGORY_OPTIONS.reduce(
	(labels, option) => {
		labels[option.value] = option.label;
		return labels;
	},
	{} as Record<ProductCategory, string>
);

const PRODUCT_CATEGORY_VALUES = new Set<ProductCategory>(
	PRODUCT_CATEGORY_OPTIONS.map((option) => option.value)
);

export const isProductCategory = (value: unknown): value is ProductCategory =>
	typeof value === 'string' && PRODUCT_CATEGORY_VALUES.has(value as ProductCategory);

export const getProductCategoryLabel = (value: ProductCategory): string => PRODUCT_CATEGORY_LABELS[value];
