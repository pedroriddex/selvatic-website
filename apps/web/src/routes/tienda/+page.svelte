<script lang="ts">
	import CatalogPage from '$lib/features/catalog/components/CatalogPage.svelte';
	import type { PageData } from './$types';

	let { data } = $props() as { data: PageData };
</script>

<CatalogPage
	products={data.products}
	initialCategory={data.activeCategory}
	pageContent={data.pageContent}
	dataHealth={data.dataHealth}
/>
