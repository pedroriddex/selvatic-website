<script lang="ts">
	import MediaPlaceholder from '$lib/components/ui/MediaPlaceholder.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import { getDefaultPageContent, textFor } from '$lib/features/content/model/page-content';
	import { ABOUT_GALLERY_ITEMS, ABOUT_VISUAL_IMAGE_URL } from '$lib/features/about/model/about-page';
	import type { PageContent } from '$lib/types';

	type Props = {
		pageContent?: PageContent;
	};

	let { pageContent = getDefaultPageContent('about') }: Props = $props();
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
				{#if ABOUT_VISUAL_IMAGE_URL}
					<img src={ABOUT_VISUAL_IMAGE_URL} alt="Universo visual de Selvatic" loading="lazy" />
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
			<p class="section-kicker text-[#222D22B8]">{textFor(pageContent, 'director.kicker')}</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-[#222D22E0]">{textFor(pageContent, 'director.label')}</h2>
			<h3 class="section-subtitle mt-3">
				{textFor(pageContent, 'director.title')}
			</h3>
			<p class="section-note mt-5">
				{textFor(pageContent, 'director.p1')}
			</p>
			<p class="section-note mt-4">
				{textFor(pageContent, 'director.p2')}
			</p>
		</div>
		<div class="grid-span-image grid-rail-left">
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

<section class="section-integrated mt-14 reveal">
	<div class="swiss-grid items-end gap-y-6">
		<div class="col-span-4 md:col-span-6 xl:col-span-8">
			<p class="section-kicker">{textFor(pageContent, 'gallery.kicker')}</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-[#222D22E0]">{textFor(pageContent, 'gallery.label')}</h2>
			<h3 class="section-subtitle mt-3">{textFor(pageContent, 'gallery.title')}</h3>
		</div>
	</div>

	<div class="swiss-grid editorial-mosaic mt-10 gap-y-8">
		{#each ABOUT_GALLERY_ITEMS as image, index}
			<div class={index === 0 ? 'col-span-4 md:col-span-4 xl:col-span-5' : index === 1 ? 'col-span-4 md:col-span-4 xl:col-span-3' : 'col-span-4 md:col-span-8 xl:col-span-4'}>
				<div class="image-panel image-panel-arched min-h-[18rem] sm:min-h-[22rem]">
					<img src={image.src} alt={image.alt} loading="lazy" />
				</div>
			</div>
		{/each}
	</div>
</section>

<section class="section-integrated mt-14 reveal">
	<div class="swiss-grid items-start gap-y-10">
		<div class="grid-span-copy">
			<p class="section-kicker text-[#222D22B8]">{textFor(pageContent, 'material.kicker')}</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-[#222D22E0]">{textFor(pageContent, 'material.label')}</h2>
			<h3 class="section-subtitle mt-3">
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
			<p class="section-kicker text-[#222D22B8]">{textFor(pageContent, 'presence.kicker')}</p>
			<h3 class="section-subtitle mt-3 max-w-3xl">
				{textFor(pageContent, 'presence.title')}
			</h3>
			<p class="section-note mt-5">
				{textFor(pageContent, 'presence.p1')}
			</p>
			<p class="section-note mt-4">
				{textFor(pageContent, 'presence.p2')}
			</p>
		</div>
	</div>
</section>

<section class="section-integrated mt-14 reveal">
	<div class="swiss-grid items-end gap-y-8">
		<div class="col-span-4 md:col-span-6 xl:col-span-8">
			<p class="section-kicker">{textFor(pageContent, 'contact.kicker')}</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-[#222D22E0]">{textFor(pageContent, 'contact.label')}</h2>
			<h3 class="section-subtitle mt-3">{textFor(pageContent, 'contact.title')}</h3>
			<p class="section-note mt-5">
				{textFor(pageContent, 'contact.description')}
			</p>
		</div>
		<div class="col-span-4 md:col-span-2 xl:col-span-4 md:justify-self-end">
			<a href="/contacto" class="btn-lime">{textFor(pageContent, 'contact.cta')}</a>
		</div>
	</div>
</section>
