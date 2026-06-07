import { colorInput } from '@sanity/color-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { PAGE_TYPE_NAMES, schemaTypes } from './schemaTypes';
import { deskStructure } from './src/deskStructure';
import { StudioLayout } from './src/studio/StudioLayout';
import { getStudioDataset, getStudioProjectId, getStudioTitle } from './src/studio/env';

const projectId = getStudioProjectId();
const dataset = getStudioDataset();
const title = getStudioTitle();

// Documentos únicos (singletons): no se pueden duplicar, borrar ni crear desde cero.
const SINGLETON_TYPES = new Set(['siteSettings', 'designSettings', ...PAGE_TYPE_NAMES]);

if (!projectId) {
	throw new Error(
		'Configuration must contain `projectId`. Define SANITY_STUDIO_PROJECT_ID in apps/cms/.env.'
	);
}

export default defineConfig({
	name: 'default',
	title,
	projectId,
	dataset,
	plugins: [
		colorInput(),
		structureTool({
			structure: deskStructure
		}),
		visionTool()
	],
	schema: {
		types: schemaTypes,
		templates: (templates) =>
			templates.filter((template) => !SINGLETON_TYPES.has(template.schemaType))
	},
	document: {
		newDocumentOptions: (prev, context) =>
			context.creationContext.type === 'global'
				? prev.filter((templateItem) => !SINGLETON_TYPES.has(templateItem.templateId))
				: prev,
		actions: (prev, context) =>
			SINGLETON_TYPES.has(context.schemaType)
				? prev.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
				: prev
	},
	studio: {
		components: {
			layout: StudioLayout
		}
	}
});
