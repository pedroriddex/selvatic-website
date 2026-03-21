<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { setupHeroScroll } from '$lib/client/hero-scroll';
	import { primaryNavigation } from '$lib/config/navigation';
	import { ONLINE_STORE_ENABLED, STORE_LOCK_TITLE } from '$lib/config/store';
	import ProductLightbox from '$lib/components/ui/ProductLightbox.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { cartStore, clearCart, hydrateCart } from '$lib/state/cart';
	import { cartNoticeStore, showNotice } from '$lib/state/cart-notice';
	import type { CartNoticeState } from '$lib/state/cart-notice';
	import type { CartSnapshot } from '$lib/types';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	let { children } = $props() as { children: Snippet };
	let mobileMenuOpen = $state(false);
	let cart = $state<CartSnapshot>({
		items: [],
		count: 0,
		subtotal: 0,
		shipping: 0,
		total: 0,
		currency: null
	});
	let cartNotice = $state<CartNoticeState>({
		visible: false,
		message: ''
	});

	const year = new Date().getFullYear();
	const closeMobileMenu = () => {
		mobileMenuOpen = false;
	};
	const showStoreLockMessage = () => {
		showNotice(STORE_LOCK_TITLE, 2400);
	};

	$effect(() => {
		const unsubscribe = cartStore.subscribe((value) => {
			cart = value;
		});

		return () => {
			unsubscribe();
		};
	});

	$effect(() => {
		const unsubscribe = cartNoticeStore.subscribe((value) => {
			cartNotice = value;
		});

		return () => {
			unsubscribe();
		};
	});

	$effect(() => {
		if (typeof document === 'undefined') {
			return;
		}

		document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';

		return () => {
			document.body.style.overflow = '';
		};
	});

	onMount(() => {
		if (ONLINE_STORE_ENABLED) {
			hydrateCart();
		} else {
			clearCart();
		}

		const root = document.documentElement;
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const isHomeRoute = (): boolean => window.location.pathname === '/';
		const heroScroll = setupHeroScroll({
			root,
			getIsHomeRoute: isHomeRoute,
			prefersReducedMotion
		});

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				closeMobileMenu();
			}
		};
		window.addEventListener('keydown', onKeyDown);

		afterNavigate(() => {
			heroScroll.refresh();
			closeMobileMenu();
		});

		return () => {
			window.removeEventListener('keydown', onKeyDown);
			heroScroll.destroy();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Selvatic · Floristería</title>
	<meta
		name="description"
		content="Diseño floral natural con flor seca, preservada y planta natural. Ramos a medida, cerámica decorativa y propuestas personalizadas."
	/>
</svelte:head>

<div class="min-h-screen">
	<header class="site-header">
		<div class="swiss-shell">
			<div class="site-frame frame-gutter relative flex flex-wrap items-center justify-between gap-4 py-3">
				<a href="/" class="header-brand-link">
					<span class="header-brand-title">SELVATIC</span>
				</a>

				<nav class="header-nav">
					{#each primaryNavigation as link}
						<a href={link.href} class="header-link">
							{link.label}
						</a>
					{/each}
					<div class="header-cart-slot">
						{#if ONLINE_STORE_ENABLED}
							<a href="/checkout" class="header-cart" aria-label={`Carrito con ${cart.count} productos`}>
								<Icon name="shopping-bag-3-line" class="text-base" />
								{#if cart.count > 0}
									<span class="header-cart-badge">{cart.count > 99 ? '99+' : cart.count}</span>
								{/if}
							</a>
						{:else}
							<button
								type="button"
								class="header-cart"
								aria-label={STORE_LOCK_TITLE}
								onclick={showStoreLockMessage}
							>
								<Icon name="shopping-bag-3-line" class="text-base" />
							</button>
						{/if}
						{#if cartNotice.visible}
							<p
								class="header-cart-notice"
								aria-live="polite"
								aria-atomic="true"
								in:fly={{ y: -4, duration: 140, easing: cubicOut }}
								out:fade={{ duration: 120 }}
							>
								{cartNotice.message}
							</p>
						{/if}
					</div>
					<a href="/contacto" class="header-cta">Encargar ramo</a>
				</nav>
				<button
					type="button"
					class="mobile-menu-trigger"
					aria-expanded={mobileMenuOpen}
					aria-controls="mobile-nav-popup"
					aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				>
					<Icon name={mobileMenuOpen ? 'close-line' : 'menu-line'} class="text-lg" />
				</button>
				{#if cartNotice.visible}
					<p
						class="header-cart-notice-mobile"
						aria-live="polite"
						aria-atomic="true"
						in:fly={{ y: -4, duration: 140, easing: cubicOut }}
						out:fade={{ duration: 120 }}
					>
						{cartNotice.message}
					</p>
				{/if}
			</div>
		</div>
	</header>

	{#if mobileMenuOpen}
		<div class="mobile-menu-layer" transition:fade={{ duration: 140 }}>
			<nav id="mobile-nav-popup" class="mobile-menu-popup" transition:fly={{ y: -12, duration: 180, easing: cubicOut }}>
				<button
					type="button"
					class="mobile-menu-close"
					aria-label="Cerrar menú"
					onclick={closeMobileMenu}
				>
					<Icon name="close-line" class="text-xl" />
				</button>
				<p class="mobile-menu-title">Selvatic</p>
				<div class="mobile-menu-links">
					{#each primaryNavigation as link}
						<a href={link.href} class="mobile-menu-link" onclick={closeMobileMenu}>
							<span>{link.label}</span>
							<Icon name="arrow-right-up-line" class="text-base" />
						</a>
					{/each}
				</div>
				<div class="mobile-menu-footer">
					{#if ONLINE_STORE_ENABLED}
						<a href="/checkout" class="btn-outline mb-2 w-full justify-center" onclick={closeMobileMenu}>
							Carrito ({cart.count})
						</a>
					{:else}
						<button
							type="button"
							class="btn-outline mb-2 w-full justify-center"
							onclick={() => {
								closeMobileMenu();
								showStoreLockMessage();
							}}
						>
							Tienda online próximamente
						</button>
					{/if}
					<a href="/contacto" class="btn-lime w-full justify-center" onclick={closeMobileMenu}>
						Encargar ramo
					</a>
				</div>
			</nav>
		</div>
	{/if}

	<main class="swiss-shell">
		<div class="site-frame frame-gutter pb-24 pt-12 lg:pt-14">
			{@render children()}
		</div>
	</main>

	<footer class="border-t border-white/10">
		<div class="swiss-shell">
			<div class="site-frame frame-gutter grid gap-8 py-12 lg:grid-cols-2 lg:py-14">
				<div>
					<p class="section-kicker">Selvatic</p>
					<p class="mt-3 max-w-md text-sm leading-relaxed text-white/72">
						Proyecto de diseño floral natural con raíces familiares, hecho con tiempo, conocimiento y sensibilidad.
					</p>
				</div>
				<div class="flex flex-wrap items-end justify-start gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/66 lg:justify-end">
					<a href="/tienda" class="hover:text-white">Tienda</a>
					<a href="/sobre-nosotros" class="hover:text-white">Sobre nosotros</a>
					<a href="/servicios" class="hover:text-white">Servicios</a>
					<a href="/contacto" class="hover:text-white">Contacto</a>
					<span class="text-white/44">© {year}</span>
				</div>
			</div>
		</div>
	</footer>

	<ProductLightbox />
</div>
