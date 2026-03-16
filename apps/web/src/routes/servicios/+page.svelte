<script lang="ts">
import ServiceList from '$lib/components/services/ServiceList.svelte';
import DataHealthNotice from '$lib/components/ui/DataHealthNotice.svelte';
import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import MediaPlaceholder from '$lib/components/ui/MediaPlaceholder.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import { SITE_MEDIA } from '$lib/config/site-media';
	import type { PageData } from './$types';

	let { data } = $props() as { data: PageData };

	const methodSteps = [
		'1. Escucha y dirección visual.',
		'2. Propuesta estética y presupuesto.',
		'3. Producción, montaje y seguimiento.'
	];
</script>

<SectionIntro
	kicker="Servicios"
	title="Decoración floral y dirección estética para espacios y eventos."
	description="Desde concepto hasta instalación final: ejecuciones refinadas, naturales y coherentes con el tono de cada proyecto."
/>

<DataHealthNotice health={data.dataHealth} class="mb-6" />

<section class="section-integrated reveal reveal-delay">
	<div class="swiss-grid items-start gap-y-10">
		<div class="grid-span-copy">
			<p class="section-kicker text-white/72">Metodología</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-white/88">Proceso</h2>
			<h3 class="section-subtitle mt-3 max-w-3xl">Dirección clara, producción precisa y montaje final impecable.</h3>
			<ol class="mt-6 divide-y divide-white/12 border-y border-white/12 text-sm leading-relaxed text-white/74">
				{#each methodSteps as step}
					<li class="py-4">{step}</li>
				{/each}
			</ol>
			<a href="/contacto" class="btn-lime mt-7">Pedir propuesta</a>
		</div>
		<div class="grid-span-image">
			<div class="image-panel image-panel-arched">
				{#if SITE_MEDIA.servicesVisualImageUrl}
					<img src={SITE_MEDIA.servicesVisualImageUrl} alt="Dirección floral Selvatic" loading="lazy" />
				{:else}
					<MediaPlaceholder class="h-full w-full" />
				{/if}
			</div>
		</div>
	</div>
</section>

<section class="section-integrated mt-14 reveal">
	<SectionHeader label="Servicios" title="Intervenciones y ramos a medida" />
	{#if data.services.length > 0}
		<ServiceList services={data.services} revealDelayStep={35} class="divide-y divide-white/12 mt-9" />
	{:else}
		<div class="swiss-grid mt-9">
			<EmptyState
				kicker="Servicios"
				title="No hay servicios publicados"
				description="Publica servicios en Sanity para mostrarlos en esta sección."
				class="col-span-4 md:col-span-8 xl:col-span-12"
			/>
		</div>
	{/if}
</section>
