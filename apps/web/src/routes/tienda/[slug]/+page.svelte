<script lang="ts">
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import DataHealthNotice from '$lib/components/ui/DataHealthNotice.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import ProductImage from '$lib/components/ui/ProductImage.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import { addItemToCart } from '$lib/state/cart';
	import { showCartNotice } from '$lib/state/cart-notice';
	import { getRelatedProductSpan } from '$lib/utils/product-grid';
	import { formatCurrency } from '$lib/utils/currency';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';

	let { data } = $props() as { data: PageData };

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
		}, 2000);
	};

	onDestroy(() => {
		if (feedbackTimer) {
			clearTimeout(feedbackTimer);
		}
	});

	const addToCart = () => {
		const result = addItemToCart({
			slug: data.product.slug,
			name: data.product.name,
			imageUrl: data.product.imageUrl,
			price: data.product.price,
			currency: data.product.currency,
			stock: data.product.stock,
			quantity: 1
		});

		if (result.ok) {
			showCartNotice(data.product.name, 1);
			return;
		}

		setFeedback(result.error);
	};
</script>

<SectionIntro
	kicker="Producto"
	title={data.product.name}
	description="Composición editorial de producto con imagen protagonista y compra directa mediante Stripe Checkout."
	class="section-intro mb-12 reveal"
/>

<section class="section-integrated reveal reveal-delay">
	<div class="swiss-grid items-start gap-y-10">
		<article class="grid-span-image">
			<ProductImage
				src={data.product.imageUrl}
				alt={data.product.name}
				mask="arched"
				class="h-[26rem] sm:h-[32rem] lg:h-[38rem]"
			/>
			<p class="mt-7 max-w-3xl text-sm leading-relaxed text-white/74">{data.product.description}</p>
		</article>

		<aside class="grid-span-copy grid-rail-left">
			<p class="section-kicker text-white/72">Resumen</p>
			<div class="mt-5 space-y-3 border-y border-white/12 py-5">
				<div class="flex items-center justify-between text-sm text-white/72">
					<span>Precio</span>
					<span class="text-base font-semibold text-white">
						{formatCurrency(data.product.price, data.product.currency)}
					</span>
				</div>
				<div class="flex items-center justify-between text-sm text-white/72">
					<span>Stock</span>
					<span>{data.product.stock}</span>
				</div>
			</div>

			<button type="button" class="btn-lime mt-7 w-full sm:w-auto" onclick={addToCart}>
				<Icon name="shopping-bag-3-line" />
				Añadir al carrito
			</button>
			<a href="/checkout" class="btn-outline mt-3 w-full justify-center sm:w-auto">
				Ir al carrito
			</a>
			<a href="/tienda" class="btn-dark mt-3 w-full justify-center sm:w-auto">Volver a tienda</a>

			{#if cartFeedback}
				<p class="mt-4 text-sm text-red-200">{cartFeedback}</p>
			{/if}
		</aside>
	</div>
</section>

{#if data.relatedProducts.length > 0}
	<section class="section-integrated mt-14 reveal reveal-delay-2">
		<DataHealthNotice health={data.dataHealth.relatedProducts} class="mb-6" />
		<SectionHeader kicker="Relacionados" label="Más productos" class="swiss-grid items-end gap-y-6 mb-8" />
		<div class="swiss-grid editorial-mosaic gap-y-12">
			{#each data.relatedProducts as product, index}
				<ProductCard product={product} mode="catalog" class={getRelatedProductSpan(index)} delayMs={index * 30} />
			{/each}
		</div>
	</section>
{/if}
