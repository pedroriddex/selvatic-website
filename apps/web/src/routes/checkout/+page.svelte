<script lang="ts">
	import ProductImage from '$lib/components/ui/ProductImage.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import MediaPlaceholder from '$lib/components/ui/MediaPlaceholder.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import { SITE_MEDIA } from '$lib/config/site-media';
	import { CART_SHIPPING_AMOUNT, cartStore, clearCart, hydrateCart, removeItemFromCart, setCartItemQuantity } from '$lib/state/cart';
	import type { CartItem, CartSnapshot } from '$lib/types';
	import { formatCurrency } from '$lib/utils/currency';
	import { onMount } from 'svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props() as { data: PageData; form: ActionData };

	let cart = $state<CartSnapshot>({
		items: [],
		count: 0,
		subtotal: 0,
		shipping: 0,
		total: 0,
		currency: null
	});

	const cartPayload = $derived(
		JSON.stringify(cart.items.map((item) => ({ slug: item.slug, quantity: item.quantity })))
	);
	const hasItems = $derived(cart.items.length > 0);
	const displayCurrency = $derived(cart.currency ?? 'EUR');
	const checkoutVisual = $derived(cart.items[0]?.imageUrl ?? SITE_MEDIA.checkoutVisualImageUrl);

	$effect(() => {
		const unsubscribe = cartStore.subscribe((value) => {
			cart = value;
		});

		return () => {
			unsubscribe();
		};
	});

	onMount(() => {
		hydrateCart();

		if (data.status === 'success') {
			clearCart();
		}
	});

	const decreaseQuantity = (item: CartItem) => {
		setCartItemQuantity(item.slug, item.quantity - 1);
	};

	const increaseQuantity = (item: CartItem) => {
		setCartItemQuantity(item.slug, item.quantity + 1);
	};
</script>

<SectionIntro
	kicker="Checkout"
	title="Carrito de compra"
	description="Revisa tus productos y finaliza el pago con Stripe Checkout."
/>

{#if data.status === 'success'}
	<section class="section-integrated reveal">
		<div class="border border-lime-300/38 bg-lime-300/10 p-7 text-white">
			<p class="section-kicker text-lime-200">Pago confirmado</p>
			<p class="mt-2 text-3xl leading-[0.98]">Pago completado correctamente.</p>
			<p class="mt-3 max-w-2xl text-sm leading-relaxed text-white/82">
				Hemos recibido tu pedido y comenzaremos su preparación. Si necesitamos más datos, te escribiremos por email.
			</p>
		</div>
	</section>
{:else}
	{#if data.status === 'cancel'}
		<section class="section-integrated reveal">
			<div class="border border-white/18 bg-white/6 p-6 text-white">
				<p class="section-kicker text-white/70">Pago cancelado</p>
				<p class="mt-2 text-xl text-white">No se realizó ningún cobro. Tu carrito sigue disponible.</p>
			</div>
		</section>
	{/if}

	<section class="section-integrated reveal reveal-delay">
		{#if hasItems}
			<div class="swiss-grid items-start gap-y-10">
				<div class="col-span-4 md:col-span-5 xl:col-span-7">
					<div class="image-panel image-panel-arched min-h-[14rem] sm:min-h-[17rem]">
						{#if checkoutVisual}
							<img src={checkoutVisual} alt="Vista editorial del carrito" loading="lazy" />
						{:else}
							<MediaPlaceholder class="h-full w-full" />
						{/if}
					</div>
					<div class="mt-8">
						<p class="section-kicker text-white/72">Productos</p>
						<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-white/88">Carrito</h2>
						<h3 class="section-subtitle mt-3 text-2xl sm:text-3xl">Revisión antes de pagar</h3>
					</div>

					<div class="mt-7 divide-y divide-white/12 border-y border-white/12">
						{#each cart.items as item (item.slug)}
							<article class="swiss-grid gap-y-4 py-6">
								<div class="col-span-4 md:col-span-3 xl:col-span-3">
									<ProductImage src={item.imageUrl} alt={item.name} mask="arched" class="h-36 w-full sm:h-40" />
								</div>
								<div class="col-span-4 md:col-span-3 xl:col-span-4">
									<h4 class="text-lg leading-[1.08] text-white sm:text-xl">{item.name}</h4>
									<p class="mt-2 text-sm font-semibold text-white/84">
										{formatCurrency(item.price, item.currency)}
									</p>
									<p class="mt-1 text-xs uppercase tracking-[0.1em] text-white/58">
										Stock disponible: {item.stock}
									</p>
								</div>
								<div class="col-span-4 md:col-span-2 xl:col-span-5 md:justify-self-end md:text-right">
									<div class="flex flex-wrap items-center gap-2 md:justify-end">
										<button
											type="button"
											class="icon-cta"
											aria-label={`Reducir cantidad de ${item.name}`}
											onclick={() => decreaseQuantity(item)}
										>
											<Icon name="subtract-line" />
										</button>
										<span class="inline-flex min-w-10 items-center justify-center text-sm font-semibold text-white">
											{item.quantity}
										</span>
										<button
											type="button"
											class="icon-cta"
											aria-label={`Aumentar cantidad de ${item.name}`}
											onclick={() => increaseQuantity(item)}
										>
											<Icon name="add-line" />
										</button>
										<button
											type="button"
											class="icon-cta"
											aria-label={`Eliminar ${item.name} del carrito`}
											onclick={() => removeItemFromCart(item.slug)}
										>
											<Icon name="delete-bin-line" />
										</button>
									</div>
								</div>
							</article>
						{/each}
					</div>
				</div>

				<form method="POST" class="col-span-4 md:col-span-3 xl:col-span-5 grid-rail-left">
					<input type="hidden" name="items" value={cartPayload} />
					<p class="section-kicker text-white/72">Resumen</p>
					<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-white/88">Total</h2>

					<div class="mt-5 space-y-3 border-y border-white/12 py-5 text-sm text-white/80">
						<div class="flex items-center justify-between">
							<span>Subtotal</span>
							<span>{formatCurrency(cart.subtotal, displayCurrency)}</span>
						</div>
						<div class="flex items-center justify-between">
							<span>Envío fijo</span>
							<span>{formatCurrency(CART_SHIPPING_AMOUNT, displayCurrency)}</span>
						</div>
						<div class="flex items-center justify-between border-t border-white/12 pt-3 text-base font-semibold text-white">
							<span>Total</span>
							<span>{formatCurrency(cart.total, displayCurrency)}</span>
						</div>
					</div>

					{#if form?.error}
						<p class="mt-4 rounded-[0.36rem] border border-red-300/60 bg-red-500/12 px-3 py-2 text-sm text-red-100">{form.error}</p>
					{/if}

					<button type="submit" class="btn-lime mt-7 w-full sm:w-auto" disabled={!hasItems}>
						<Icon name="bank-card-line" />
						Ir a Stripe
					</button>
					<p class="mt-3 max-w-sm text-xs leading-relaxed text-white/62">
						Pago seguro en Stripe Checkout. El carrito admite una sola moneda por pedido.
					</p>
				</form>
			</div>
		{:else}
			<div class="border border-white/14 bg-white/[0.03] p-7">
				<p class="section-kicker text-white/68">Carrito vacío</p>
				<p class="mt-3 text-xl text-white">Todavía no has añadido productos.</p>
				<a href="/tienda" class="btn-outline mt-5">Ir a tienda</a>
			</div>
		{/if}
	</section>
{/if}
