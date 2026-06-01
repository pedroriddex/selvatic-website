import {
	PRODUCT_CATEGORY_FILTER_ALL,
	isProductCategory,
	type ProductCategoryFilter
} from '$lib/config/product-categories';
import type { Product } from '$lib/types';
import { dataHealthFromError } from '$lib/server/data-health';
import { toAppError } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { getPageContentResult, getProductBySlug, getProductsResult } from '$lib/server/sanity';
import { error } from '@sveltejs/kit';

export async function loadCatalogPage(fetchFn: typeof fetch, url: URL) {
	const requestId = createRequestId();
	const [productsResult, pageContentResult] = await Promise.all([
		getProductsResult(fetchFn, requestId),
		getPageContentResult(fetchFn, 'shop', requestId)
	]);
	const selectedCategory = url.searchParams.get('categoria');
	const activeCategory: ProductCategoryFilter = isProductCategory(selectedCategory)
		? selectedCategory
		: PRODUCT_CATEGORY_FILTER_ALL;

	return {
		products: productsResult.products,
		activeCategory,
		pageContent: pageContentResult.page,
		dataHealth: productsResult.dataHealth
	};
}

export async function loadCatalogProductPage(fetchFn: typeof fetch, slug: string) {
	const requestId = createRequestId();
	const pageContentResult = await getPageContentResult(fetchFn, 'product', requestId);
	let product;

	try {
		product = await getProductBySlug(fetchFn, slug, requestId);
	} catch (rawError) {
		const normalized = toAppError(rawError, {
			scope: 'product.load.getProductBySlug',
			requestId,
			message: 'No se pudo cargar el producto.'
		});

		logger.error(normalized, {
			scope: 'product.load.getProductBySlug',
			requestId
		});

		throw error(503, 'No se pudo cargar el producto en este momento.');
	}

	if (!product) {
		throw error(404, 'Producto no encontrado');
	}

	const relatedResult = await getProductsResult(fetchFn, requestId);
	const relatedProducts = relatedResult.products
		.filter((item: Product) => item.slug !== product.slug)
		.slice(0, 3);

	const relatedDataHealth =
		relatedResult.dataHealth.status === 'ok'
			? relatedResult.dataHealth
			: dataHealthFromError(
					new Error(relatedResult.dataHealth.message || 'No se pudieron cargar relacionados.'),
					{
						scope: 'product.load.relatedProducts',
						requestId,
						message:
							relatedResult.dataHealth.message ||
							'No se pudieron cargar productos relacionados.'
					}
				);

	return {
		product,
		relatedProducts,
		pageContent: pageContentResult.page,
		dataHealth: {
			relatedProducts: relatedDataHealth
		}
	};
}
