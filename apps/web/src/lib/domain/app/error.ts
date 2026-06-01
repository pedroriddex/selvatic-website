export type AppErrorCode = 'CONFIG' | 'AUTH' | 'NETWORK' | 'UPSTREAM' | 'VALIDATION' | 'UNKNOWN';

export interface AppError {
	name: string;
	message: string;
	code: AppErrorCode;
	scope: string;
	status?: number;
	requestId?: string;
	details?: unknown;
}
