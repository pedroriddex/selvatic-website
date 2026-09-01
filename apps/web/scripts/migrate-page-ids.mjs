// Migración one-shot: copia los documentos de página con ID antiguo con punto
// ("page.home") a IDs con guion ("page-home") y borra los antiguos.
//
// Por qué: en Sanity, los IDs con punto viven en una "ruta" y NO son visibles
// para consultas sin token (igual que los drafts). La web pública consulta sin
// token, así que nunca veía las ediciones de las páginas.
//
// Uso:  node ./scripts/migrate-page-ids.mjs [--keep-old]
//   --keep-old  no borra los documentos antiguos tras copiar.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, '..');
const envPaths = [path.join(appRoot, '.env'), path.join(appRoot, '.env.local')];
const keepOld = process.argv.includes('--keep-old');

function loadEnv(filePath) {
	if (!fs.existsSync(filePath)) {
		return {};
	}

	const values = {};
	for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const separatorIndex = trimmed.indexOf('=');
		if (separatorIndex < 0) continue;
		values[trimmed.slice(0, separatorIndex).trim()] = trimmed
			.slice(separatorIndex + 1)
			.trim()
			.replace(/^"|"$/g, '');
	}
	return values;
}

const env = envPaths.reduce((entries, filePath) => ({ ...entries, ...loadEnv(filePath) }), {});
const resolveEnv = (key, fallback = '') => process.env[key] || env[key] || fallback;

const config = {
	projectId: resolveEnv('SANITY_PROJECT_ID', resolveEnv('PUBLIC_SANITY_PROJECT_ID', '')),
	dataset: resolveEnv('SANITY_DATASET', resolveEnv('PUBLIC_SANITY_DATASET', 'production')),
	apiVersion: resolveEnv('SANITY_API_VERSION', '2025-02-19'),
	writeToken: resolveEnv('SANITY_WRITE_TOKEN', '')
};

const dataApiUrl = (operation) =>
	`https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/${operation}/${config.dataset}`;

const headers = () => ({
	'Content-Type': 'application/json',
	Authorization: `Bearer ${config.writeToken}`
});

async function sanityQuery(query) {
	const url = new URL(dataApiUrl('query'));
	url.searchParams.set('query', query);
	const response = await fetch(url.toString(), { headers: headers() });
	if (!response.ok) {
		throw new Error(`Sanity query ${response.status}: ${await response.text()}`);
	}
	return (await response.json()).result;
}

async function sanityMutate(mutations) {
	if (mutations.length === 0) return;
	const response = await fetch(dataApiUrl('mutate'), {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({ mutations })
	});
	if (!response.ok) {
		throw new Error(`Sanity mutate ${response.status}: ${await response.text()}`);
	}
}

async function main() {
	if (!config.projectId || !config.writeToken) {
		throw new Error('Faltan SANITY_PROJECT_ID o SANITY_WRITE_TOKEN en apps/web/.env(.local).');
	}

	const oldDocs = await sanityQuery('*[_id in path("page.*") && !(_id in path("drafts.**"))]');
	if (!Array.isArray(oldDocs) || oldDocs.length === 0) {
		console.log('No hay documentos con ID antiguo (page.*). Nada que migrar.');
		return;
	}

	const newIds = oldDocs.map((doc) => `"page-${doc._id.slice('page.'.length)}"`).join(',');
	const existingNew = new Set(
		(await sanityQuery(`*[_id in [${newIds}]]._id`)) ?? []
	);

	const copies = [];
	const deletions = [];

	for (const doc of oldDocs) {
		const key = doc._id.slice('page.'.length);
		const newId = `page-${key}`;
		const { _id, _rev, _createdAt, _updatedAt, ...fields } = doc;

		if (existingNew.has(newId)) {
			// El destino ya existe (migración previa o edición posterior): no se
			// sobrescribe para no perder cambios más recientes.
			console.log(`= ${newId} ya existe; se conserva y solo se retira ${_id}.`);
		} else {
			copies.push({ create: { _id: newId, ...fields, key: fields.key ?? key } });
			console.log(`+ ${_id} -> ${newId}`);
		}

		if (!keepOld) {
			deletions.push({ delete: { id: _id } });
			deletions.push({ delete: { id: `drafts.${_id}` } });
		}
	}

	await sanityMutate(copies);
	await sanityMutate(deletions);

	console.log(
		`\nListo: ${copies.length} páginas copiadas${keepOld ? '' : `, ${oldDocs.length} antiguas eliminadas`}.`
	);
}

main().catch((error) => {
	console.error('\n[migrate-page-ids] Error:', error.message);
	process.exitCode = 1;
});
