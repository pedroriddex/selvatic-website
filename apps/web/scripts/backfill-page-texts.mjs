// Siembra con setIfMissing los textos que falten en los documentos de página.
//
// Necesario porque los textos del documento MANDAN por completo (un campo
// ausente se muestra vacío, no cae al texto de serie): cada vez que se añadan
// claves de texto nuevas en PAGE_DEFAULTS hay que ejecutar este script para
// que los documentos existentes las incorporen con su valor de serie.
// Es idempotente y NUNCA pisa valores existentes (ni los vacíos '').
//
// Uso:  node ./scripts/backfill-page-texts.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(appRoot, '../..');
const envPaths = [path.join(appRoot, '.env'), path.join(appRoot, '.env.local')];
const specPath = path.join(repoRoot, 'apps/cms/schemaTypes/shared/pageContentSpec.ts');

function loadEnv(filePath) {
	if (!fs.existsSync(filePath)) return {};
	const values = {};
	for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const i = trimmed.indexOf('=');
		if (i < 0) continue;
		values[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim().replace(/^"|"$/g, '');
	}
	return values;
}

const env = envPaths.reduce((entries, p) => ({ ...entries, ...loadEnv(p) }), {});
const resolveEnv = (key, fallback = '') => process.env[key] || env[key] || fallback;

const config = {
	projectId: resolveEnv('SANITY_PROJECT_ID', resolveEnv('PUBLIC_SANITY_PROJECT_ID', '')),
	dataset: resolveEnv('SANITY_DATASET', resolveEnv('PUBLIC_SANITY_DATASET', 'production')),
	apiVersion: resolveEnv('SANITY_API_VERSION', '2025-02-19'),
	writeToken: resolveEnv('SANITY_WRITE_TOKEN', '')
};

async function main() {
	if (!config.projectId || !config.writeToken) {
		throw new Error('Faltan SANITY_PROJECT_ID o SANITY_WRITE_TOKEN en apps/web/.env(.local).');
	}

	// PAGE_SPECS del fichero generado es un literal JSON.
	const specSource = fs.readFileSync(specPath, 'utf8');
	const specs = JSON.parse(specSource.split('PAGE_SPECS: PageSpec[] = ')[1].trim().replace(/;$/, ''));

	const mutations = specs.map((spec) => {
		const setIfMissing = { key: spec.key, seoTitle: spec.seoTitle, seoDescription: spec.seoDescription };
		for (const field of spec.fields) {
			if (field.kind === 'text') {
				setIfMissing[field.field] = field.initialValue;
			}
		}
		return { patch: { id: `page-${spec.key}`, setIfMissing } };
	});

	const response = await fetch(
		`https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/mutate/${config.dataset}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${config.writeToken}`
			},
			body: JSON.stringify({ mutations })
		}
	);

	if (!response.ok) {
		throw new Error(`Sanity mutate ${response.status}: ${await response.text()}`);
	}

	console.log(`Backfill aplicado a ${mutations.length} páginas (setIfMissing, sin pisar nada).`);
}

main().catch((error) => {
	console.error('\n[backfill-page-texts] Error:', error.message);
	process.exitCode = 1;
});
