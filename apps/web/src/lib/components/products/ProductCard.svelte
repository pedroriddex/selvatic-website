<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import ProductImage from '$lib/components/ui/ProductImage.svelte';
	import { ONLINE_STORE_ENABLED, STORE_LOCK_TITLE } from '$lib/config/store';
	import { openProductLightbox } from '$lib/state/product-lightbox';
	import { addItemToCart } from '$lib/state/cart';
	import { showCartNotice, showNotice } from '$lib/state/cart-notice';
	import type { Product } from '$lib/types';
	import { formatCurrency } from '$lib/utils/currency';
	import { onDestroy } from 'svelte';

	type ProductCardMode = 'catalog' | 'showcase' | 'home';

	type Props = {
		product: Product;
		mode?: ProductCardMode;
		featured?: boolean;
		delayMs?: number;
		class?: string;
	};

	let {
		product,
		mode = 'catalog',
		featured = false,
		delayMs = 0,
		class: className = ''
	}: Props = $props();

	const isShowcase = $derived(mode === 'showcase');
	const isHome = $derived(mode === 'home');

	const articleClass = $derived(
		isHome
			? `product-home-card group reveal ${className}`.trim()
			: `product-catalog-card ${isShowcase && featured ? 'product-catalog-card-featured' : ''} group reveal ${className}`.trim()
	);
	const mediaWrapClass = $derived('product-media-wrap arched-media-wrap');

	const imageContainerClass = $derived(
		isHome
			? 'product-home-media'
			: `product-catalog-media ${isShowcase && featured ? 'product-catalog-media-featured' : ''}`
	);

	const imageClass = $derived('transition duration-300 group-hover:scale-[1.02]');
	const titleClass = $derived(isHome ? 'product-home-title' : 'product-catalog-title');
	const descriptionClass = $derived(isHome ? 'product-home-description' : 'product-catalog-description');
	const priceClass = $derived(isHome ? 'product-home-price' : 'product-catalog-price');
	const addButtonLabel = $derived(ONLINE_STORE_ENABLED ? 'Añadir' : 'Próximamente');

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
		if (!ONLINE_STORE_ENABLED) {
			showNotice(STORE_LOCK_TITLE, 2400);
			return;
		}

		const result = addItemToCart({
			slug: product.slug,
			name: product.name,
			imageUrl: product.imageUrl,
			price: product.price,
			currency: product.currency,
			stock: product.stock,
			quantity: 1
		});

		if (result.ok) {
			showCartNotice(product.name, 1);
			return;
		}

		setFeedback(result.error);
	};
</script>

<article class={articleClass} style={`animation-delay:${delayMs}ms`}>
	<div class={mediaWrapClass}>
		<ProductImage
			src={product.imageUrl}
			alt={product.name}
			mask="arched"
			class={imageContainerClass}
			imageClass={imageClass}
		/>
		{#if product.imageUrl}
			<button type="button" class="product-media-button" aria-label={`Ver imagen completa de ${product.name}`} onclick={openLightbox}>
				<span class="product-media-icon">
					<Icon name="eye-line" class="text-base" />
				</span>
			</button>
		{/if}
	</div>

	{#if isHome}
		<div class="product-home-meta">
			<h4 class={titleClass}>{product.name}</h4>
			<p class={`${descriptionClass} line-clamp-3`}>{product.description}</p>
			<div class="product-home-actions">
				<button
					type="button"
					class="btn-outline product-add-button"
					aria-label={ONLINE_STORE_ENABLED ? `Añadir ${product.name} al carrito` : STORE_LOCK_TITLE}
					onclick={addToCart}
				>
					<Icon name="shopping-bag-3-line" />
					{addButtonLabel}
				</button>
				<div class="flex items-center gap-2">
					<span class={priceClass}>{formatCurrency(product.price, product.currency)}</span>
					<a href={`/tienda/${product.slug}`} class="icon-cta" aria-label={`Ver ${product.name}`}>
						<Icon name="arrow-right-line" />
					</a>
				</div>
			</div>
			{#if cartFeedback}
				<p class="mt-2 text-xs text-red-200">{cartFeedback}</p>
			{/if}
		</div>
	{:else}
		<div class="product-catalog-meta">
			<h4 class={titleClass}>{product.name}</h4>
			<p class={`${descriptionClass} line-clamp-3`}>{product.description}</p>
			<div class="product-catalog-actions">
				<span class={priceClass}>{formatCurrency(product.price, product.currency)}</span>
				<div class="flex items-center gap-2">
					<button
						type="button"
						class="btn-outline product-add-button"
						aria-label={ONLINE_STORE_ENABLED ? `Añadir ${product.name} al carrito` : STORE_LOCK_TITLE}
						onclick={addToCart}
					>
						<Icon name="shopping-bag-3-line" />
						{addButtonLabel}
					</button>
					<a href={`/tienda/${product.slug}`} class="icon-cta" aria-label={`Ver ${product.name}`}>
						<Icon name="arrow-right-line" />
					</a>
				</div>
			</div>
			{#if cartFeedback}
				<p class="mt-2 text-xs text-red-200">{cartFeedback}</p>
			{/if}
		</div>
	{/if}
</article>
