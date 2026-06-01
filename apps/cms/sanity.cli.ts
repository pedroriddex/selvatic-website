import { defineCliConfig } from 'sanity/cli';
import { getStudioBasePath, getStudioDataset, getStudioProjectId } from './src/studio/env';

export default defineCliConfig({
	api: {
		projectId: getStudioProjectId(),
		dataset: getStudioDataset()
	},
	project: {
		basePath: getStudioBasePath()
	}
});
