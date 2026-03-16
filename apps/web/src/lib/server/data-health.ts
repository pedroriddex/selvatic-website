import { dev } from '$app/environment';
import type { DataHealth } from '$lib/types';
import { toAppError } from './errors';

export const DATA_HEALTH_OK: DataHealth = {
	status: 'ok'
};

export const dataHealthFromError = (
	error: unknown,
	input: {
		scope: string;
		message: string;
		requestId?: string;
	}
): DataHealth => {
	const normalized = toAppError(error, {
		scope: input.scope,
		message: input.message,
		requestId: input.requestId
	});

	const strictError = normalized.code === 'CONFIG' && !dev;

	return {
		status: strictError ? 'error' : 'degraded',
		message: normalized.message || input.message,
		code: normalized.code,
		requestId: normalized.requestId
	};
};

export const combineDataHealth = (...healthItems: DataHealth[]): DataHealth => {
	const errorItem = healthItems.find((item) => item.status === 'error');
	if (errorItem) {
		return errorItem;
	}

	const degradedItem = healthItems.find((item) => item.status === 'degraded');
	if (degradedItem) {
		return degradedItem;
	}

	return DATA_HEALTH_OK;
};
