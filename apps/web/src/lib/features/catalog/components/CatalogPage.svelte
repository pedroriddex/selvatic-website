<script lang="ts">
	import {
		PRODUCT_CATEGORY_FILTER_ALL,
		PRODUCT_CATEGORY_OPTIONS,
		getProductCategoryLabel,
		isProductCategory,
		type ProductCategoryFilter
	} from '$lib/config/product-categories';
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import { getProductCardCopy } from '$lib/features/catalog/model/product-card-copy';
	import { ONLINE_STORE_ENABLED } from '$lib/config/store';
	import DataHealthNotice from '$lib/components/ui/DataHealthNotice.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import StoreStatusNotice from '$lib/components/ui/StoreStatusNotice.svelte';
	import { getDefaultPageContent, textFor } from '$lib/features/content/model/page-content';
	import { getCatalogProductSpan } from '$lib/utils/product-grid';
	import type { DataHealth, PageContent, Product } from '$lib/types';
	import { onMount } from 'svelte';

	type Props = {
		products: Product[];
		initialCategory: ProductCategoryFilter;
		pageContent?: PageContent;
		dataHealth: DataHealth;
	};

	let { products, initialCategory, pageContent = getDefaultPageContent('shop'), dataHealth }: Props = $props();
	const productCardCopy = $derived(getProductCardCopy(pageContent));
	let activeCategory = $state<ProductCategoryFilter>(PRODUCT_CATEGORY_FILTER_ALL);

	$effect(() => {
		activeCategory = initialCategory;
	});

	const formatTemplate = (template: string, values: Record<string, string | number>) =>
		Object.entries(values).reduce(
			(output, [key, value]) => output.replaceAll(`{${key}}`, String(value)),
			template
		);

	const hasActiveCategoryFilter = $derived(activeCategory !== PRODUCT_CATEGORY_FILTER_ALL);
	const activeCategoryLabel = $derived(
		activeCategory === PRODUCT_CATEGORY_FILTER_ALL
			? textFor(pageContent, 'filter.allCategoriesLabel')
			: getProductCategoryLabel(activeCategory)
	);
	const visibleProducts = $derived(
		activeCategory === PRODUCT_CATEGORY_FILTER_ALL
			? products
			: products.filter((product: Product) => product.category === activeCategory)
	);
	const collectionDescription = $derived(
		!ONLINE_STORE_ENABLED
			? textFor(pageContent, 'collection.disabledDescription')
			: products.length === 0
				? textFor(pageContent, 'collection.emptyDescription')
				: visibleProducts.length === 0
					? formatTemplate(textFor(pageContent, 'collection.noResultsTemplate'), { category: activeCategoryLabel })
					: hasActiveCategoryFilter
						? formatTemplate(textFor(pageContent, 'collection.filteredTemplate'), {
								count: visibleProducts.length,
								category: activeCategoryLabel
							})
						: formatTemplate(textFor(pageContent, 'collection.allTemplate'), { count: products.length })
	);
	const emptyStateTitle = $derived(
		products.length === 0
			? textFor(pageContent, 'empty.noProductsTitle')
			: `${textFor(pageContent, 'empty.noResultsPrefix')} ${activeCategoryLabel}`
	);
	const emptyStateDescription = $derived(
		products.length === 0
			? textFor(pageContent, 'empty.noProductsDescription')
			: textFor(pageContent, 'empty.noResultsDescription')
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
	kicker={textFor(pageContent, 'intro.kicker')}
	title={textFor(pageContent, 'intro.title')}
	description={textFor(pageContent, 'intro.description')}
/>

<DataHealthNotice health={dataHealth} class="mb-6" />

{#if !ONLINE_STORE_ENABLED}
	<StoreStatusNotice class="mb-6" />
{/if}

<section class="section-integrated reveal reveal-delay">
	<SectionHeader
		kicker={textFor(pageContent, 'collection.kicker')}
		label={textFor(pageContent, 'collection.label')}
		title={textFor(pageContent, 'collection.title')}
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
			{textFor(pageContent, 'filter.all')}
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
				<ProductCard {product} mode="catalog" copy={productCardCopy} class={getCatalogProductSpan(index)} delayMs={index * 30} />
			{/each}
		</div>
	{:else}
		<div class="swiss-grid mt-12">
			<div class="col-span-4 md:col-span-8 xl:col-span-12">
				<EmptyState title={emptyStateTitle} description={emptyStateDescription} />
				{#if hasActiveCategoryFilter}
					<div class="mt-6 flex justify-center">
						<a href="/tienda" class="btn-outline">{textFor(pageContent, 'empty.showAll')}</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</section>
