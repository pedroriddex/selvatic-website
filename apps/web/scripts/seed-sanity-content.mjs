import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, '..');
const envPath = path.join(appRoot, '.env');

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

const env = loadEnv(envPath);
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

const seedProducts = [
	{
		name: 'Ramo Bruma Lima',
		slug: 'ramo-bruma-lima',
		description: 'Ramo de flores secas en paleta neutra con acento verde lima para interiores contemporáneos.',
		price: 64.0,
		stock: 16
	},
	{
		name: 'Centro Nórdico Musgo',
		slug: 'centro-nordico-musgo',
		description: 'Centro de mesa de perfil bajo, pensado para comedor y recibidor con estética editorial.',
		price: 52.0,
		stock: 20
	},
	{
		name: 'Mini Bouquet Atelier',
		slug: 'mini-bouquet-atelier',
		description: 'Formato pequeño ideal para regalo o detalle de mesa auxiliar.',
		price: 29.0,
		stock: 30
	},
	{
		name: 'Pack Dúo Esencias',
		slug: 'pack-duo-esencias',
		description: 'Dos mini composiciones combinadas para estantería, mueble bajo o mesita.',
		price: 45.0,
		stock: 18
	},
	{
		name: 'Composición Botánica Vertical',
		slug: 'composicion-botanica-vertical',
		description: 'Pieza de gran formato con lectura arquitectónica para espacios amplios.',
		price: 98.0,
		stock: 8
	},
	{
		name: 'Centro Mesa Editorial',
		slug: 'centro-mesa-editorial',
		description: 'Centro lineal para mesas largas, con volumen controlado y paleta equilibrada.',
		price: 67.0,
		stock: 10
	}
];

const seedServices = [
	{
		title: 'Decoración Floral para Eventos',
		slug: 'decoracion-floral-eventos',
		summary: 'Diseño floral integral para bodas, cenas privadas y eventos de marca.',
		content:
			'Desarrollamos concepto, selección botánica, producción y montaje final con dirección estética y ejecución técnica.',
		startingPrice: 450,
		featured: true
	},
	{
		title: 'Ramos Personalizados',
		slug: 'ramos-personalizados',
		summary: 'Ramos a medida para regalo, hogar o producción visual.',
		content:
			'Adaptamos paleta, escala y tipo de flor seca al contexto, con propuesta previa y ajuste fino antes de la entrega.',
		startingPrice: 55,
		featured: true
	},
	{
		title: 'Styling Botánico para Espacios',
		slug: 'styling-botanico-espacios',
		summary: 'Intervenciones florales para retail, hospitality y residencias.',
		content:
			'Creamos composiciones permanentes o de temporada para aportar identidad visual y coherencia espacial.',
		startingPrice: 320,
		featured: false
	},
	{
		title: 'Suscripción Floral Mensual',
		slug: 'suscripcion-floral-mensual',
		summary: 'Renovación mensual de composiciones florales secas.',
		content:
			'Servicio de mantenimiento estético con recambio de piezas y curaduría de arreglos según temporada.',
		startingPrice: 95,
		featured: false
	},
	{
		title: 'Dirección Floral para Shooting',
		slug: 'direccion-floral-shooting',
		summary: 'Soporte creativo para campañas, editoriales y contenido de marca.',
		content:
			'Planificamos y producimos escenas botánicas con enfoque editorial para foto y video.',
		startingPrice: 280,
		featured: false
	}
];

function toSlugValue(current) {
	return {
		_type: 'slug',
		current
	};
}

function productDoc(seed) {
	return {
		_type: 'product',
		name: seed.name,
		slug: toSlugValue(seed.slug),
		description: seed.description,
		price: seed.price,
		currency: 'EUR',
		stock: seed.stock,
		isActive: true
	};
}

function serviceDoc(seed) {
	return {
		_type: 'service',
		title: seed.title,
		slug: toSlugValue(seed.slug),
		summary: seed.summary,
		content: seed.content,
		startingPrice: seed.startingPrice,
		featured: seed.featured
	};
}

async function main() {
	if (!sanityConfig.projectId) {
		throw new Error('Falta SANITY_PROJECT_ID o PUBLIC_SANITY_PROJECT_ID en apps/web/.env.');
	}

	if (!sanityConfig.writeToken) {
		throw new Error('Falta SANITY_WRITE_TOKEN en apps/web/.env para crear contenido.');
	}

	const existing = await sanityQuery(`
		{
			"productSlugs": *[_type == "product" && !(_id in path("drafts.**"))].slug.current,
			"serviceSlugs": *[_type == "service" && !(_id in path("drafts.**"))].slug.current
		}
	`);

	const existingProductSlugs = new Set(Array.isArray(existing?.productSlugs) ? existing.productSlugs : []);
	const existingServiceSlugs = new Set(Array.isArray(existing?.serviceSlugs) ? existing.serviceSlugs : []);

	const productsToCreate = seedProducts.filter((item) => !existingProductSlugs.has(item.slug));
	const servicesToCreate = seedServices.filter((item) => !existingServiceSlugs.has(item.slug));

	const mutations = [
		...productsToCreate.map((item) => ({
			create: {
				_id: `product.seed.${item.slug}`,
				...productDoc(item)
			}
		})),
		...servicesToCreate.map((item) => ({
			create: {
				_id: `service.seed.${item.slug}`,
				...serviceDoc(item)
			}
		}))
	];

	if (mutations.length === 0) {
		console.log('No hay contenido nuevo que crear. Productos y servicios seed ya existen.');
		return;
	}

	await sanityMutate(mutations);

	console.log(`Productos creados: ${productsToCreate.length}`);
	console.log(`Servicios creados: ${servicesToCreate.length}`);
	console.log('Listo. Ya puedes subir imágenes de productos en Sanity Studio.');
}

main().catch((error) => {
	console.error('\n[seed-sanity-content] Error:', error.message);
	process.exitCode = 1;
});
