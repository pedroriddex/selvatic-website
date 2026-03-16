import { dataHealthFromError } from '$lib/server/data-health';
import { toAppError } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { getProductBySlug, getProductsResult } from '$lib/server/sanity';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const requestId = createRequestId();
	let product;
	try {
		product = await getProductBySlug(fetch, params.slug, requestId);
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

	const relatedResult = await getProductsResult(fetch, requestId);
	const relatedProducts = relatedResult.products.filter((item) => item.slug !== product.slug).slice(0, 3);

	const relatedDataHealth =
		relatedResult.dataHealth.status === 'ok'
			? relatedResult.dataHealth
			: dataHealthFromError(
					new Error(relatedResult.dataHealth.message || 'No se pudieron cargar relacionados.'),
					{
						scope: 'product.load.relatedProducts',
						requestId,
						message: relatedResult.dataHealth.message || 'No se pudieron cargar productos relacionados.'
					}
				);

	return {
		product,
		relatedProducts,
		dataHealth: {
			relatedProducts: relatedDataHealth
		}
	};
}) satisfies PageServerLoad;
