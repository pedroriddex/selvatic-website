<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { primaryNavigation, type NavigationLink } from '$lib/config/navigation';
	import { ONLINE_STORE_ENABLED } from '$lib/config/store';
	import { getDefaultPageContent, textFor } from '$lib/features/content/model/page-content';
	import type { CartSnapshot, PageContent } from '$lib/types';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	type Props = {
		cart: CartSnapshot;
		content?: PageContent;
		navigation?: NavigationLink[];
		onClose: () => void;
		onShowStoreLockMessage: () => void;
	};

	let {
		cart,
		content = getDefaultPageContent('global'),
		navigation = primaryNavigation,
		onClose,
		onShowStoreLockMessage
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

<div class="mobile-menu-layer" transition:fade={{ duration: 140 }}>
	<nav
		id="mobile-nav-popup"
		class="mobile-menu-popup"
		transition:fly={{ y: -12, duration: 180, easing: cubicOut }}
	>
		<button type="button" class="mobile-menu-close" aria-label="Cerrar menú" onclick={onClose}>
			<Icon name="close-line" class="text-xl" />
		</button>
		<p class="mobile-menu-title">{textFor(content, 'brand.name')}</p>
		<div class="mobile-menu-links">
			{#each navigation as link}
				<a href={link.href} class="mobile-menu-link" onclick={onClose}>
					<span>{textFor(content, linkLabelKey(link.href)) || link.label}</span>
					<Icon name="arrow-right-up-line" class="text-base" />
				</a>
			{/each}
		</div>
		<div class="mobile-menu-footer">
			{#if ONLINE_STORE_ENABLED}
				<a href="/checkout" class="btn-outline mb-2 w-full justify-center" onclick={onClose}>
					{textFor(content, 'cart.label')} ({cart.count})
				</a>
			{:else}
				<button
					type="button"
					class="btn-outline mb-2 w-full justify-center"
					onclick={() => {
						onClose();
						onShowStoreLockMessage();
					}}
				>
					{textFor(content, 'cart.comingSoon')}
				</button>
			{/if}
			<a href="/contacto" class="btn-lime w-full justify-center" onclick={onClose}>
				{textFor(content, 'cta.orderBouquet')}
			</a>
		</div>
	</nav>
</div>
