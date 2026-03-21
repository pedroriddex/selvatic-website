<script lang="ts">
	import MediaPlaceholder from '$lib/components/ui/MediaPlaceholder.svelte';

	type Props = {
		src?: string | null;
		alt: string;
		class?: string;
		imageClass?: string;
		mask?: 'rounded' | 'arched';
		placeholderLabel?: string;
		placeholderClass?: string;
	};

	let {
		src,
		alt,
		class: className = '',
		imageClass = '',
		mask = 'rounded',
		placeholderLabel,
		placeholderClass = ''
	}: Props = $props();

	const shellClass = $derived(mask === 'arched' ? 'product-image-shell product-image-shell-arched' : 'product-image-shell');
</script>

<div class={`${shellClass} overflow-hidden border border-white/14 bg-white/5 ${className}`}>
	{#if src}
		<img src={src} alt={alt} class={`h-full w-full object-cover ${imageClass}`} loading="lazy" />
	{:else}
		<MediaPlaceholder label={placeholderLabel} class={placeholderClass} />
	{/if}
</div>

<style>
	.product-image-shell {
		border-radius: 0.38rem;
	}

	.product-image-shell-arched {
		border-radius: 0.38rem;
	}
</style>
