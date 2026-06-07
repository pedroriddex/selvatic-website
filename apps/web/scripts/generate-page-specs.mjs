// Codegen: genera apps/cms/schemaTypes/shared/pageContentSpec.ts a partir de
// PAGE_DEFAULTS (apps/web), que es la fuente de verdad de claves/labels/defaults.
// Reejecuta este script si cambian los textos por defecto.
//   node ./scripts/generate-page-specs.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(appRoot, '../..');
const pageDefaultsPath = path.join(appRoot, 'src/lib/features/content/model/page-content.ts');
const outPath = path.join(repoRoot, 'apps/cms/schemaTypes/shared/pageContentSpec.ts');

function transpile(sourcePath) {
	const source = fs.readFileSync(sourcePath, 'utf8');
	return ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.ES2022,
			target: ts.ScriptTarget.ES2022
		},
		fileName: sourcePath
	}).outputText;
}

async function importTs(sourcePath) {
	const js = transpile(sourcePath);
	const tmpDir = path.join(repoRoot, '.tmp-sanity-seed');
	fs.mkdirSync(tmpDir, { recursive: true });
	const tmpFile = path.join(tmpDir, `gen-${Date.now()}.mjs`);
	fs.writeFileSync(tmpFile, js);
	try {
		return await import(pathToFileURL(tmpFile).href);
	} finally {
		fs.rmSync(tmpFile, { force: true });
	}
}

const pascal = (value) =>
	value
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');

const fieldName = (key) => key.replace(/\./g, '__');
const groupOf = (key) => {
	const segments = key.split('.');
	return segments.length > 1 ? segments[0] : 'general';
};

const { pageDefaultsForSeed } = await importTs(pageDefaultsPath);
const pages = pageDefaultsForSeed();

const specs = pages.map((page) => {
	const groups = [];
	const seenGroups = new Set();
	const fields = page.texts.map((entry) => {
		const group = groupOf(entry.key);
		if (!seenGroups.has(group)) {
			seenGroups.add(group);
			groups.push(group);
		}
		return {
			key: entry.key,
			field: fieldName(entry.key),
			label: entry.label,
			group,
			multiline: typeof entry.value === 'string' && entry.value.length > 70,
			initialValue: entry.value
		};
	});

	return {
		key: page.key,
		typeName: `page${pascal(page.key)}`,
		title: page.title,
		route: page.route,
		seoTitle: page.seoTitle,
		seoDescription: page.seoDescription,
		groups,
		fields
	};
});

const banner = `// AUTO-GENERADO por apps/web/scripts/generate-page-specs.mjs — NO editar a mano.
// Fuente: apps/web/src/lib/features/content/model/page-content.ts (PAGE_DEFAULTS).
`;

const body = `export type PageFieldSpec = {
	key: string;
	field: string;
	label: string;
	group: string;
	multiline: boolean;
	initialValue: string;
};

export type PageSpec = {
	key: string;
	typeName: string;
	title: string;
	route: string;
	seoTitle: string;
	seoDescription: string;
	groups: string[];
	fields: PageFieldSpec[];
};

export const PAGE_SPECS: PageSpec[] = ${JSON.stringify(specs, null, '\t')};
`;

fs.writeFileSync(outPath, `${banner}\n${body}`);
console.log(`Generado ${path.relative(repoRoot, outPath)} con ${specs.length} páginas y ${specs.reduce((acc, spec) => acc + spec.fields.length, 0)} campos.`);
