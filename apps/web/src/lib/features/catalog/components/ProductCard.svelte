<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import ProductImage from '$lib/components/ui/ProductImage.svelte';
	import { ONLINE_STORE_ENABLED } from '$lib/config/store';
	import { addProductToCartWithFeedback } from '$lib/features/catalog/client/product-cart';
	import { getProductCardView, type ProductCardMode } from '$lib/features/catalog/model/product-card';
	import type { ProductCardCopy } from '$lib/features/catalog/model/product-card-copy';
	import { openProductLightbox } from '$lib/state/product-lightbox';
	import type { Product } from '$lib/types';
	import { formatCurrency } from '$lib/utils/currency';
	import { onDestroy } from 'svelte';

	type Props = {
		product: Product;
		mode?: ProductCardMode;
		featured?: boolean;
		delayMs?: number;
		copy?: Partial<ProductCardCopy>;
		class?: string;
	};

	let {
		product,
		mode = 'catalog',
		featured = false,
		delayMs = 0,
		copy = {},
		class: className = ''
	}: Props = $props();

	const formatProductLabel = (template: string, productName: string) =>
		template.replace('{product}', productName);

	const view = $derived(getProductCardView(mode, featured, className));
	const addButtonLabel = $derived(
		ONLINE_STORE_ENABLED ? (copy.addToCartLabel ?? 'Añadir') : (copy.comingSoonLabel ?? 'Próximamente')
	);
	const addButtonAria = $derived(
		ONLINE_STORE_ENABLED
			? formatProductLabel(copy.addToCartAria ?? 'Añadir {product} al carrito', product.name)
			: addButtonLabel
	);
	const viewImageAria = $derived(
		formatProductLabel(copy.viewImageAria ?? 'Ver imagen completa de {product}', product.name)
	);
	const viewProductAria = $derived(
		formatProductLabel(copy.viewProductAria ?? 'Ver {product}', product.name)
	);

	let cartFeedback = $state<string | null>(null);
	let feedbackTimer: ReturnType<typeof setTimeout> | undefined;

	const setFeedback = (message: string) => {
		cartFeedback = message;

		if (feedbackTimer) {
			clearTimeout(feedbackTimer);
		}

		feedbackTimer = setTimeout(() => {
			cartFeedback = null;
			feedbackTimer = undefined;
		}, 1800);
	};

	onDestroy(() => {
		if (feedbackTimer) {
			clearTimeout(feedbackTimer);
		}
	});

	const openLightbox = () => {
		if (!product.imageUrl) {
			return;
		}

		openProductLightbox(product.imageUrl, product.name);
	};

	const addToCart = () => {
		const result = addProductToCartWithFeedback(product);

		if (!result.ok && !result.locked) {
			setFeedback(result.error);
		}
	};
</script>

<article class={view.articleClass} style={`animation-delay:${delayMs}ms`}>
	<div class={view.mediaWrapClass}>
		<ProductImage
			src={product.imageUrl}
			alt={product.name}
			mask="arched"
			class={view.imageContainerClass}
			imageClass={view.imageClass}
		/>
		{#if product.imageUrl}
			<button
				type="button"
				class="product-media-button"
				aria-label={viewImageAria}
				onclick={openLightbox}
			>
				<span class="product-media-icon">
					<Icon name="eye-line" class="text-base" />
				</span>
			</button>
		{/if}
	</div>

	{#if view.isHome}
		<div class="product-home-meta">
			<h4 class={view.titleClass}>{product.name}</h4>
			<p class={`${view.descriptionClass} line-clamp-3`}>{product.description}</p>
			<div class="product-home-actions">
				<button
					type="button"
					class="btn-outline product-add-button"
					aria-label={addButtonAria}
					onclick={addToCart}
				>
					<Icon name="shopping-bag-3-line" />
					{addButtonLabel}
				</button>
				<div class="flex items-center gap-2">
					<span class={view.priceClass}>{formatCurrency(product.price, product.currency)}</span>
					<a href={`/tienda/${product.slug}`} class="icon-cta" aria-label={viewProductAria}>
						<Icon name="arrow-right-line" />
					</a>
				</div>
			</div>
			{#if cartFeedback}
				<p class="mt-2 text-xs text-[#9B4B4B]">{cartFeedback}</p>
			{/if}
		</div>
	{:else}
		<div class="product-catalog-meta">
			<h4 class={view.titleClass}>{product.name}</h4>
			<p class={`${view.descriptionClass} line-clamp-3`}>{product.description}</p>
			<div class="product-catalog-actions">
				<span class={view.priceClass}>{formatCurrency(product.price, product.currency)}</span>
				<div class="flex items-center gap-2">
					<button
						type="button"
						class="btn-outline product-add-button"
						aria-label={addButtonAria}
						onclick={addToCart}
					>
						<Icon name="shopping-bag-3-line" />
						{addButtonLabel}
					</button>
					<a href={`/tienda/${product.slug}`} class="icon-cta" aria-label={viewProductAria}>
						<Icon name="arrow-right-line" />
					</a>
				</div>
			</div>
			{#if cartFeedback}
				<p class="mt-2 text-xs text-[#9B4B4B]">{cartFeedback}</p>
			{/if}
		</div>
	{/if}
</article>
