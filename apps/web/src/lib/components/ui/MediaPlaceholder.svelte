<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	type Props = {
		label?: string;
		class?: string;
	};

	let { label = '', class: className = '' }: Props = $props();

	const normalizedLabel = $derived(label.trim());
</script>

<div class={`flex h-full w-full flex-col items-center justify-center gap-2 text-white/56 ${className}`}>
	<Icon name="image-line" class="text-3xl opacity-80" />
	{#if normalizedLabel}
		<span class="text-[10px] font-semibold uppercase tracking-[0.16em]">{normalizedLabel}</span>
	{/if}
</div>
