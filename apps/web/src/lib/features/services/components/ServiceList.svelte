<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { Service } from '$lib/types';
	import { formatCurrency } from '$lib/utils/currency';

	type Props = {
		services: Service[];
		showFeatured?: boolean;
		featuredLabel?: string;
		revealDelayStep?: number;
		class?: string;
	};

	let {
		services,
		showFeatured = true,
		featuredLabel = 'Destacado',
		revealDelayStep = 0,
		class: className = 'divide-y divide-[#222D221F] mt-8'
	}: Props = $props();

	const rowStyle = (index: number): string =>
		revealDelayStep > 0 ? `animation-delay:${index * revealDelayStep}ms` : '';

	const isHighlighted = (service: Service) => showFeatured && service.featured;
</script>

<div class={className}>
	{#each services as service, index}
		<article
			class={`service-list-item swiss-grid gap-y-4 px-4 py-5 md:px-5 ${isHighlighted(service) ? 'service-list-item-featured rounded-[0.55rem] border border-[#222D22] bg-[#222D22]' : ''}`.trim()}
			style={rowStyle(index)}
		>
			<p class={`service-list-index col-span-4 section-kicker md:col-span-1 ${isHighlighted(service) ? 'text-[#EBF1E5A8]' : 'text-[#222D229E]'}`.trim()}>
				{String(index + 1).padStart(2, '0')}
			</p>
			<div class="col-span-4 md:col-span-5 xl:col-span-7 min-w-0">
				{#if isHighlighted(service)}
					<p class="service-list-featured-label mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#EBF1E5B8]">
						{featuredLabel}
					</p>
				{/if}
				<h4 class={`service-list-title text-xl leading-[1.08] sm:text-2xl ${isHighlighted(service) ? 'text-[#EBF1E5]' : 'text-[#222D22]'}`.trim()}>
					{service.title}
				</h4>
				<p class={`service-list-summary mt-2 text-sm leading-relaxed ${isHighlighted(service) ? 'text-[#EBF1E5C2]' : 'text-[#222D22B8]'}`.trim()}>
					{service.summary}
				</p>
			</div>
			<div class="col-span-4 md:col-span-2 xl:col-span-4 md:justify-self-end md:text-right">
				<p class={`service-list-price text-sm font-semibold ${isHighlighted(service) ? 'text-[#EBF1E5E0]' : 'text-[#222D22E0]'}`.trim()}>
					Desde {formatCurrency(service.startingPrice ?? 0)}
				</p>
				<a
					href="/contacto"
					class={`service-list-action icon-cta mt-3 ${isHighlighted(service) ? 'border-[#EBF1E540] text-[#EBF1E5] hover:border-[#EBF1E5] hover:bg-[#EBF1E514] hover:text-[#EBF1E5] focus:border-[#EBF1E5] focus:bg-[#EBF1E514] focus:text-[#EBF1E5]' : ''}`.trim()}
					aria-label={`Solicitar ${service.title}`}
				>
					<Icon name="arrow-right-line" />
				</a>
			</div>
		</article>
	{/each}
</div>
