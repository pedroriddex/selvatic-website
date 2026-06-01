<script lang="ts">
	import ContactPage from '$lib/features/contact/components/ContactPage.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props() as { data: PageData; form?: ActionData };
</script>

<ContactPage
	services={data.services}
	dataHealth={data.dataHealth}
	pageContent={data.pageContent}
	form={form ?? undefined}
/>
