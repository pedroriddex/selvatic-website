import { visionTool } from '@sanity/vision';
import { buildLegacyTheme, defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { StudioLayout } from './src/components/StudioLayout';
import { StudioLogo } from './src/components/StudioLogo';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const title = process.env.SANITY_STUDIO_TITLE || 'Selvatic CMS';

const studioTheme = buildLegacyTheme({
	'--font-family-base': '"Manrope", "Helvetica Neue", Arial, sans-serif',
	'--font-family-monospace':
		'"JetBrains Mono", "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
	'--black': '#0b1410',
	'--white': '#edf3e8',
	'--brand-primary': '#b9d98a',
	'--component-bg': '#101b16',
	'--component-text-color': '#d1dacd',
	'--default-button-color': '#2b3c32',
	'--default-button-primary-color': '#b9d98a',
	'--default-button-success-color': '#86c596',
	'--default-button-warning-color': '#dfbd77',
	'--default-button-danger-color': '#d38179',
	'--focus-color': '#c9e89d',
	'--gray-base': '#16241d',
	'--gray': '#9ead9f',
	'--main-navigation-color': '#16241d',
	'--main-navigation-color--inverted': '#edf3e8',
	'--state-info-color': '#8cb7d9',
	'--state-success-color': '#86c596',
	'--state-warning-color': '#dfbd77',
	'--state-danger-color': '#d38179'
});

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
	theme: studioTheme,
	plugins: [structureTool(), visionTool()],
	schema: {
		types: schemaTypes
	},
	studio: {
		components: {
			layout: StudioLayout,
			logo: StudioLogo
		}
	}
});
