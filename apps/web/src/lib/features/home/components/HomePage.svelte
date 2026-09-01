<script lang="ts">
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import ServiceList from '$lib/components/services/ServiceList.svelte';
	import DataHealthNotice from '$lib/components/ui/DataHealthNotice.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import { getProductCardCopy } from '$lib/features/catalog/model/product-card-copy';
	import { getDefaultPageContent, textFor } from '$lib/features/content/model/page-content';
	import {
		HOME_COMMERCE_SIGNAL_ICONS,
		getBestSellerProducts,
		getFeaturedProducts,
		getHomeCategoryLabels,
		getHomeHeroVideoPosterUrl,
		getHomeHeroVideoType,
		getHomeHeroVideoUrl,
		getHomePromoImage
	} from '$lib/features/home/model/home-page';
	import { getBestSellerProductSpan, getFeaturedProductSpan } from '$lib/utils/product-grid';
	import type { DataHealth, PageContent, Product, Service } from '$lib/types';

	type Props = {
		products: Product[];
		services: Service[];
		pageContent?: PageContent;
		overallHealth: DataHealth;
	};

	let { products, services, pageContent = getDefaultPageContent('home'), overallHealth }: Props = $props();

	const categories = getHomeCategoryLabels();
	const productCardCopy = $derived(getProductCardCopy(pageContent));
	const featuredProducts = $derived(getFeaturedProducts(products));
	const bestSellers = $derived(getBestSellerProducts(products));
	const promoImage = $derived(getHomePromoImage(featuredProducts, pageContent));
	const commerceSignals = $derived(
		HOME_COMMERCE_SIGNAL_ICONS.map((icon, index) => {
			const position = index + 1;
			return {
				icon,
				title: textFor(pageContent, `signal.${position}.title`),
				description: textFor(pageContent, `signal.${position}.description`)
			};
		})
	);
</script>

