<script lang="ts">
	import ServicesPage from '$lib/features/services/components/ServicesPage.svelte';
	import type { PageData } from './$types';

	let { data } = $props() as { data: PageData };
</script>

<ServicesPage
	services={data.services}
	dataHealth={data.dataHealth}
	pageContent={data.pageContent}
/>
