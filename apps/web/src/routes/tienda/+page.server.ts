import {
	PRODUCT_CATEGORY_FILTER_ALL,
	isProductCategory,
	type ProductCategoryFilter
} from '$lib/config/product-categories';
import { getProductsResult } from '$lib/server/sanity';
import { createRequestId } from '$lib/server/logger';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, url }) => {
	const requestId = createRequestId();
	const productsResult = await getProductsResult(fetch, requestId);
	const selectedCategory = url.searchParams.get('categoria');
	const activeCategory: ProductCategoryFilter = isProductCategory(selectedCategory)
		? selectedCategory
		: PRODUCT_CATEGORY_FILTER_ALL;

	return {
		products: productsResult.products,
		activeCategory,
		dataHealth: productsResult.dataHealth
	};
}) satisfies PageServerLoad;
