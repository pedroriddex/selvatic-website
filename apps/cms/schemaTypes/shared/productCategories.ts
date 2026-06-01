export const PRODUCT_CATEGORY_OPTIONS = [
	{ title: 'Ramos secos', value: 'ramos-secos' },
	{ title: 'Centros secos', value: 'centros-secos' },
	{ title: 'Letras secas', value: 'letras-secas' },
	{ title: 'Plantas', value: 'plantas' }
] as const;

export const PRODUCT_CATEGORY_LABELS = PRODUCT_CATEGORY_OPTIONS.reduce<Record<string, string>>(
	(labels, option) => {
		labels[option.value] = option.title;
		return labels;
	},
	{}
);
