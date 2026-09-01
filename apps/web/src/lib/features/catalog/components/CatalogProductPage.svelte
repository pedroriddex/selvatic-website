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
	import { previewUnitPrice } from '$lib/domain/cart/variants';
	import { openProductLightbox } from '$lib/state/product-lightbox';
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
	// Imagen propia de la opción elegida: al seleccionar una variación con foto,
	// esta sustituye a la imagen mostrada hasta que se toque otra miniatura.
	let variantImage = $state<{ url: string; alt: string } | null>(null);
	const galleryImages = $derived(
		product.gallery.length > 0
			? product.gallery
			: product.imageUrl
				? [{ url: product.imageUrl, alt: product.name, isPrimary: true }]
				: []
	);
	const selectedImage = $derived(galleryImages[selectedImageIndex] ?? galleryImages[0]);
	const displayedImageUrl = $derived(variantImage?.url ?? selectedImage?.url ?? product.imageUrl);
	const displayedImageAlt = $derived(variantImage?.alt ?? selectedImage?.alt ?? product.name);

	// Variaciones: grupo -> opción elegida.
	let selectedOptions = $state<Record<string, string>>({});

	const selections = $derived(
		product.variantGroups
			.map((group) => ({ groupName: group.name, optionLabel: selectedOptions[group.name] }))
			.filter(
				(selection): selection is { groupName: string; optionLabel: string } =>
					Boolean(selection.optionLabel)
			)
	);

	const effectivePrice = $derived(previewUnitPrice(product, selectedOptions));

	const missingRequiredGroups = $derived(
		product.variantGroups.filter((group) => group.required && !selectedOptions[group.name])
	);
	const canAddToCart = $derived(missingRequiredGroups.length === 0);

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
		if (!canAddToCart) {
			setFeedback(
				`Elige una opción de: ${missingRequiredGroups.map((group) => group.name).join(', ')}.`
			);
			return;
		}

		const result = addProductToCartWithFeedback(
			{ ...product, imageUrl: variantImage?.url ?? product.imageUrl },
			{ price: effectivePrice, selections }
		);

		if (!result.ok && !result.locked) {
			setFeedback(result.error);
		}
	};

	const openLightbox = () => {
		if (!displayedImageUrl) {
			return;
		}

		openProductLightbox(displayedImageUrl, displayedImageAlt);
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
			<!-- En la ficha, el click sobre la imagen abre el lightbox (en el listado
			     de tienda, en cambio, la imagen enlaza a la ficha). -->
			<button
				type="button"
				class="block w-full cursor-zoom-in text-left"
				aria-label={textFor(pageContent, 'productCard.viewImageAria').replace('{product}', product.name)}
				onclick={openLightbox}
			>
				<ProductImage src={displayedImageUrl} alt={displayedImageAlt} mask="arched" class="h-[26rem] sm:h-[32rem] lg:h-[38rem]" />
			</button>
			{#if galleryImages.length > 1}
				<div class="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
					{#each galleryImages as image, index}
						<button
							type="button"
							class={`relative h-20 overflow-hidden rounded-[0.38rem] border bg-[#FFFFFF73] ${index === selectedImageIndex && !variantImage ? 'border-[#222D22]' : 'border-[#222D2224]'}`}
							aria-label={textFor(pageContent, 'gallery.thumbnailAria').replace('{index}', String(index + 1)).replace('{product}', product.name)}
							aria-current={index === selectedImageIndex && !variantImage ? 'true' : undefined}
							onclick={() => {
								selectedImageIndex = index;
								variantImage = null;
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
						{formatCurrency(effectivePrice, product.currency)}
					</span>
				</div>
				<div class="flex items-center justify-between text-sm text-[#222D22B8]">
					<span>{textFor(pageContent, 'summary.stock')}</span>
					<span>{product.stock}</span>
				</div>
			</div>

			{#if product.variantGroups.length > 0}
				<div class="mt-6 space-y-5">
					{#each product.variantGroups as group}
						<fieldset>
							<legend class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#222D22C7]">
								{group.name}{#if group.required}<span class="text-[#9B4B4B]"> *</span>{/if}
							</legend>
							<div class="mt-3 flex flex-wrap gap-2">
								{#each group.options as option}
									<label
										class={`cursor-pointer rounded-[0.36rem] border px-3 py-2 text-sm transition ${
											selectedOptions[group.name] === option.label
												? 'border-[#222D22] bg-[#222D220D] text-[#222D22]'
												: 'border-[#222D2224] text-[#222D22B8] hover:border-[#222D2266]'
										}`}
									>
										<input
											type="radio"
											name={`variant-${group.name}`}
											value={option.label}
											class="sr-only"
											checked={selectedOptions[group.name] === option.label}
											onchange={() => {
												selectedOptions = { ...selectedOptions, [group.name]: option.label };
												if (option.imageUrl) {
													variantImage = { url: option.imageUrl, alt: `${product.name} — ${option.label}` };
												}
											}}
										/>
										{option.label}{#if group.pricingMode === 'set'}
											<span class="text-[#222D228F]"> {formatCurrency(option.priceModifier, product.currency)}</span>
										{:else if option.priceModifier > 0}
											<span class="text-[#222D228F]"> +{formatCurrency(option.priceModifier, product.currency)}</span>
										{/if}
									</label>
								{/each}
							</div>
						</fieldset>
					{/each}
				</div>
			{/if}

			<div class="mt-7 flex flex-row flex-wrap items-center justify-start gap-3">
				{#if ONLINE_STORE_ENABLED}
					<button
						type="button"
						class="btn-lime w-full justify-center sm:w-auto"
						onclick={addToCart}
						disabled={!canAddToCart}
						aria-disabled={!canAddToCart}
					>
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
