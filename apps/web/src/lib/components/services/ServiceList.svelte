<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { Service } from '$lib/types';
	import { formatCurrency } from '$lib/utils/currency';

	type Props = {
		services: Service[];
		showFeatured?: boolean;
		revealDelayStep?: number;
		class?: string;
	};

	let {
		services,
		showFeatured = true,
		revealDelayStep = 0,
		class: className = 'divide-y divide-white/12 mt-8'
	}: Props = $props();

	const rowStyle = (index: number): string =>
		revealDelayStep > 0 ? `animation-delay:${index * revealDelayStep}ms` : '';
</script>

<div class={className}>
	{#each services as service, index}
		<article class="swiss-grid gap-y-4 py-6" style={rowStyle(index)}>
			<p class="col-span-4 section-kicker text-white/62 md:col-span-1">{String(index + 1).padStart(2, '0')}</p>
			<div class="col-span-4 md:col-span-5 xl:col-span-7 min-w-0">
				{#if showFeatured && service.featured}
					<p class="pill mb-3">
						<Icon name="star-line" />
						Destacado
					</p>
				{/if}
				<h4 class="text-xl leading-[1.08] text-white sm:text-2xl">{service.title}</h4>
				<p class="mt-2 text-sm leading-relaxed text-white/72">{service.summary}</p>
			</div>
			<div class="col-span-4 md:col-span-2 xl:col-span-4 md:justify-self-end md:text-right">
				<p class="text-sm font-semibold text-white/88">Desde {formatCurrency(service.startingPrice ?? 0)}</p>
				<a href="/contacto" class="icon-cta mt-3" aria-label={`Solicitar ${service.title}`}>
					<Icon name="arrow-right-line" />
				</a>
			</div>
		</article>
	{/each}
</div>