<section class="hero-stage reveal -mt-2">
	<article class="hero-morph-banner">
		<video
			class="absolute inset-0 h-full w-full object-cover"
			autoplay
			muted
			loop
			playsinline
			preload="metadata"
			poster={getHomeHeroVideoPosterUrl(pageContent)}
		>
			{#if getHomeHeroVideoUrl()}
				<source src={getHomeHeroVideoUrl()} type={getHomeHeroVideoType()} />
			{/if}
		</video>

		<div class="absolute inset-0 bg-[linear-gradient(108deg,rgba(235,241,229,0.92)_0%,rgba(235,241,229,0.7)_52%,rgba(235,241,229,0.5)_100%)]"></div>
		<div class="absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(34,45,34,0.12),transparent_42%)]"></div>
	</article>

	<div class="hero-stage-content">
		<div class="swiss-grid hero-stage-grid items-end py-12 sm:py-14 lg:py-16">
			<div class="col-span-4 md:col-span-6 xl:col-span-8">
				<p class="section-kicker text-[#222D22C7]">{textFor(pageContent, 'hero.kicker')}</p>
				<h1 class="mt-4 max-w-5xl text-balance text-5xl leading-[0.88] text-[#222D22] sm:text-6xl lg:text-7xl">
					{textFor(pageContent, 'hero.title')}
				</h1>
				<p class="hero-intro-copy max-w-3xl text-sm leading-relaxed text-[#222D22D1] sm:text-base">
					{textFor(pageContent, 'hero.description')}
				</p>
				<div class="mt-9 flex flex-wrap gap-3">
					<a href="/tienda" class="btn-lime">
						<Icon name="shopping-bag-3-line" />
						{textFor(pageContent, 'hero.primaryCta')}
					</a>
					<a href="/sobre-nosotros" class="btn-outline">
						<Icon name="arrow-right-line" />
						{textFor(pageContent, 'hero.secondaryCta')}
					</a>
				</div>
			</div>

			<div class="col-span-4 grid-rail-left md:col-span-2 md:self-end xl:col-span-4">
				<p class="section-kicker text-[#222D22A8]">{textFor(pageContent, 'hero.railKicker')}</p>
				<dl class="mt-4 space-y-2 text-xs uppercase tracking-[0.12em] text-[#222D22C7] sm:text-[11px]">
					<div class="flex items-center justify-between border-b border-[#222D221F] pb-2">
						<dt>{textFor(pageContent, 'hero.stat1.label')}</dt>
						<dd class="text-[#222D22]">{textFor(pageContent, 'hero.stat1.value')}</dd>
					</div>
					<div class="flex items-center justify-between border-b border-[#222D221F] pb-2">
						<dt>{textFor(pageContent, 'hero.stat2.label')}</dt>
						<dd class="text-[#222D22]">{textFor(pageContent, 'hero.stat2.value')}</dd>
					</div>
					<div class="flex items-center justify-between">
						<dt>{textFor(pageContent, 'hero.stat3.label')}</dt>
						<dd class="text-[#222D22]">{textFor(pageContent, 'hero.stat3.value')}</dd>
					</div>
				</dl>
			</div>
		</div>
	</div>
</section>

<DataHealthNotice health={overallHealth} class="mt-8" />

<section class="section-integrated mt-10 reveal reveal-delay">
	<div class="commerce-signal-grid">
		{#each commerceSignals as signal}
			<article class="commerce-signal-card">
				<div class="commerce-signal-icon">
					<Icon name={signal.icon} class="text-base" />
				</div>
				<div>
					<p class="commerce-signal-title">{signal.title}</p>
					<p class="commerce-signal-copy">{signal.description}</p>
				</div>
			</article>
		{/each}
	</div>
</section>

<section class="section-integrated mt-12 reveal reveal-delay">
	<SectionHeader
		kicker={textFor(pageContent, 'collections.kicker')}
		label={textFor(pageContent, 'collections.label')}
		title={textFor(pageContent, 'collections.title')}
		description={textFor(pageContent, 'collections.description')}
		actionHref="/tienda"
		actionLabel={textFor(pageContent, 'collections.action')}
	/>

	{#if featuredProducts.length > 0}
		<div class="mt-7 flex flex-wrap gap-2">
			{#each categories as category, index}
				<span class={`category-chip ${index === 0 ? 'is-active' : ''}`}>{category}</span>
			{/each}
		</div>

		<div class="swiss-grid editorial-mosaic mt-10 gap-y-12">
			{#each featuredProducts as product, index}
				<ProductCard product={product} mode="home" copy={productCardCopy} class={getFeaturedProductSpan(index)} delayMs={index * 35} />
			{/each}
		</div>
	{:else}
		<div class="swiss-grid mt-10">
			<EmptyState
				title={textFor(pageContent, 'collections.emptyTitle')}
				description={textFor(pageContent, 'collections.emptyDescription')}
				class="col-span-4 md:col-span-8 xl:col-span-12"
			/>
		</div>
	{/if}
</section>

<section class="section-integrated mt-14 reveal reveal-delay">
	<SectionHeader
		kicker={textFor(pageContent, 'bestSellers.kicker')}
		label={textFor(pageContent, 'bestSellers.label')}
		title={textFor(pageContent, 'bestSellers.title')}
	/>

	{#if bestSellers.length > 0}
		<div class="swiss-grid editorial-mosaic mt-10 gap-y-12">
			{#each bestSellers as product, index}
				<ProductCard product={product} mode="home" copy={productCardCopy} class={getBestSellerProductSpan(index)} delayMs={index * 35} />
			{/each}
		</div>
	{:else}
		<div class="swiss-grid mt-10">
			<EmptyState
				kicker="Best sellers"
				title={textFor(pageContent, 'bestSellers.emptyTitle')}
				description={textFor(pageContent, 'bestSellers.emptyDescription')}
				class="col-span-4 md:col-span-8 xl:col-span-12"
			/>
		</div>
	{/if}
</section>

<section class="section-integrated mt-14 reveal reveal-delay-2">
	<div class="swiss-grid items-end gap-y-10">
		<div class="grid-span-copy">
			<p class="section-kicker">{textFor(pageContent, 'promo.kicker')}</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-[#222D22E0]">{textFor(pageContent, 'promo.label')}</h2>
			<h3 class="section-subtitle mt-3">{textFor(pageContent, 'promo.title')}</h3>
			<p class="section-note mt-5">
				{textFor(pageContent, 'promo.description')}
			</p>
			<div class="mt-7 flex flex-wrap gap-3">
				<a href="/contacto" class="btn-lime">{textFor(pageContent, 'promo.primaryCta')}</a>
				<a href="/sobre-nosotros" class="btn-outline">{textFor(pageContent, 'promo.secondaryCta')}</a>
			</div>
		</div>
		<div class="grid-span-image">
			<div class="image-panel image-panel-arched">
				{#if promoImage}
					<img src={promoImage} alt="Composición floral Selvatic" loading="lazy" />
				{:else}
					<div class="flex h-full w-full items-center justify-center text-[#222D228C]">
						<Icon name="image-line" class="text-4xl" />
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<section class="section-integrated mt-14 reveal reveal-delay-2">
	<SectionHeader
		kicker={textFor(pageContent, 'services.kicker')}
		label={textFor(pageContent, 'services.label')}
		title={textFor(pageContent, 'services.title')}
		description={textFor(pageContent, 'services.description')}
		actionHref="/servicios"
		actionLabel={textFor(pageContent, 'services.action')}
	/>
	{#if services.length > 0}
		<ServiceList {services} showFeatured={false} />
	{:else}
		<div class="swiss-grid mt-8">
			<EmptyState
				kicker="Servicios"
				title={textFor(pageContent, 'services.emptyTitle')}
				description={textFor(pageContent, 'services.emptyDescription')}
				class="col-span-4 md:col-span-8 xl:col-span-12"
			/>
		</div>
	{/if}
</section>
