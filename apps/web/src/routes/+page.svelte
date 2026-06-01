<script lang="ts">
	import HomePage from '$lib/features/home/components/HomePage.svelte';
	import type { PageData } from './$types';

	let { data } = $props() as { data: PageData };
</script>

<HomePage
	products={data.products}
	services={data.services}
	pageContent={data.pageContent}
	overallHealth={data.dataHealth.overall}
/>
