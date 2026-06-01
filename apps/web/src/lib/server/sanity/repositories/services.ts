import { dev } from '$app/environment';
import type { DataHealth, Service } from '$lib/types';
import { DATA_HEALTH_OK, dataHealthFromError } from '$lib/server/data-health';
import { isCriticalDataError, toAppError } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { sanityQuery } from '../client';
import { mapService } from '../mappers';
import { serviceListQuery } from '../queries';
import { externalFetch } from '../shared';

export type ServicesResult = {
	services: Service[];
	dataHealth: DataHealth;
};

export async function getServicesResult(
	_fetchFn: typeof fetch,
	requestId = createRequestId()
): Promise<ServicesResult> {
	const scope = 'sanity.getServices';

	try {
		const result = await sanityQuery<Record<string, unknown>[]>(
			externalFetch,
			serviceListQuery,
			{},
			{ scope, requestId }
		);

		return {
			services: result.map(mapService).filter((service): service is Service => service !== null),
			dataHealth: DATA_HEALTH_OK
		};
	} catch (error) {
		const normalized = toAppError(error, {
			scope,
			requestId,
			message: 'No se pudieron cargar los servicios.'
		});

		logger.error(normalized, {
			scope,
			requestId,
			message: 'No se pudieron cargar los servicios.'
		});

		if (!dev && isCriticalDataError(normalized)) {
			throw normalized;
		}

		return {
			services: [],
			dataHealth: dataHealthFromError(normalized, {
				scope,
				requestId,
				message: 'No se pudieron cargar servicios en este momento.'
			})
		};
	}
}

export async function getServices(fetchFn: typeof fetch): Promise<Service[]> {
	const { services } = await getServicesResult(fetchFn);
	return services;
}
