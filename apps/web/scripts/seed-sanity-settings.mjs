import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(appRoot, '../..');
const envPaths = [path.join(appRoot, '.env'), path.join(appRoot, '.env.local')];
const pageDefaultsPath = path.join(
	appRoot,
	'src/lib/features/content/model/page-content.ts'
);
const designDefaultsPath = path.join(
	appRoot,
	'src/lib/features/design/model/design-settings.ts'
);

function loadEnv(filePath) {
	if (!fs.existsSync(filePath)) {
		return {};
	}

	const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
	const values = {};

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) {
			continue;
		}

		const separatorIndex = trimmed.indexOf('=');
		if (separatorIndex < 0) {
			continue;
		}

		const key = trimmed.slice(0, separatorIndex).trim();
		const rawValue = trimmed.slice(separatorIndex + 1).trim();
		values[key] = rawValue.replace(/^"|"$/g, '');
	}

	return values;
}

const env = envPaths.reduce((entries, filePath) => ({ ...entries, ...loadEnv(filePath) }), {});
const resolveEnv = (key, fallback = '') => process.env[key] || env[key] || fallback;

const sanityConfig = {
	projectId: resolveEnv('SANITY_PROJECT_ID', resolveEnv('PUBLIC_SANITY_PROJECT_ID', '')),
	dataset: resolveEnv('SANITY_DATASET', resolveEnv('PUBLIC_SANITY_DATASET', 'production')),
	apiVersion: resolveEnv('SANITY_API_VERSION', '2025-02-19'),
	writeToken: resolveEnv('SANITY_WRITE_TOKEN', '')
};

function dataApiUrl(operation) {
	return `https://${sanityConfig.projectId}.api.sanity.io/v${sanityConfig.apiVersion}/data/${operation}/${sanityConfig.dataset}`;
}

function headers() {
	const auth = sanityConfig.writeToken ? { Authorization: `Bearer ${sanityConfig.writeToken}` } : {};
	return {
		'Content-Type': 'application/json',
		...auth
	};
}

async function sanityQuery(query) {
	const url = new URL(dataApiUrl('query'));
	url.searchParams.set('query', query);

	const response = await fetch(url.toString(), {
		method: 'GET',
		headers: headers()
	});

	if (!response.ok) {
		const detail = await response.text();
		throw new Error(`Sanity query ${response.status}: ${detail}`);
	}

	const payload = await response.json();
	return payload.result;
}

async function sanityMutate(mutations) {
	if (mutations.length === 0) {
		return;
	}

	const response = await fetch(dataApiUrl('mutate'), {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({ mutations })
	});

	if (!response.ok) {
		const detail = await response.text();
		throw new Error(`Sanity mutate ${response.status}: ${detail}`);
	}
}

function transpileTsModule(sourcePath) {
	const source = fs.readFileSync(sourcePath, 'utf8');
	const transpiled = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.ES2022,
			target: ts.ScriptTarget.ES2022,
			importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
			preserveValueImports: false
		},
		fileName: sourcePath
	});

	return transpiled.outputText;
}

async function importTsModule(sourcePath) {
	const js = transpileTsModule(sourcePath);
	const tmpDir = path.join(repoRoot, '.tmp-sanity-seed');
	fs.mkdirSync(tmpDir, { recursive: true });

	const fileName = `${path.basename(sourcePath, '.ts')}-${Date.now()}-${Math.random()
		.toString(36)
		.slice(2)}.mjs`;
	const tmpFile = path.join(tmpDir, fileName);
	fs.writeFileSync(tmpFile, js);

	try {
		return await import(pathToFileURL(tmpFile).href);
	} finally {
		fs.rmSync(tmpFile, { force: true });
	}
}

