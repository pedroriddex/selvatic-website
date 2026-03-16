<script lang="ts">
	import { PRODUCT_CATEGORY_OPTIONS } from '$lib/config/product-categories';
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import ServiceList from '$lib/components/services/ServiceList.svelte';
	import DataHealthNotice from '$lib/components/ui/DataHealthNotice.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import { SITE_MEDIA } from '$lib/config/site-media';
	import { getBestSellerProductSpan, getFeaturedProductSpan } from '$lib/utils/product-grid';
	import type { PageData } from './$types';

	let { data } = $props() as { data: PageData };

	const categories = PRODUCT_CATEGORY_OPTIONS.map((category) => category.label);

	const getHeroVideoUrl = () => SITE_MEDIA.heroVideoUrl;
	const getHeroVideoPosterUrl = () => SITE_MEDIA.heroVideoPosterUrl;
	const getHeroVideoType = () => (/\.webm(\?|$)/i.test(getHeroVideoUrl() ?? '') ? 'video/webm' : 'video/mp4');

	const featuredProducts = $derived(data.products.slice(0, 5));
	const bestSellers = $derived(data.products.slice(5, 8).length > 0 ? data.products.slice(5, 8) : data.products.slice(0, 3));
	const promoImage = $derived(SITE_MEDIA.homePromoImageUrl || featuredProducts[0]?.imageUrl);
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
			poster={getHeroVideoPosterUrl()}
		>
			{#if getHeroVideoUrl()}
				<source src={getHeroVideoUrl()} type={getHeroVideoType()} />
			{/if}
		</video>

		<div class="absolute inset-0 bg-[linear-gradient(108deg,rgba(8,14,11,0.86)_0%,rgba(8,14,11,0.6)_52%,rgba(8,14,11,0.42)_100%)]"></div>
		<div class="absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(185,217,138,0.14),transparent_42%)]"></div>
	</article>

	<div class="hero-stage-content">
		<div class="swiss-grid hero-stage-grid items-end py-12 sm:py-14 lg:py-16">
			<div class="col-span-4 md:col-span-6 xl:col-span-8">
				<p class="section-kicker text-white/78">Selvatic Studio / Floristería</p>
				<h1 class="mt-4 max-w-5xl text-balance text-5xl leading-[0.88] text-white sm:text-6xl lg:text-7xl">
					Flores secas con dirección estética para espacios contemporáneos.
				</h1>
				<p class="mt-6 max-w-3xl text-sm leading-relaxed text-white/82 sm:text-base">
					Colecciones botánicas, ramos a medida e intervenciones florales con composición limpia, ritmo editorial y sensibilidad natural.
				</p>
				<div class="mt-9 flex flex-wrap gap-3">
					<a href="/tienda" class="btn-lime">
						<Icon name="shopping-bag-3-line" />
						Shop now
					</a>
					<a href="/servicios" class="btn-outline">
						<Icon name="layout-grid-line" />
						Ver servicios
					</a>
				</div>
			</div>

			<div class="col-span-4 grid-rail-left md:col-span-2 md:self-end xl:col-span-4">
				<p class="section-kicker text-white/66">Atelier</p>
				<dl class="mt-4 space-y-2 text-xs uppercase tracking-[0.12em] text-white/78 sm:text-[11px]">
					<div class="flex items-center justify-between border-b border-white/12 pb-2">
						<dt>Materialidad</dt>
						<dd class="text-white">Flores secas</dd>
					</div>
					<div class="flex items-center justify-between border-b border-white/12 pb-2">
						<dt>Servicio</dt>
						<dd class="text-white">Personalizado</dd>
					</div>
					<div class="flex items-center justify-between">
						<dt>Respuesta</dt>
						<dd class="text-white">24h laborales</dd>
					</div>
				</dl>
			</div>
		</div>
	</div>
</section>

<DataHealthNotice health={data.dataHealth.overall} class="mt-8" />

<section class="section-integrated mt-12 reveal reveal-delay">
	<SectionHeader
		kicker="Colecciones"
		label="Catálogo"
		title="Selección botánica con prioridad visual"
		description="Piezas editadas para regalo, interiorismo residencial y producciones de marca."
		actionHref="/tienda"
		actionLabel="Ver todo"
	/>

	{#if featuredProducts.length > 0}
		<div class="mt-7 flex flex-wrap gap-2">
			{#each categories as category, index}
				<span class={`category-chip ${index === 0 ? 'is-active' : ''}`}>{category}</span>
			{/each}
		</div>

		<div class="swiss-grid editorial-mosaic mt-10 gap-y-12">
			{#each featuredProducts as product, index}
				<ProductCard product={product} mode="home" class={getFeaturedProductSpan(index)} delayMs={index * 35} />
			{/each}
		</div>
	{:else}
		<div class="swiss-grid mt-10">
			<EmptyState
				title="No hay productos publicados todavía"
				description="Cuando publiques productos en Sanity aparecerán aquí automáticamente."
				class="col-span-4 md:col-span-8 xl:col-span-12"
			/>
		</div>
	{/if}
</section>

<section class="section-integrated mt-14 reveal reveal-delay">
	<SectionHeader kicker="Best sellers" label="Selección" title="Piezas con mayor salida esta temporada" />

	{#if bestSellers.length > 0}
		<div class="swiss-grid editorial-mosaic mt-10 gap-y-12">
			{#each bestSellers as product, index}
				<ProductCard product={product} mode="home" class={getBestSellerProductSpan(index)} delayMs={index * 35} />
			{/each}
		</div>
	{:else}
		<div class="swiss-grid mt-10">
			<EmptyState
				kicker="Best sellers"
				title="Aún no hay selección destacada"
				description="Publica productos en Sanity y empezaremos a mostrar los más vendidos en esta sección."
				class="col-span-4 md:col-span-8 xl:col-span-12"
			/>
		</div>
	{/if}
</section>

<section class="section-integrated mt-14 reveal reveal-delay-2">
	<div class="swiss-grid items-end gap-y-10">
		<div class="grid-span-copy">
			<p class="section-kicker">Dirección floral</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-white/88">Espacios</h2>
			<h3 class="section-subtitle mt-3">Transforma tu espacio con composiciones botánicas vivas.</h3>
			<p class="section-note mt-5">
				Diseñamos atmósferas florales para viviendas, hospitality y activaciones de marca con ejecución integral.
			</p>
			<a href="/contacto" class="btn-lime mt-7">Pedir propuesta</a>
		</div>
		<div class="grid-span-image">
			<div class="image-panel image-panel-arched">
				{#if promoImage}
					<img src={promoImage} alt="Composición floral Selvatic" loading="lazy" />
				{:else}
					<div class="flex h-full w-full items-center justify-center text-white/55">
						<Icon name="image-line" class="text-4xl" />
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<section class="section-integrated mt-14 reveal reveal-delay-2">
	<SectionHeader
		kicker="Servicios"
		label="Atelier"
		title="Diseño floral a medida"
		actionHref="/servicios"
		actionLabel="Todos los servicios"
	/>
	{#if data.services.length > 0}
		<ServiceList services={data.services} showFeatured={false} />
	{:else}
		<div class="swiss-grid mt-8">
			<EmptyState
				kicker="Servicios"
				title="No hay servicios publicados todavía"
				description="Añade servicios en Sanity para mostrarlos en la home."
				class="col-span-4 md:col-span-8 xl:col-span-12"
			/>
		</div>
	{/if}
</section>
