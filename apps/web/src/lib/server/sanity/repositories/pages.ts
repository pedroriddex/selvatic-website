import type { DataHealth, PageContent, PageContentMap, PageKey } from '$lib/types';
import { PAGE_KEYS } from '$lib/domain/page-content/types';
import { DATA_HEALTH_OK, dataHealthFromError } from '$lib/server/data-health';
import { toAppError } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { mergePageContent } from '$lib/features/content/model/page-content';
import { sanityQuery } from '../client';
import { mapPageContent } from '../mappers';
import { pageByKeyQuery, pagesQuery } from '../queries';
import { externalFetch } from '../shared';

export type PageContentResult = {
	page: PageContent;
	dataHealth: DataHealth;
};

export type PageContentMapResult = {
	pages: PageContentMap;
	dataHealth: DataHealth;
};

export async function getPageContentResult(
	_fetchFn: typeof fetch,
	key: PageKey,
	requestId = createRequestId()
): Promise<PageContentResult> {
	const scope = `sanity.getPageContent.${key}`;

	try {
		const result = await sanityQuery<Record<string, unknown> | null>(
			externalFetch,
			pageByKeyQuery,
			{ id: `page-${key}` },
			{ scope, requestId }
		);
		const page = result ? mapPageContent(result) : null;

		return {
			page: mergePageContent(key, page),
			dataHealth: DATA_HEALTH_OK
		};
	} catch (error) {
		const normalized = toAppError(error, {
			scope,
			requestId,
			message: `No se pudieron cargar los textos de la página ${key}.`
		});

		logger.error(normalized, {
			scope,
			requestId,
			message: `No se pudieron cargar los textos de la página ${key}.`
		});

		return {
			page: mergePageContent(key, null),
			dataHealth: dataHealthFromError(normalized, {
				scope,
				requestId,
				message: 'No se pudieron cargar algunos textos editables.'
			})
		};
	}
}

export async function getPageContentMapResult(
	_fetchFn: typeof fetch,
	requestId = createRequestId()
): Promise<PageContentMapResult> {
	const scope = 'sanity.getPageContentMap';

	try {
		const result = await sanityQuery<Record<string, unknown>[]>(
			externalFetch,
			pagesQuery,
			{ ids: PAGE_KEYS.map((key) => `page-${key}`) },
			{ scope, requestId }
		);
		const pages = result.reduce((entries, entity) => {
			const page = mapPageContent(entity);
			if (page) {
				entries[page.key] = mergePageContent(page.key, page);
			}

			return entries;
		}, {} as PageContentMap);

		return {
			pages,
			dataHealth: DATA_HEALTH_OK
		};
	} catch (error) {
		const normalized = toAppError(error, {
			scope,
			requestId,
			message: 'No se pudieron cargar los textos editables.'
		});

		logger.error(normalized, {
			scope,
			requestId,
			message: 'No se pudieron cargar los textos editables.'
		});

		return {
			pages: {},
			dataHealth: dataHealthFromError(normalized, {
				scope,
				requestId,
				message: 'No se pudieron cargar algunos textos editables.'
			})
		};
	}
}
