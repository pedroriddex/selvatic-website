import type { DataHealth, DesignSettings } from '$lib/types';
import { DATA_HEALTH_OK, dataHealthFromError } from '$lib/server/data-health';
import { toAppError } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { DEFAULT_DESIGN_SETTINGS, mergeDesignSettings } from '$lib/features/design/model/design-settings';
import { sanityQuery } from '../client';
import { mapDesignSettings } from '../mappers';
import { designSettingsQuery } from '../queries';
import { externalFetch } from '../shared';

export type DesignSettingsResult = {
	settings: DesignSettings;
	dataHealth: DataHealth;
};

export async function getDesignSettingsResult(
	_fetchFn: typeof fetch,
	requestId = createRequestId()
): Promise<DesignSettingsResult> {
	const scope = 'sanity.getDesignSettings';

	try {
		const result = await sanityQuery<Record<string, unknown> | null>(
			externalFetch,
			designSettingsQuery,
			{},
			{ scope, requestId }
		);

		return {
			settings: mergeDesignSettings(mapDesignSettings(result) ?? DEFAULT_DESIGN_SETTINGS),
			dataHealth: DATA_HEALTH_OK
		};
	} catch (error) {
		const normalized = toAppError(error, {
			scope,
			requestId,
			message: 'No se pudieron cargar los ajustes de diseño.'
		});

		logger.error(normalized, {
			scope,
			requestId,
			message: 'No se pudieron cargar los ajustes de diseño.'
		});

		return {
			settings: DEFAULT_DESIGN_SETTINGS,
			dataHealth: dataHealthFromError(normalized, {
				scope,
				requestId,
				message: 'No se pudieron cargar los ajustes de diseño.'
			})
		};
	}
}
