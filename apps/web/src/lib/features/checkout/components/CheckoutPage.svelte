<script lang="ts">
	import ProductImage from '$lib/components/ui/ProductImage.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import MediaPlaceholder from '$lib/components/ui/MediaPlaceholder.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import StoreStatusNotice from '$lib/components/ui/StoreStatusNotice.svelte';
	import { SITE_MEDIA } from '$lib/config/site-media';
	import { ONLINE_STORE_ENABLED, STORE_LOCK_DESCRIPTION, STORE_LOCK_TITLE } from '$lib/config/store';
	import { getDefaultPageContent, textFor } from '$lib/features/content/model/page-content';
	import {
		CART_SHIPPING_AMOUNT,
		cartStore,
		clearCart,
		hydrateCart,
		removeItemFromCart,
		setCartItemQuantity
	} from '$lib/state/cart';
	import { formatCurrency } from '$lib/utils/currency';
	import type { CartItem, CartSnapshot, PageContent } from '$lib/types';
	import { onMount } from 'svelte';

	type CheckoutStatus = 'success' | 'cancel' | null | string;
	type CheckoutFormState = {
		error?: string;
	};

	type Props = {
		status: CheckoutStatus;
		pageContent?: PageContent;
		form?: CheckoutFormState;
	};

	let { status, pageContent = getDefaultPageContent('checkout'), form }: Props = $props();

	let cart = $state<CartSnapshot>({
		items: [],
		count: 0,
		subtotal: 0,
		shipping: 0,
		total: 0,
		currency: null
	});

	const cartPayload = $derived(
		JSON.stringify(
			cart.items.map((item) => ({
				slug: item.slug,
				quantity: item.quantity,
				selections: item.selections
			}))
		)
	);
	const hasItems = $derived(cart.items.length > 0);
	const displayCurrency = $derived(cart.currency ?? 'EUR');
	const checkoutVisual = $derived(cart.items[0]?.imageUrl ?? SITE_MEDIA.checkoutVisualImageUrl);
	const pageKicker = $derived(
		ONLINE_STORE_ENABLED ? textFor(pageContent, 'intro.kickerEnabled') : textFor(pageContent, 'intro.kickerDisabled')
	);
	const pageTitle = $derived(ONLINE_STORE_ENABLED ? textFor(pageContent, 'intro.titleEnabled') : STORE_LOCK_TITLE);
	const pageDescription = $derived(
		ONLINE_STORE_ENABLED
			? textFor(pageContent, 'intro.descriptionEnabled')
			: STORE_LOCK_DESCRIPTION
	);

	$effect(() => {
		const unsubscribe = cartStore.subscribe((value) => {
			cart = value;
		});

		return () => {
			unsubscribe();
		};
	});

	onMount(() => {
		if (!ONLINE_STORE_ENABLED) {
			clearCart();
			return;
		}

		hydrateCart();

		if (status === 'success') {
			clearCart();
		}
	});

	const decreaseQuantity = (item: CartItem) => {
		setCartItemQuantity(item.lineId, item.quantity - 1);
	};

	const increaseQuantity = (item: CartItem) => {
		setCartItemQuantity(item.lineId, item.quantity + 1);
	};
</script>

<SectionIntro kicker={pageKicker} title={pageTitle} description={pageDescription} />

