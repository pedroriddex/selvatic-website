import type { DataHealth, SiteSettings } from '$lib/types';
import { DATA_HEALTH_OK, dataHealthFromError } from '$lib/server/data-health';
import { toAppError } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { sanityQuery } from '../client';
import { mapSiteSettings } from '../mappers';
import { siteSettingsQuery } from '../queries';
import { externalFetch } from '../shared';

export type SiteSettingsResult = {
	settings: SiteSettings | null;
	dataHealth: DataHealth;
	unavailable: boolean;
};

export async function getSiteSettingsResult(
	_fetchFn: typeof fetch,
	requestId = createRequestId()
): Promise<SiteSettingsResult> {
	const scope = 'sanity.getSiteSettings';

	try {
		const result = await sanityQuery<Record<string, unknown> | null>(
			externalFetch,
			siteSettingsQuery,
			{},
			{ scope, requestId }
		);

		return {
			settings: mapSiteSettings(result),
			dataHealth: DATA_HEALTH_OK,
			unavailable: false
		};
	} catch (error) {
		const normalized = toAppError(error, {
			scope,
			requestId,
			message: 'No se pudieron cargar los ajustes del sitio.'
		});

		logger.error(normalized, {
			scope,
			requestId,
			message: 'No se pudieron cargar los ajustes del sitio.'
		});

		return {
			settings: null,
			dataHealth: dataHealthFromError(normalized, {
				scope,
				requestId,
				message: 'No se pudieron cargar los ajustes del sitio.'
			}),
			unavailable: true
		};
	}
}
