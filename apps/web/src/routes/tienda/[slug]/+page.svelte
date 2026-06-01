<script lang="ts">
	import CatalogProductPage from '$lib/features/catalog/components/CatalogProductPage.svelte';
	import type { PageData } from './$types';

	let { data } = $props() as { data: PageData };
</script>

<CatalogProductPage
	product={data.product}
	relatedProducts={data.relatedProducts}
	relatedProductsHealth={data.dataHealth.relatedProducts}
	pageContent={data.pageContent}
/>
