import type { AppError, AppErrorCode } from '$lib/types';

type AppExceptionInput = {
	code: AppErrorCode;
	message: string;
	scope: string;
	status?: number;
	requestId?: string;
	details?: unknown;
	cause?: unknown;
};

export class AppException extends Error implements AppError {
	code: AppErrorCode;
	scope: string;
	status?: number;
	requestId?: string;
	details?: unknown;

	constructor(input: AppExceptionInput) {
		super(input.message, input.cause ? { cause: input.cause } : undefined);
		this.name = 'AppException';
		this.code = input.code;
		this.scope = input.scope;
		this.status = input.status;
		this.requestId = input.requestId;
		this.details = input.details;
	}
}

export const isAppError = (value: unknown): value is AppException =>
	value !== null &&
	typeof value === 'object' &&
	'name' in value &&
	'code' in value &&
	'scope' in value &&
	'valueOf' in value;

export const isCriticalDataError = (value: unknown): boolean => {
	if (!(value instanceof AppException)) {
		return false;
	}

	return value.code === 'CONFIG' || value.code === 'AUTH';
};

export const toAppError = (
	value: unknown,
	fallback: {
		scope: string;
		message?: string;
		code?: AppErrorCode;
		requestId?: string;
	}
): AppException => {
	if (value instanceof AppException) {
		return value;
	}

	if (value instanceof Error) {
		return new AppException({
			code: fallback.code ?? 'UNKNOWN',
			scope: fallback.scope,
			message: value.message || fallback.message || 'Error inesperado.',
			requestId: fallback.requestId,
			cause: value
		});
	}

	return new AppException({
		code: fallback.code ?? 'UNKNOWN',
		scope: fallback.scope,
		message: fallback.message || 'Error inesperado.',
		requestId: fallback.requestId,
		details: value
	});
};
