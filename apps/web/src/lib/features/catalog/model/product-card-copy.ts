import type { PageContent } from '$lib/types';
import { textFor } from '$lib/features/content/model/page-content';

export type ProductCardCopy = {
	addToCartLabel: string;
	addToCartAria: string;
	comingSoonLabel: string;
	viewImageAria: string;
	viewProductAria: string;
};

export const getProductCardCopy = (content: PageContent): ProductCardCopy => ({
	addToCartLabel: textFor(content, 'productCard.addToCartLabel'),
	addToCartAria: textFor(content, 'productCard.addToCartAria'),
	comingSoonLabel: textFor(content, 'productCard.comingSoonLabel'),
	viewImageAria: textFor(content, 'productCard.viewImageAria'),
	viewProductAria: textFor(content, 'productCard.viewProductAria')
});
