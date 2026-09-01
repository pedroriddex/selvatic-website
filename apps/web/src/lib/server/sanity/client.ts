import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { AppException } from '$lib/server/errors';

type QueryParams = Record<string, string | number | boolean | null | string[]>;

type SanityQueryResponse<T> = {
	result: T;
};

type SanityMutationPayload = {
	mutations: Array<Record<string, unknown>>;
};

type RequestContext = {
	scope: string;
	requestId?: string;
	/**
	 * 'write' fuerza el token de escritura también para consultas. Necesario para
	 * leer documentos con ID en ruta (con punto, como "order.cs_..."), que son
	 * invisibles para peticiones anónimas o con un token sin acceso a esa ruta.
	 */
	auth?: 'read' | 'write';
};

const config = {
	projectId: (privateEnv.SANITY_PROJECT_ID || publicEnv.PUBLIC_SANITY_PROJECT_ID || '').trim(),
	dataset: (privateEnv.SANITY_DATASET || publicEnv.PUBLIC_SANITY_DATASET || 'production').trim(),
	apiVersion: (privateEnv.SANITY_API_VERSION || '2025-02-19').trim()
};

const retryStatuses = new Set([429, 500, 502, 503, 504]);
const readToken = privateEnv.SANITY_READ_TOKEN?.trim();
const writeToken = privateEnv.SANITY_WRITE_TOKEN?.trim();

const sleep = (ms: number): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

const validateCoreConfig = (context: RequestContext): void => {
	if (config.projectId && config.dataset) {
		return;
	}

	throw new AppException({
		code: 'CONFIG',
		scope: context.scope,
		requestId: context.requestId,
		message: 'Configura SANITY_PROJECT_ID/PUBLIC_SANITY_PROJECT_ID y SANITY_DATASET/PUBLIC_SANITY_DATASET.'
	});
};

const buildDataApiUrl = (operation: 'query' | 'mutate', context: RequestContext): string => {
	validateCoreConfig(context);
	return `https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/${operation}/${config.dataset}`;
};

const withHeaders = (token?: string): Headers => {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');

	if (token) {
		headers.set('Authorization', `Bearer ${token}`);
	}

	return headers;
};

const classifyResponseError = async (
	response: Response,
	context: RequestContext,
	messagePrefix: string
): Promise<AppException> => {
	const detail = await response.text();
	const message = `${messagePrefix} (${response.status})`;

	if (response.status === 401 || response.status === 403) {
		return new AppException({
			code: 'AUTH',
			scope: context.scope,
			status: response.status,
			requestId: context.requestId,
			message,
			details: detail
		});
	}

	return new AppException({
		code: 'UPSTREAM',
		scope: context.scope,
		status: response.status,
		requestId: context.requestId,
		message,
		details: detail
	});
};

const requestWithRetry = async (
	fetchFn: typeof fetch,
	url: string,
	init: RequestInit,
	context: RequestContext,
	messagePrefix: string,
	retries = 1
): Promise<Response> => {
	let lastError: AppException | undefined;

	for (let attempt = 0; attempt <= retries; attempt += 1) {
		try {
			const response = await fetchFn(url, init);
			if (response.ok) {
				return response;
			}

			const responseError = await classifyResponseError(response, context, messagePrefix);
			const canRetry = retryStatuses.has(response.status) && attempt < retries;
			if (!canRetry) {
				throw responseError;
			}

			lastError = responseError;
			await sleep(140 * (attempt + 1));
		} catch (error) {
			if (error instanceof AppException) {
				throw error;
			}

			const networkError = new AppException({
				code: 'NETWORK',
				scope: context.scope,
				requestId: context.requestId,
				message: `${messagePrefix} (network)`,
				cause: error
			});

			if (attempt >= retries) {
				throw networkError;
			}

			lastError = networkError;
			await sleep(140 * (attempt + 1));
		}
	}

	throw (
		lastError ??
		new AppException({
			code: 'UPSTREAM',
			scope: context.scope,
			requestId: context.requestId,
			message: `${messagePrefix} (retry-exhausted)`
		})
	);
};

export async function sanityQuery<T>(
	fetchFn: typeof fetch,
	query: string,
	params: QueryParams,
	context: RequestContext
): Promise<T> {
	const url = new URL(buildDataApiUrl('query', context));
	url.searchParams.set('query', query);

	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(`$${key}`, JSON.stringify(value));
	}

	const queryToken = context.auth === 'write' ? writeToken || readToken : readToken;
	const response = await requestWithRetry(
		fetchFn,
		url.toString(),
		{
			method: 'GET',
			headers: withHeaders(queryToken)
		},
		context,
		'Sanity query error',
		1
	);

	const payload = (await response.json()) as SanityQueryResponse<T>;
	return payload.result;
}

export async function sanityMutate(
	fetchFn: typeof fetch,
	mutations: SanityMutationPayload['mutations'],
	context: RequestContext
): Promise<void> {
	validateCoreConfig(context);

	if (!writeToken) {
		throw new AppException({
			code: 'CONFIG',
			scope: context.scope,
			requestId: context.requestId,
			message: 'La configuración necesaria para guardar contenido no está disponible.'
		});
	}

	await requestWithRetry(
		fetchFn,
		buildDataApiUrl('mutate', context),
		{
			method: 'POST',
			headers: withHeaders(writeToken),
			body: JSON.stringify({ mutations } satisfies SanityMutationPayload)
		},
		context,
		'Sanity mutate error',
		1
	);
}
