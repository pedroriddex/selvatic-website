import { colorInput } from '@sanity/color-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { deskStructure } from './src/deskStructure';
import { StudioLayout } from './src/studio/StudioLayout';
import { getStudioDataset, getStudioProjectId, getStudioTitle } from './src/studio/env';

const projectId = getStudioProjectId();
const dataset = getStudioDataset();
const title = getStudioTitle();

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
			templates.filter(
				(template) =>
					!['siteSettings', 'designSettings', 'page'].includes(template.schemaType)
			)
	},
	document: {
		newDocumentOptions: (prev, context) =>
			context.creationContext.type === 'global'
				? prev.filter(
						(templateItem) =>
							!['siteSettings', 'designSettings', 'page'].includes(
								templateItem.templateId
							)
					)
				: prev,
		actions: (prev, context) =>
			['siteSettings', 'designSettings', 'page'].includes(context.schemaType)
				? prev.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
				: prev
	},
	studio: {
		components: {
			layout: StudioLayout
		}
	}
});
