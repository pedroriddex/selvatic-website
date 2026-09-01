import { PRODUCT_CATEGORY_OPTIONS } from '$lib/config/product-categories';
import { SITE_MEDIA } from '$lib/config/site-media';
import { imageFor } from '$lib/features/content/model/page-content';
import type { PageContent, Product } from '$lib/types';

export const HOME_COMMERCE_SIGNAL_ICONS = [
	'star-line',
	'shopping-bag-3-line',
	'send-plane-line',
	'layout-grid-line'
] as const;

export const getHomeCategoryLabels = () => PRODUCT_CATEGORY_OPTIONS.map((category) => category.label);

export const getHomeHeroVideoUrl = () => SITE_MEDIA.heroVideoUrl;

export const getHomeHeroVideoPosterUrl = (content?: PageContent) =>
	(content && imageFor(content, 'media.heroPoster')) || SITE_MEDIA.heroVideoPosterUrl;

export const getHomeHeroVideoType = () =>
	/\.webm(\?|$)/i.test(getHomeHeroVideoUrl() ?? '') ? 'video/webm' : 'video/mp4';

export const getFeaturedProducts = (products: Product[]) => products.slice(0, 5);

export const getBestSellerProducts = (products: Product[]) =>
	products.slice(5, 8).length > 0 ? products.slice(5, 8) : products.slice(0, 3);

export const getHomePromoImage = (products: Product[], content?: PageContent) =>
	(content && imageFor(content, 'media.promo')) ||
	SITE_MEDIA.homePromoImageUrl ||
	products[0]?.imageUrl;
