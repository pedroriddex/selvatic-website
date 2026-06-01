const resolveEnv = (...values: Array<string | undefined>) =>
	values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim() || '';

export const getStudioProjectId = () =>
	resolveEnv(
		process.env.SANITY_STUDIO_PROJECT_ID,
		process.env.SANITY_PROJECT_ID,
		process.env.PUBLIC_SANITY_PROJECT_ID
	);

export const getStudioDataset = () =>
	resolveEnv(
		process.env.SANITY_STUDIO_DATASET,
		process.env.SANITY_DATASET,
		process.env.PUBLIC_SANITY_DATASET,
		'production'
	);

export const getStudioTitle = () => resolveEnv(process.env.SANITY_STUDIO_TITLE, 'Selvatic CMS');

export const getStudioBasePath = () =>
	resolveEnv(process.env.SANITY_STUDIO_BASEPATH, process.env.SANITY_STUDIO_BASE_PATH, '/admin');
