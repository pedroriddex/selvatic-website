import { describe, expect, it, vi } from 'vitest';

const publicEnv: Record<string, string> = {
	PUBLIC_SANITY_PROJECT_ID: 'demo-project',
	PUBLIC_SANITY_DATASET: 'production'
};

const privateEnv: Record<string, string> = {
	SANITY_PROJECT_ID: 'demo-project',
	SANITY_DATASET: 'production',
	SANITY_API_VERSION: '2025-02-19',
	SANITY_READ_TOKEN: '',
	SANITY_WRITE_TOKEN: 'write-token'
};

vi.mock('$env/dynamic/public', () => ({
	env: publicEnv
}));

vi.mock('$env/dynamic/private', () => ({
	env: privateEnv
}));

const runWithEnv = async <T>(
	vars: Partial<Record<keyof typeof privateEnv, string>>,
	run: (module: typeof import('./sanity-client')) => Promise<T>
) => {
	for (const [key, value] of Object.entries(vars)) {
		if (value === undefined) {
			delete privateEnv[key];
			continue;
		}

		privateEnv[key] = value;
	}

	vi.resetModules();
	const module = await import('./sanity-client');

	try {
		return await run(module);
	} finally {
		privateEnv.SANITY_PROJECT_ID = 'demo-project';
		privateEnv.SANITY_DATASET = 'production';
		privateEnv.SANITY_API_VERSION = '2025-02-19';
		privateEnv.SANITY_READ_TOKEN = '';
		privateEnv.SANITY_WRITE_TOKEN = 'write-token';
	}
};

describe('sanity-client', () => {
	it('runs a sanity query', async () => {
		await runWithEnv(
			{
				SANITY_PROJECT_ID: 'demo-project',
				SANITY_DATASET: 'production',
				SANITY_API_VERSION: '2025-02-19',
				SANITY_READ_TOKEN: ''
			},
			async ({ sanityQuery }) => {
				const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
					new Response(JSON.stringify({ result: [{ _id: 'product-01' }] }), {
						status: 200,
						headers: { 'Content-Type': 'application/json' }
					})
				);

				const result = await sanityQuery<{ _id: string }[]>(
					fetchMock,
					'*[_type == "product"]',
					{},
					{ scope: 'test.query' }
				);

				expect(result).toEqual([{ _id: 'product-01' }]);
				expect(fetchMock).toHaveBeenCalledTimes(1);
			}
		);
	});

	it('serializes query params as JSON for Sanity', async () => {
		await runWithEnv(
			{
				SANITY_PROJECT_ID: 'demo-project',
				SANITY_DATASET: 'production',
				SANITY_API_VERSION: '2025-02-19'
			},
			async ({ sanityQuery }) => {
				const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
					new Response(JSON.stringify({ result: null }), {
						status: 200,
						headers: { 'Content-Type': 'application/json' }
					})
				);

				await sanityQuery(fetchMock, '*[_type == "product" && slug.current == $slug][0]', { slug: 'ramo-test' }, {
					scope: 'test.params'
				});

				const calledUrl = fetchMock.mock.calls[0]?.[0];
				const url = new URL(String(calledUrl));
				expect(url.searchParams.get('$slug')).toBe('\"ramo-test\"');
			}
		);
	});

	it('classifies auth errors from Sanity', async () => {
		await runWithEnv(
			{
				SANITY_PROJECT_ID: 'demo-project',
				SANITY_DATASET: 'production',
				SANITY_API_VERSION: '2025-02-19',
				SANITY_READ_TOKEN: ''
			},
			async ({ sanityQuery }) => {
				const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
					new Response('forbidden', {
						status: 403
					})
				);

				await expect(
					sanityQuery(fetchMock, '*[]', {}, { scope: 'test.auth' })
				).rejects.toMatchObject({
					name: 'AppException',
					code: 'AUTH'
				});
			}
		);
	});

	it('requires write token for mutations', async () => {
		await runWithEnv(
			{
				SANITY_PROJECT_ID: 'demo-project',
				SANITY_DATASET: 'production',
				SANITY_API_VERSION: '2025-02-19',
				SANITY_WRITE_TOKEN: ''
			},
			async ({ sanityMutate }) => {
				const fetchMock = vi.fn<typeof fetch>();
				await expect(
					sanityMutate(fetchMock, [{ create: { _type: 'contactRequest', name: 'Test' } }], {
						scope: 'test.mutate'
					})
				).rejects.toMatchObject({
					name: 'AppException',
					code: 'CONFIG'
				});
			}
		);
	});
});
