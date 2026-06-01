<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { primaryNavigation, type NavigationLink } from '$lib/config/navigation';
	import { ONLINE_STORE_ENABLED, STORE_LOCK_TITLE } from '$lib/config/store';
	import { getDefaultPageContent, textFor } from '$lib/features/content/model/page-content';
	import type { CartNoticeState } from '$lib/state/cart-notice';
	import type { CartSnapshot, PageContent } from '$lib/types';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	type Props = {
		cart: CartSnapshot;
		cartNotice: CartNoticeState;
		mobileMenuOpen: boolean;
		content?: PageContent;
		navigation?: NavigationLink[];
		onShowStoreLockMessage: () => void;
		onToggleMobileMenu: () => void;
	};

	let {
		cart,
		cartNotice,
		mobileMenuOpen,
		content = getDefaultPageContent('global'),
		navigation = primaryNavigation,
		onShowStoreLockMessage,
		onToggleMobileMenu
	}: Props = $props();

	const linkLabelKey = (href: string) =>
		href === '/'
			? 'nav.home'
			: href === '/tienda'
				? 'nav.shop'
				: href === '/sobre-nosotros'
					? 'nav.about'
					: href === '/servicios'
						? 'nav.services'
						: href === '/contacto'
							? 'nav.contact'
							: '';
</script>

<header class="site-header">
	<div class="swiss-shell">
		<div class="site-frame frame-gutter relative flex flex-wrap items-center justify-between gap-4 py-3">
			<a href="/" class="header-brand-link">
				<span class="header-brand-title">{textFor(content, 'brand.name')}</span>
			</a>

			<nav class="header-nav">
				{#each navigation as link}
					<a href={link.href} class="header-link">
						{textFor(content, linkLabelKey(link.href)) || link.label}
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
							onclick={onShowStoreLockMessage}
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
				<a href="/contacto" class="header-cta">{textFor(content, 'cta.orderBouquet')}</a>
			</nav>
			<button
				type="button"
				class="mobile-menu-trigger"
				aria-expanded={mobileMenuOpen}
				aria-controls="mobile-nav-popup"
				aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
				onclick={onToggleMobileMenu}
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
