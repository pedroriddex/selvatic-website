export const externalFetch: typeof fetch = (...args) => globalThis.fetch(...args);

export const sanitizeDocumentId = (value: string): string => value.replace(/[^a-zA-Z0-9_.-]/g, '-');

export const toFiniteNumber = (value: unknown, fallback = 0): number => {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === 'string') {
		const parsed = Number.parseFloat(value);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}

	return fallback;
};
