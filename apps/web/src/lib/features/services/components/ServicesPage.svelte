<script lang="ts">
	import ServiceList from '$lib/components/services/ServiceList.svelte';
	import DataHealthNotice from '$lib/components/ui/DataHealthNotice.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import MediaPlaceholder from '$lib/components/ui/MediaPlaceholder.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import { SITE_MEDIA } from '$lib/config/site-media';
	import { getDefaultPageContent, textFor } from '$lib/features/content/model/page-content';
	import type { DataHealth, PageContent, Service } from '$lib/types';

	type Props = {
		services: Service[];
		dataHealth: DataHealth;
		pageContent?: PageContent;
	};

	let { services, dataHealth, pageContent = getDefaultPageContent('services') }: Props = $props();
	const methodSteps = $derived([
		textFor(pageContent, 'method.step1'),
		textFor(pageContent, 'method.step2'),
		textFor(pageContent, 'method.step3')
	]);
</script>

<SectionIntro
	kicker={textFor(pageContent, 'intro.kicker')}
	title={textFor(pageContent, 'intro.title')}
	description={textFor(pageContent, 'intro.description')}
	titleClass="section-title mt-3 max-w-none lg:max-w-5xl xl:max-w-6xl"
	descriptionClass="section-note mt-4 max-w-none lg:max-w-4xl xl:max-w-5xl"
/>

<DataHealthNotice health={dataHealth} class="mb-6" />

<section class="section-integrated reveal reveal-delay">
	<div class="swiss-grid items-start gap-y-10">
		<div class="grid-span-copy">
			<p class="section-kicker text-[#222D22B8]">{textFor(pageContent, 'method.kicker')}</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-[#222D22E0]">{textFor(pageContent, 'method.label')}</h2>
			<h3 class="section-subtitle mt-3 max-w-3xl">{textFor(pageContent, 'method.title')}</h3>
			<ol class="mt-6 divide-y divide-[#222D221F] border-y border-[#222D221F] text-sm leading-relaxed text-[#222D22BD]">
				{#each methodSteps as step}
					<li class="py-4">{step}</li>
				{/each}
			</ol>
			<a href="/contacto" class="btn-lime mt-7">{textFor(pageContent, 'method.cta')}</a>
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
	<div class="swiss-grid items-start gap-y-10">
		<div class="grid-span-copy">
			<p class="section-kicker text-[#222D22B8]">{textFor(pageContent, 'material.kicker')}</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-[#222D22E0]">{textFor(pageContent, 'material.label')}</h2>
			<h3 class="section-subtitle mt-3 max-w-3xl">
				{textFor(pageContent, 'material.title')}
			</h3>
			<p class="section-note mt-5">
				{textFor(pageContent, 'material.p1')}
			</p>
			<p class="section-note mt-4">
				{textFor(pageContent, 'material.p2')}
			</p>
		</div>
		<div class="grid-span-image grid-rail-left">
			<p class="section-kicker text-[#222D22B8]">{textFor(pageContent, 'presentation.kicker')}</p>
			<h3 class="section-subtitle mt-3 max-w-3xl">
				{textFor(pageContent, 'presentation.title')}
			</h3>
			<p class="section-note mt-5">
				{textFor(pageContent, 'presentation.p1')}
			</p>
			<p class="section-note mt-4">
				{textFor(pageContent, 'presentation.p2')}
			</p>
		</div>
	</div>
</section>

<section class="section-integrated mt-14 reveal">
	<SectionHeader
		label={textFor(pageContent, 'list.label')}
		title={textFor(pageContent, 'list.title')}
		description={textFor(pageContent, 'list.description')}
		titleClass="section-subtitle mt-3 max-w-none lg:max-w-4xl xl:max-w-5xl"
		descriptionClass="section-note mt-4 max-w-none lg:max-w-3xl xl:max-w-4xl"
	/>
	{#if services.length > 0}
		<ServiceList
			{services}
			featuredLabel={textFor(pageContent, 'list.featuredLabel')}
			revealDelayStep={35}
			class="divide-y divide-[#222D221F] mt-9"
		/>
	{:else}
		<div class="swiss-grid mt-9">
			<EmptyState
				kicker="Servicios"
				title={textFor(pageContent, 'list.emptyTitle')}
				description={textFor(pageContent, 'list.emptyDescription')}
				class="col-span-4 md:col-span-8 xl:col-span-12"
			/>
		</div>
	{/if}
</section>
