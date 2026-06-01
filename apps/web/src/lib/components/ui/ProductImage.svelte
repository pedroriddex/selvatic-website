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

<div class={`${shellClass} relative overflow-hidden border border-[#222D2224] bg-[#FFFFFF73] ${className}`}>
	{#if src}
		<img src={src} alt={alt} class={`product-image-media ${imageClass}`} loading="lazy" />
	{:else}
		<MediaPlaceholder label={placeholderLabel} class={placeholderClass} />
	{/if}
</div>

<style>
	.product-image-shell {
		min-height: 100%;
		border-radius: 0.38rem;
	}

	.product-image-shell-arched {
		border-radius: 0.38rem;
	}

	.product-image-media {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
