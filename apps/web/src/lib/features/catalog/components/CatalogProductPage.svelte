<script lang="ts">
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import { getProductCardCopy } from '$lib/features/catalog/model/product-card-copy';
	import { ONLINE_STORE_ENABLED } from '$lib/config/store';
	import DataHealthNotice from '$lib/components/ui/DataHealthNotice.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import ProductImage from '$lib/components/ui/ProductImage.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import StoreStatusNotice from '$lib/components/ui/StoreStatusNotice.svelte';
	import { addProductToCartWithFeedback } from '$lib/features/catalog/client/product-cart';
	import { getDefaultPageContent, textFor } from '$lib/features/content/model/page-content';
	import { getRelatedProductSpan } from '$lib/utils/product-grid';
	import { formatCurrency } from '$lib/utils/currency';
	import type { DataHealth, PageContent, Product } from '$lib/types';
	import { onDestroy } from 'svelte';

	type Props = {
		product: Product;
		relatedProducts: Product[];
		relatedProductsHealth: DataHealth;
		pageContent?: PageContent;
	};

	let {
		product,
		relatedProducts,
		relatedProductsHealth,
		pageContent = getDefaultPageContent('product')
	}: Props = $props();

	const productCardCopy = $derived(getProductCardCopy(pageContent));
	let cartFeedback = $state<string | null>(null);
	let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
	let selectedImageIndex = $state(0);
	const galleryImages = $derived(
		product.gallery.length > 0
			? product.gallery
			: product.imageUrl
				? [{ url: product.imageUrl, alt: product.name, isPrimary: true }]
				: []
	);
	const selectedImage = $derived(galleryImages[selectedImageIndex] ?? galleryImages[0]);

	const setFeedback = (message: string) => {
		cartFeedback = message;

		if (feedbackTimer) {
			clearTimeout(feedbackTimer);
		}

		feedbackTimer = setTimeout(() => {
			cartFeedback = null;
			feedbackTimer = undefined;
		}, 2000);
	};

	onDestroy(() => {
		if (feedbackTimer) {
			clearTimeout(feedbackTimer);
		}
	});

	const addToCart = () => {
		const result = addProductToCartWithFeedback(product);

		if (!result.ok && !result.locked) {
			setFeedback(result.error);
		}
	};
</script>

<SectionIntro
	kicker={textFor(pageContent, 'intro.kicker')}
	title={product.name}
	description={ONLINE_STORE_ENABLED
		? textFor(pageContent, 'intro.descriptionEnabled')
		: textFor(pageContent, 'intro.descriptionDisabled')}
	class="section-intro mb-12 reveal"
/>

{#if !ONLINE_STORE_ENABLED}
	<StoreStatusNotice class="mb-6" compact />
{/if}

<section class="section-integrated reveal reveal-delay">
	<div class="swiss-grid items-start gap-y-10">
		<article class="grid-span-image">
			<ProductImage src={selectedImage?.url ?? product.imageUrl} alt={selectedImage?.alt ?? product.name} mask="arched" class="h-[26rem] sm:h-[32rem] lg:h-[38rem]" />
			{#if galleryImages.length > 1}
				<div class="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
					{#each galleryImages as image, index}
						<button
							type="button"
							class={`relative h-20 overflow-hidden rounded-[0.38rem] border bg-[#FFFFFF73] ${index === selectedImageIndex ? 'border-[#222D22]' : 'border-[#222D2224]'}`}
							aria-label={textFor(pageContent, 'gallery.thumbnailAria').replace('{index}', String(index + 1)).replace('{product}', product.name)}
							aria-current={index === selectedImageIndex ? 'true' : undefined}
							onclick={() => {
								selectedImageIndex = index;
							}}
						>
							<img src={image.url} alt={image.alt ?? product.name} class="absolute inset-0 h-full w-full object-cover" loading="lazy" />
						</button>
					{/each}
				</div>
			{/if}
			<p class="product-detail-description max-w-3xl text-sm leading-relaxed text-[#222D22BD]">{product.description}</p>
		</article>

		<aside class="grid-span-copy grid-rail-left product-detail-sidebar">
			<p class="section-kicker text-[#222D22B8]">{textFor(pageContent, 'summary.kicker')}</p>
			<div class="mt-5 space-y-3 border-y border-[#222D221F] py-5">
				<div class="flex items-center justify-between text-sm text-[#222D22B8]">
					<span>{textFor(pageContent, 'summary.price')}</span>
					<span class="text-base font-semibold text-[#222D22]">
						{formatCurrency(product.price, product.currency)}
					</span>
				</div>
				<div class="flex items-center justify-between text-sm text-[#222D22B8]">
					<span>{textFor(pageContent, 'summary.stock')}</span>
					<span>{product.stock}</span>
				</div>
			</div>

			<div class="mt-7 flex flex-row flex-wrap items-center justify-start gap-3">
				{#if ONLINE_STORE_ENABLED}
					<button type="button" class="btn-lime w-full justify-center sm:w-auto" onclick={addToCart}>
						<Icon name="shopping-bag-3-line" />
						{textFor(pageContent, 'action.addToCart')}
					</button>
					<a href="/checkout" class="btn-outline w-full justify-center sm:w-auto">
						{textFor(pageContent, 'action.goToCart')}
					</a>
				{:else}
					<button type="button" class="btn-outline w-full justify-center sm:w-auto" onclick={addToCart}>
						<Icon name="shopping-bag-3-line" />
						{textFor(pageContent, 'action.storeComingSoon')}
					</button>
				{/if}
				<a href="/tienda" class="btn-dark w-full justify-center sm:w-auto">{textFor(pageContent, 'action.backToShop')}</a>
			</div>

			{#if cartFeedback}
				<p class="mt-4 text-sm text-[#9B4B4B]">{cartFeedback}</p>
			{/if}
		</aside>
	</div>
</section>

{#if relatedProducts.length > 0}
	<section class="section-integrated mt-14 reveal reveal-delay-2">
		<DataHealthNotice health={relatedProductsHealth} class="mb-6" />
		<SectionHeader
			kicker={textFor(pageContent, 'related.kicker')}
			label={textFor(pageContent, 'related.label')}
			class="swiss-grid items-end gap-y-6 mb-8"
		/>
		<div class="swiss-grid editorial-mosaic gap-y-12">
			{#each relatedProducts as relatedProduct, index}
				<ProductCard product={relatedProduct} mode="catalog" copy={productCardCopy} class={getRelatedProductSpan(index)} delayMs={index * 30} />
			{/each}
		</div>
	</section>
{/if}
