<script lang="ts">
	import {
		PRODUCT_CATEGORY_FILTER_ALL,
		PRODUCT_CATEGORY_OPTIONS,
		getProductCategoryLabel,
		isProductCategory,
		type ProductCategoryFilter
	} from '$lib/config/product-categories';
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import DataHealthNotice from '$lib/components/ui/DataHealthNotice.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import { getCatalogProductSpan } from '$lib/utils/product-grid';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data } = $props() as { data: PageData };
	let activeCategory = $state<ProductCategoryFilter>(PRODUCT_CATEGORY_FILTER_ALL);

	$effect(() => {
		activeCategory = data.activeCategory;
	});

	const hasActiveCategoryFilter = $derived(activeCategory !== PRODUCT_CATEGORY_FILTER_ALL);
	const activeCategoryLabel = $derived(
		activeCategory === PRODUCT_CATEGORY_FILTER_ALL
			? 'Todas las categorías'
			: getProductCategoryLabel(activeCategory)
	);
	const visibleProducts = $derived(
		activeCategory === PRODUCT_CATEGORY_FILTER_ALL
			? data.products
			: data.products.filter((product) => product.category === activeCategory)
	);
	const collectionDescription = $derived(
		data.products.length === 0
			? 'Aún no hay productos activos publicados en Sanity.'
			: visibleProducts.length === 0
					? `No hay productos activos en ${activeCategoryLabel}.`
					: hasActiveCategoryFilter
						? `${visibleProducts.length} piezas en ${activeCategoryLabel}. Stock y precio sincronizados desde Sanity.`
						: `${data.products.length} piezas disponibles. Stock y precio sincronizados desde Sanity.`
	);
	const emptyStateTitle = $derived(
		data.products.length === 0 ? 'No hay productos publicados' : `Sin resultados en ${activeCategoryLabel}`
	);
	const emptyStateDescription = $derived(
		data.products.length === 0
			? 'Publica productos en Sanity para que se muestren en la tienda.'
			: 'Prueba otra categoría o vuelve a ver toda la colección.'
	);

	const updateFilterUrl = (category: ProductCategoryFilter) => {
		if (typeof window === 'undefined') {
			return;
		}

		const nextUrl = new URL(window.location.href);
		if (category === PRODUCT_CATEGORY_FILTER_ALL) {
			nextUrl.searchParams.delete('categoria');
		} else {
			nextUrl.searchParams.set('categoria', category);
		}

		window.history.replaceState(window.history.state, '', `${nextUrl.pathname}${nextUrl.search}`);
	};

	const selectCategory = (category: ProductCategoryFilter) => {
		if (category === activeCategory) {
			return;
		}

		activeCategory = category;
		updateFilterUrl(category);
	};

	const syncCategoryFromUrl = () => {
		if (typeof window === 'undefined') {
			return;
		}

		const categoryFromUrl = new URLSearchParams(window.location.search).get('categoria');
		activeCategory = isProductCategory(categoryFromUrl) ? categoryFromUrl : PRODUCT_CATEGORY_FILTER_ALL;
	};

	onMount(() => {
		const handlePopState = () => {
			syncCategoryFromUrl();
		};

		window.addEventListener('popstate', handlePopState);
		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	});
</script>

<SectionIntro
	kicker="Tienda"
	title="Flores secas y piezas florales para regalar, habitar y conservar."
	description="Colecciones de unidades limitadas con edición continua: textura, volumen y paleta neutra en equilibrio."
/>

<DataHealthNotice health={data.dataHealth} class="mb-6" />

<section class="section-integrated reveal reveal-delay">
	<SectionHeader
		kicker="Colección completa"
		label="Productos"
		title="Mosaico editorial"
		description={collectionDescription}
	/>

	<div class="mt-7 flex flex-wrap gap-2">
		<a
			href="/tienda"
			aria-current={activeCategory === PRODUCT_CATEGORY_FILTER_ALL ? 'page' : undefined}
			class={`category-chip ${activeCategory === PRODUCT_CATEGORY_FILTER_ALL ? 'is-active' : ''}`}
			onclick={(event) => {
				event.preventDefault();
				selectCategory(PRODUCT_CATEGORY_FILTER_ALL);
			}}
		>
			Todas
		</a>
		{#each PRODUCT_CATEGORY_OPTIONS as category}
			<a
				href={`/tienda?categoria=${category.value}`}
				aria-current={activeCategory === category.value ? 'page' : undefined}
				class={`category-chip ${activeCategory === category.value ? 'is-active' : ''}`}
				onclick={(event) => {
					event.preventDefault();
					selectCategory(category.value);
				}}
			>
				{category.label}
			</a>
		{/each}
	</div>

	{#if visibleProducts.length > 0}
		<div class="swiss-grid editorial-mosaic mt-12 gap-y-12">
			{#each visibleProducts as product, index}
				<ProductCard product={product} mode="catalog" class={getCatalogProductSpan(index)} delayMs={index * 30} />
			{/each}
		</div>
	{:else}
		<div class="swiss-grid mt-12">
			<div class="col-span-4 md:col-span-8 xl:col-span-12">
				<EmptyState title={emptyStateTitle} description={emptyStateDescription} />
				{#if hasActiveCategoryFilter}
					<div class="mt-6 flex justify-center">
						<a href="/tienda" class="btn-outline">Ver toda la colección</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</section>
