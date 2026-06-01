<script lang="ts">
	import CheckoutPage from '$lib/features/checkout/components/CheckoutPage.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props() as { data: PageData; form?: ActionData };
</script>

<CheckoutPage status={data.status} pageContent={data.pageContent} form={form ?? undefined} />