function pascalCase(value) {
	return value
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

const pageTypeName = (key) => `page${pascalCase(key)}`;
const fieldNameFor = (key) => key.replace(/\./g, '__');

// Cada página es un documento con campos con nombre (a__b) y su propio _type.
function pageFields(page) {
	const fields = {};
	for (const entry of page.texts) {
		fields[fieldNameFor(entry.key)] = entry.value;
	}
	return fields;
}

function pageDoc(page) {
	return {
		_id: `page.${page.key}`,
		_type: pageTypeName(page.key),
		key: page.key,
		seoTitle: page.seoTitle,
		seoDescription: page.seoDescription,
		...pageFields(page)
	};
}

function colorValue(hex) {
	return {
		_type: 'color',
		hex
	};
}

function designDoc(defaults) {
	return {
		_id: 'designSettings',
		_type: 'designSettings',
		light: colorValue(defaults.light),
		dark: colorValue(defaults.dark),
		accent: colorValue(defaults.accent),
		accentHover: colorValue(defaults.accentHover),
		accentInk: colorValue(defaults.accentInk),
		surface: colorValue(defaults.surface),
		success: colorValue(defaults.success),
		warning: colorValue(defaults.warning),
		error: colorValue(defaults.error)
	};
}

// Devuelve los campos (a__b, seo...) que faltan o están vacíos en el documento
// existente, para añadirlos sin pisar lo que el editor ya haya cambiado.
function missingPageFields(existingPage, defaults) {
	const desired = pageDoc(defaults);
	const setIfMissing = {};
	for (const [field, value] of Object.entries(desired)) {
		if (field === '_id' || field === '_type') {
			continue;
		}
		const current = existingPage?.[field];
		if (current === undefined || current === null || current === '') {
			setIfMissing[field] = value;
		}
	}
	return setIfMissing;
}

async function main() {
	if (!sanityConfig.projectId) {
		throw new Error('Falta SANITY_PROJECT_ID o PUBLIC_SANITY_PROJECT_ID en apps/web/.env.');
	}

	if (!sanityConfig.writeToken) {
		throw new Error('Falta SANITY_WRITE_TOKEN en apps/web/.env.local para crear contenido.');
	}

	const [{ pageDefaultsForSeed }, { DEFAULT_DESIGN_SETTINGS }] = await Promise.all([
		importTsModule(pageDefaultsPath),
		importTsModule(designDefaultsPath)
	]);

	const pageDefaults = pageDefaultsForSeed();
	const pageIds = pageDefaults.map((page) => `"page.${page.key}"`).join(',');
	const existing = await sanityQuery(`
		{
			"pages": *[_id in [${pageIds}] && !(_id in path("drafts.**"))]{...},
			"design": *[_id == "designSettings" && !(_id in path("drafts.**"))][0]{
				_id, light, dark, accent, accentHover, accentInk, surface, success, warning, error
			}
		}
	`);

	const existingPages = new Map(
		(Array.isArray(existing?.pages) ? existing.pages : []).map((page) => [page._id, page])
	);
	const mutations = [];

	for (const page of pageDefaults) {
		const id = `page.${page.key}`;
		const existingPage = existingPages.get(id);

		if (!existingPage) {
			mutations.push({ createIfNotExists: pageDoc(page) });
			continue;
		}

		const setIfMissing = missingPageFields(existingPage, page);
		if (Object.keys(setIfMissing).length > 0) {
			mutations.push({ patch: { id, setIfMissing } });
		}
	}

	if (!existing?.design?._id) {
		mutations.push({ createIfNotExists: designDoc(DEFAULT_DESIGN_SETTINGS) });
	} else {
		const missingColorFields = Object.fromEntries(
			Object.entries(DEFAULT_DESIGN_SETTINGS)
				.filter(([key]) => !existing.design[key]?.hex)
				.map(([key, value]) => [key, colorValue(value)])
		);

		if (Object.keys(missingColorFields).length > 0) {
			mutations.push({
				patch: {
					id: 'designSettings',
					setIfMissing: missingColorFields
				}
			});
		}
	}

	if (mutations.length === 0) {
		console.log('No hay ajustes nuevos que crear. Páginas y Diseño ya están inicializados.');
		return;
	}

	await sanityMutate(mutations);

	const createdPages = pageDefaults.filter((page) => !existingPages.has(`page.${page.key}`)).length;
	const updatedPages = mutations.filter((mutation) => mutation.patch?.id?.startsWith('page.')).length;
	const createdDesign = existing?.design?._id ? 0 : 1;

	console.log(`Páginas creadas: ${createdPages}`);
	console.log(`Páginas actualizadas con textos nuevos: ${updatedPages}`);
	console.log(`Documento Diseño creado: ${createdDesign}`);
	console.log('Listo. Ya puedes editar Páginas y Diseño desde Sanity Studio.');
}

main().catch((error) => {
	console.error('\n[seed-sanity-settings] Error:', error.message);
	process.exitCode = 1;
});
