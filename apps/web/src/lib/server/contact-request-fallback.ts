import type { ContactRequestInput } from '$lib/types';
import { env as privateEnv } from '$env/dynamic/private';
import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type PersistFallbackOptions = {
	requestId?: string;
	reason?: string;
};

type ContactRequestFallbackRecord = ContactRequestInput & {
	persistedAt: string;
	requestId?: string;
	reason?: string;
	target: 'local-fallback';
};

const DEFAULT_CONTACT_REQUESTS_FILE = fileURLToPath(
	new URL('../../../.data/contact-requests.ndjson', import.meta.url)
);

const getFallbackFilePath = (): string => {
	const configuredPath = privateEnv.CONTACT_REQUESTS_FILE?.trim();
	return configuredPath ? resolve(configuredPath) : DEFAULT_CONTACT_REQUESTS_FILE;
};

export async function persistContactRequestFallback(
	input: ContactRequestInput,
	options: PersistFallbackOptions = {}
): Promise<string> {
	const filePath = getFallbackFilePath();
	const record: ContactRequestFallbackRecord = {
		...input,
		persistedAt: new Date().toISOString(),
		requestId: options.requestId,
		reason: options.reason,
		target: 'local-fallback'
	};

	await mkdir(dirname(filePath), { recursive: true });
	await appendFile(filePath, `${JSON.stringify(record)}\n`, 'utf8');

	return filePath;
}
