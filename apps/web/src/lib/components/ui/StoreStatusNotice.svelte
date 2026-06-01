<script lang="ts">
	import { STORE_LOCK_DESCRIPTION, STORE_LOCK_TITLE } from '$lib/config/store';
	import Icon from '$lib/components/ui/Icon.svelte';

	type Props = {
		class?: string;
		compact?: boolean;
		showDescription?: boolean;
	};

	let {
		class: className = '',
		compact = false,
		showDescription = true
	}: Props = $props();
</script>

<div
	class={`border border-[#222D2224] bg-[#FFFFFF8C] ${compact ? 'p-4 sm:p-5' : 'p-6 sm:p-7'} ${className}`.trim()}
	role="status"
	aria-live="polite"
>
	<div class="flex items-start gap-3">
		<div class="icon-cta mt-0.5 shrink-0">
			<Icon name="star-line" />
		</div>
		<div>
			<p class="section-kicker text-[#222D22AD]">Tienda online</p>
			<h3 class={`${compact ? 'mt-3 text-lg sm:text-xl' : 'mt-3 text-xl sm:text-2xl'} leading-[1.05] text-[#222D22]`}>
				{STORE_LOCK_TITLE}
			</h3>
			{#if showDescription}
				<p class="mt-3 max-w-2xl text-sm leading-relaxed text-[#222D22BD]">{STORE_LOCK_DESCRIPTION}</p>
			{/if}
		</div>
	</div>
</div>
