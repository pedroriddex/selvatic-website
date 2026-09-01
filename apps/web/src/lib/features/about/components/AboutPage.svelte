<script lang="ts">
	import MediaPlaceholder from '$lib/components/ui/MediaPlaceholder.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import { getDefaultPageContent, imageFor, textFor } from '$lib/features/content/model/page-content';
	import { getAboutGalleryItems } from '$lib/features/about/model/about-page';
	import type { PageContent } from '$lib/types';

	type Props = {
		pageContent?: PageContent;
	};

	let { pageContent = getDefaultPageContent('about') }: Props = $props();
	const galleryItems = $derived(getAboutGalleryItems(pageContent));
	const originImage = $derived(imageFor(pageContent, 'media.origin'));
</script>

<SectionIntro
	kicker={textFor(pageContent, 'intro.kicker')}
	title={textFor(pageContent, 'intro.title')}
	description={textFor(pageContent, 'intro.description')}
/>

<section class="section-integrated reveal reveal-delay">
	<div class="swiss-grid items-start gap-y-10">
		<div class="grid-span-copy">
			<p class="section-kicker text-[#222D22B8]">{textFor(pageContent, 'origin.kicker')}</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-[#222D22E0]">{textFor(pageContent, 'origin.label')}</h2>
			<h3 class="section-subtitle mt-3">
				{textFor(pageContent, 'origin.title')}
			</h3>
			<p class="section-note mt-5">
				{textFor(pageContent, 'origin.p1')}
			</p>
			<p class="section-note mt-4">
				{textFor(pageContent, 'origin.p2')}
			</p>
		</div>
		<div class="grid-span-image">
			<div class="image-panel image-panel-arched min-h-[18rem] sm:min-h-[22rem]">
				{#if originImage}
					<img src={originImage} alt="Universo visual de Selvatic" loading="lazy" />
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
			<p class="section-kicker text-[#222D22B8]">{textFor(pageContent, 'work.kicker')}</p>
			<h3 class="section-subtitle mt-3 max-w-3xl">
				{textFor(pageContent, 'work.title')}
			</h3>
			<p class="section-note mt-5">
				{textFor(pageContent, 'work.p1')}
			</p>
			<p class="section-note mt-4">
				{textFor(pageContent, 'work.p2')}
			</p>
		</div>
	</div>
</section>

<!-- Galería sin textos: solo las imágenes (petición de cliente). -->
<section class="section-integrated mt-14 reveal">
	<div class="swiss-grid editorial-mosaic gap-y-8">
		{#each galleryItems as image, index}
			<div class={index === 0 ? 'col-span-4 md:col-span-4 xl:col-span-5' : index === 1 ? 'col-span-4 md:col-span-4 xl:col-span-3' : 'col-span-4 md:col-span-8 xl:col-span-4'}>
				<div class="image-panel image-panel-arched min-h-[18rem] sm:min-h-[22rem]">
					<img src={image.src} alt={image.alt} loading="lazy" />
				</div>
			</div>
		{/each}
	</div>
</section>
