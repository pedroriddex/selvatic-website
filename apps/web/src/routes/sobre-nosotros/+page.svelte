<script lang="ts">
	import AboutPage from '$lib/features/about/components/AboutPage.svelte';
	import type { PageData } from './$types';

	let { data } = $props() as { data: PageData };
</script>

<AboutPage pageContent={data.pageContent} />
