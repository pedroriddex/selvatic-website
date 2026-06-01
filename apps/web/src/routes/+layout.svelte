<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { setupHeroScroll } from '$lib/features/shell/client/hero-scroll';
	import { setupSmoothScroll } from '$lib/features/shell/client/smooth-scroll';
	import MobileMenu from '$lib/features/shell/components/MobileMenu.svelte';
	import SiteFooter from '$lib/features/shell/components/SiteFooter.svelte';
	import SiteHeader from '$lib/features/shell/components/SiteHeader.svelte';
	import MaintenanceAdminBypass from '$lib/components/site/MaintenanceAdminBypass.svelte';
	import MaintenanceShell from '$lib/components/site/MaintenanceShell.svelte';
	import { ONLINE_STORE_ENABLED, STORE_LOCK_TITLE } from '$lib/config/store';
	import ProductLightbox from '$lib/components/ui/ProductLightbox.svelte';
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
	import type { LayoutData } from './$types';

	let { children, data } = $props() as { children: Snippet; data: LayoutData };
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
	let smoothScroll: ReturnType<typeof setupSmoothScroll> | null = null;

	const year = new Date().getFullYear();
	const closeMobileMenu = () => {
		mobileMenuOpen = false;
	};
	const maintenanceEnabled = $derived(data.maintenance.active);
	const maintenanceBypassed = $derived(data.maintenance.bypassed);
	const maintenanceScreenActive = $derived(data.maintenance.active && data.maintenance.isMaintenanceRoute);
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
		if (smoothScroll) {
			if (mobileMenuOpen) {
				smoothScroll.stop();
			} else {
				smoothScroll.start();
			}
		}

		return () => {
			document.body.style.overflow = '';
		};
	});

	onMount(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		smoothScroll = setupSmoothScroll({ prefersReducedMotion });

		if (mobileMenuOpen) {
			smoothScroll.stop();
		}

		if (maintenanceScreenActive || !ONLINE_STORE_ENABLED) {
			clearCart();
		} else {
			hydrateCart();
		}

		if (maintenanceScreenActive) {
			return () => {
				smoothScroll?.destroy();
				smoothScroll = null;
			};
		}

		const root = document.documentElement;

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
			window.requestAnimationFrame(() => {
				smoothScroll?.resize();
			});
			heroScroll.refresh();
			closeMobileMenu();
		});

		return () => {
			window.removeEventListener('keydown', onKeyDown);
			heroScroll.destroy();
			smoothScroll?.destroy();
			smoothScroll = null;
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{@html `<style id="selvatic-design-vars">${data.design.css}</style>`}
	<title>{maintenanceScreenActive ? (data.content.maintenance.seoTitle ?? 'Selvatic · Mantenimiento') : (data.content.global.seoTitle ?? 'Selvatic · Floristería')}</title>
	<meta
		name="description"
		content={maintenanceScreenActive
			? data.maintenance.message
			: (data.content.global.seoDescription ?? 'Diseño floral natural con flor seca, preservada y planta natural. Ramos a medida, cerámica decorativa y propuestas personalizadas.')}
	/>
</svelte:head>

{#if maintenanceScreenActive}
	<MaintenanceShell
		title={data.maintenance.title}
		message={data.maintenance.message}
		studioUrl={data.maintenance.studioUrl}
		returnTo={data.maintenance.returnTo}
		content={data.content.maintenance}
	/>
{:else}
	<div class="min-h-screen">
		{#if maintenanceEnabled && maintenanceBypassed}
			<MaintenanceAdminBypass
				mode="verify"
				studioUrl={data.maintenance.studioUrl}
				returnTo={data.maintenance.returnTo}
			/>
		{/if}
		<SiteHeader
			{cart}
			{cartNotice}
			{mobileMenuOpen}
			content={data.content.global}
			onShowStoreLockMessage={showStoreLockMessage}
			onToggleMobileMenu={() => (mobileMenuOpen = !mobileMenuOpen)}
		/>

		{#if mobileMenuOpen}
			<MobileMenu {cart} content={data.content.global} onClose={closeMobileMenu} onShowStoreLockMessage={showStoreLockMessage} />
		{/if}

		<main class="swiss-shell">
			<div class="site-frame frame-gutter pb-24 pt-12 lg:pt-14">
				{@render children()}
			</div>
		</main>

		<SiteFooter {year} content={data.content.global} />

		<ProductLightbox />
	</div>
{/if}
