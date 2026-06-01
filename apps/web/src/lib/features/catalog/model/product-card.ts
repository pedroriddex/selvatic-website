export type ProductCardMode = 'catalog' | 'showcase' | 'home';

export const getProductCardView = (
	mode: ProductCardMode,
	featured: boolean,
	className: string
) => {
	const isShowcase = mode === 'showcase';
	const isHome = mode === 'home';

	return {
		isHome,
		articleClass: isHome
			? `product-home-card group reveal ${className}`.trim()
			: `product-catalog-card ${isShowcase && featured ? 'product-catalog-card-featured' : ''} group reveal ${className}`.trim(),
		mediaWrapClass: 'product-media-wrap arched-media-wrap',
		imageContainerClass: isHome
			? 'product-home-media'
			: `product-catalog-media ${isShowcase && featured ? 'product-catalog-media-featured' : ''}`,
		imageClass: 'transition duration-300 group-hover:scale-[1.02]',
		titleClass: isHome ? 'product-home-title' : 'product-catalog-title',
		descriptionClass: isHome ? 'product-home-description' : 'product-catalog-description',
		priceClass: isHome ? 'product-home-price' : 'product-catalog-price'
	};
};
