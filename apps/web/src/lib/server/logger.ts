import type { AppErrorCode } from '$lib/types';
import { randomUUID } from 'node:crypto';
import { toAppError } from './errors';

type LogLevel = 'info' | 'warn' | 'error';

type LogEntry = {
	level: LogLevel;
	scope: string;
	message: string;
	code?: AppErrorCode;
	requestId?: string;
	details?: unknown;
};

const write = (entry: LogEntry): void => {
	const payload = {
		timestamp: new Date().toISOString(),
		...entry
	};

	const output = JSON.stringify(payload);
	if (entry.level === 'error') {
		console.error(output);
		return;
	}

	if (entry.level === 'warn') {
		console.warn(output);
		return;
	}

	console.info(output);
};

export const createRequestId = (): string => randomUUID();

export const logger = {
	info(scope: string, message: string, details?: unknown): void {
		write({ level: 'info', scope, message, details });
	},
	warn(scope: string, message: string, details?: unknown): void {
		write({ level: 'warn', scope, message, details });
	},
	error(
		error: unknown,
		context: {
			scope: string;
			requestId?: string;
			message?: string;
			code?: AppErrorCode;
			details?: unknown;
		}
	): void {
		const normalized = toAppError(error, {
			scope: context.scope,
			message: context.message,
			code: context.code,
			requestId: context.requestId
		});

		write({
			level: 'error',
			scope: normalized.scope,
			message: normalized.message,
			code: normalized.code,
			requestId: normalized.requestId,
			details: context.details ?? normalized.details
		});
	}
};
