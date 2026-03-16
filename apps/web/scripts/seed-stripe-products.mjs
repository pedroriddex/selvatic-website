import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Stripe from 'stripe';

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
	readToken: resolveEnv('SANITY_READ_TOKEN', '')
};

async function fetchSanityProducts() {
	if (!sanityConfig.projectId) {
		throw new Error('Falta SANITY_PROJECT_ID o PUBLIC_SANITY_PROJECT_ID en apps/web/.env.');
	}

	const query = `
		*[
			_type == "product" &&
			!(_id in path("drafts.**")) &&
			coalesce(isActive, true) == true
		] | order(_updatedAt desc) {
			name,
			"slug": slug.current,
			description,
			price,
			currency,
			"imageUrl": image.asset->url
		}
	`;

	const url = new URL(
		`https://${sanityConfig.projectId}.api.sanity.io/v${sanityConfig.apiVersion}/data/query/${sanityConfig.dataset}`
	);
	url.searchParams.set('query', query);

	const headers = { 'Content-Type': 'application/json' };
	if (sanityConfig.readToken) {
		headers.Authorization = `Bearer ${sanityConfig.readToken}`;
	}

	const response = await fetch(url.toString(), { headers });
	if (!response.ok) {
		const detail = await response.text();
		throw new Error(`No se pudo leer productos de Sanity (${response.status}): ${detail}`);
	}

	const payload = await response.json();
	const products = Array.isArray(payload?.result) ? payload.result : [];

	return products
		.filter((item) => item && typeof item.slug === 'string' && typeof item.name === 'string')
		.map((item) => ({
			slug: item.slug,
			name: item.name,
			description: typeof item.description === 'string' ? item.description : '',
			price: Number(item.price ?? 0),
			currency: String(item.currency ?? 'EUR').toLowerCase(),
			imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : null
		}))
		.filter((item) => Number.isFinite(item.price) && item.price > 0);
}

async function findProductBySlug(stripe, slug) {
	for await (const product of stripe.products.list({ limit: 100 }).autoPagingIterable()) {
		if (product.metadata?.slug === slug) {
			return product;
		}
	}

	return null;
}

async function ensurePrice(stripe, productId, currency, unitAmount) {
	for await (const price of stripe.prices
		.list({ product: productId, active: true, limit: 100 })
		.autoPagingIterable()) {
		if (price.type === 'one_time' && price.currency === currency && price.unit_amount === unitAmount) {
			return price.id;
		}
	}

	const createdPrice = await stripe.prices.create({
		product: productId,
		currency,
		unit_amount: unitAmount
	});

	return createdPrice.id;
}

async function main() {
	const secretKey = resolveEnv('STRIPE_SECRET_KEY', '');
	if (!secretKey || /X{6,}/.test(secretKey)) {
		throw new Error(
			'No hay una STRIPE_SECRET_KEY real en apps/web/.env. Configura una clave válida y vuelve a ejecutar.'
		);
	}

	const catalog = await fetchSanityProducts();
	if (catalog.length === 0) {
		throw new Error('No hay productos activos en Sanity para sincronizar.');
	}

	const stripe = new Stripe(secretKey);
	const output = [];

	for (const product of catalog) {
		const unitAmount = Math.round(product.price * 100);
		const metadata = {
			slug: product.slug,
			source: 'selvatic-sanity'
		};

		let stripeProduct = await findProductBySlug(stripe, product.slug);

		if (stripeProduct) {
			stripeProduct = await stripe.products.update(stripeProduct.id, {
				name: product.name,
				description: product.description,
				images: product.imageUrl ? [product.imageUrl] : [],
				metadata,
				active: true
			});
		} else {
			stripeProduct = await stripe.products.create({
				name: product.name,
				description: product.description,
				images: product.imageUrl ? [product.imageUrl] : [],
				metadata,
				active: true
			});
		}

		const priceId = await ensurePrice(stripe, stripeProduct.id, product.currency, unitAmount);

		output.push({
			slug: product.slug,
			name: product.name,
			productId: stripeProduct.id,
			priceId,
			price: product.price,
			currency: product.currency.toUpperCase(),
			imageUrl: product.imageUrl
		});
	}

	const outputPath = path.join(appRoot, 'stripe-products.generated.json');
	fs.writeFileSync(
		outputPath,
		`${JSON.stringify({ generatedAt: new Date().toISOString(), products: output }, null, 2)}\n`,
		'utf8'
	);

	console.log('\nProductos sincronizados en Stripe:\n');
	console.table(
		output.map((item) => ({
			slug: item.slug,
			productId: item.productId,
			priceId: item.priceId,
			price: `${item.price} ${item.currency}`
		}))
	);
	console.log(`\nArchivo generado: ${outputPath}`);
}

main().catch((error) => {
	console.error('\n[seed-stripe-products] Error:', error.message);
	process.exitCode = 1;
});