{#if !ONLINE_STORE_ENABLED}
	<section class="section-integrated reveal reveal-delay">
		<div class="swiss-grid items-start gap-y-10">
			<div class="col-span-4 md:col-span-5 xl:col-span-7">
				<div class="image-panel image-panel-arched min-h-[16rem] sm:min-h-[20rem]">
					{#if checkoutVisual}
						<img src={checkoutVisual} alt="Selección floral de Selvatic" loading="lazy" />
					{:else}
						<MediaPlaceholder class="h-full w-full" />
					{/if}
				</div>
			</div>

			<div class="col-span-4 md:col-span-3 xl:col-span-5 grid-rail-left">
				<StoreStatusNotice compact />
				<p class="section-note mt-6">
					{textFor(pageContent, 'disabled.note')}
				</p>
				<div class="mt-7 flex flex-wrap gap-3">
					<a href="/contacto" class="btn-lime">{textFor(pageContent, 'disabled.contactCta')}</a>
					<a href="/tienda" class="btn-outline">{textFor(pageContent, 'disabled.shopCta')}</a>
				</div>
			</div>
		</div>
	</section>
{:else}
	{#if status === 'success'}
		<section class="section-integrated reveal">
			<div class="border border-[#222D2240] bg-[#222D220D] p-7 text-[#222D22]">
				<p class="section-kicker text-[#222D22AD]">{textFor(pageContent, 'success.kicker')}</p>
				<p class="mt-2 text-3xl leading-[0.98]">{textFor(pageContent, 'success.title')}</p>
				<p class="mt-3 max-w-2xl text-sm leading-relaxed text-[#222D22D1]">
					{textFor(pageContent, 'success.description')}
				</p>
			</div>
		</section>
	{:else}
		{#if status === 'cancel'}
			<section class="section-integrated reveal">
				<div class="border border-[#222D222E] bg-[#FFFFFF8C] p-6 text-[#222D22]">
					<p class="section-kicker text-[#222D22B3]">{textFor(pageContent, 'cancel.kicker')}</p>
					<p class="mt-2 text-xl text-[#222D22]">{textFor(pageContent, 'cancel.title')}</p>
				</div>
			</section>
		{/if}

		<section class="section-integrated reveal reveal-delay">
			{#if hasItems}
				<div class="swiss-grid items-start gap-y-10">
					<div class="col-span-4 md:col-span-5 xl:col-span-7">
						<p class="section-kicker text-[#222D22B8]">{textFor(pageContent, 'cart.kicker')}</p>
						<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-[#222D22E0]">{textFor(pageContent, 'cart.label')}</h2>
						<h3 class="section-subtitle mt-3 text-2xl sm:text-3xl">{textFor(pageContent, 'cart.title')}</h3>

						<div class="mt-7 divide-y divide-[#222D221F] border-y border-[#222D221F]">
							{#each cart.items as item (item.lineId)}
								<article class="swiss-grid gap-y-4 py-6">
									<div class="col-span-4 md:col-span-3 xl:col-span-3">
										<ProductImage src={item.imageUrl} alt={item.name} mask="arched" class="h-36 w-full sm:h-40" />
									</div>
									<div class="col-span-4 md:col-span-3 xl:col-span-4">
										<h4 class="text-lg leading-[1.08] text-[#222D22] sm:text-xl">{item.name}</h4>
										{#if item.selections.length > 0}
											<ul class="mt-1 text-xs leading-relaxed text-[#222D2294]">
												{#each item.selections as selection}
													<li>{selection.groupName}: {selection.optionLabel}</li>
												{/each}
											</ul>
										{/if}
										<p class="mt-2 text-sm font-semibold text-[#222D22D6]">
											{formatCurrency(item.price, item.currency)}
										</p>
										<p class="mt-1 text-xs uppercase tracking-[0.1em] text-[#222D2294]">
											{textFor(pageContent, 'cart.stock')} {item.stock}
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
											<span class="inline-flex min-w-10 items-center justify-center text-sm font-semibold text-[#222D22]">
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
												onclick={() => removeItemFromCart(item.lineId)}
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
						<p class="section-kicker text-[#222D22B8]">{textFor(pageContent, 'summary.kicker')}</p>
						<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-[#222D22E0]">{textFor(pageContent, 'summary.label')}</h2>

						<div class="mt-5 space-y-3 border-y border-[#222D221F] py-5 text-sm text-[#222D22CC]">
							<div class="flex items-center justify-between">
								<span>{textFor(pageContent, 'summary.subtotal')}</span>
								<span>{formatCurrency(cart.subtotal, displayCurrency)}</span>
							</div>
							<div class="flex items-center justify-between">
								<span>{textFor(pageContent, 'summary.shipping')}</span>
								<span>{formatCurrency(CART_SHIPPING_AMOUNT, displayCurrency)}</span>
							</div>
							<div class="flex items-center justify-between border-t border-[#222D221F] pt-3 text-base font-semibold text-[#222D22]">
								<span>{textFor(pageContent, 'summary.total')}</span>
								<span>{formatCurrency(cart.total, displayCurrency)}</span>
							</div>
						</div>

						{#if form?.error}
							<p class="mt-4 rounded-[0.36rem] border border-[#B7636366] bg-[#B7636314] px-3 py-2 text-sm text-[#7F3838]">{form.error}</p>
						{/if}

						<button type="submit" class="btn-lime mt-7 w-full sm:w-auto" disabled={!hasItems}>
							<Icon name="bank-card-line" />
							{textFor(pageContent, 'summary.submit')}
						</button>
						<p class="mt-3 max-w-sm text-xs leading-relaxed text-[#222D229E]">
							{textFor(pageContent, 'summary.secureNote')}
						</p>
					</form>
				</div>
			{:else}
				<div class="border border-[#222D2224] bg-[#FFFFFF8C] p-7">
					<p class="section-kicker text-[#222D22AD]">{textFor(pageContent, 'empty.kicker')}</p>
					<p class="mt-3 text-xl text-[#222D22]">{textFor(pageContent, 'empty.title')}</p>
					<a href="/tienda" class="btn-outline mt-5">{textFor(pageContent, 'empty.cta')}</a>
				</div>
			{/if}
		</section>
	{/if}
{/if}
