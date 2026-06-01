import type { AppErrorCode } from './error';

export type DataHealthStatus = 'ok' | 'degraded' | 'error';

export interface DataHealth {
	status: DataHealthStatus;
	message?: string;
	code?: AppErrorCode;
	requestId?: string;
}
