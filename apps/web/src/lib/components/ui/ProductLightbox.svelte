<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { closeProductLightbox, productLightbox, type ProductLightboxState } from '$lib/state/product-lightbox';
	import { cubicOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';

	let lightboxState = $state<ProductLightboxState>({
		open: false,
		src: '',
		alt: ''
	});

	let touchY = 0;
	let touchActive = false;

	$effect(() => {
		const unsubscribe = productLightbox.subscribe((value) => {
			lightboxState = value;
		});

		return () => {
			unsubscribe();
		};
	});

	afterNavigate(() => {
		closeProductLightbox();
	});

	const handleKeydown = (event: KeyboardEvent) => {
		if (lightboxState.open && event.key === 'Escape') {
			closeProductLightbox();
		}
	};

	const scrollViewport = (deltaY: number, deltaX = 0) => {
		window.scrollBy({
			top: deltaY,
			left: deltaX,
			behavior: 'auto'
		});
	};

	const forwardWheel = (event: WheelEvent) => {
		if (!lightboxState.open) {
			return;
		}

		event.preventDefault();
		scrollViewport(event.deltaY, event.deltaX);
	};

	const handleTouchStart = (event: TouchEvent) => {
		touchY = event.touches[0]?.clientY ?? 0;
		touchActive = true;
	};

	const handleTouchMove = (event: TouchEvent) => {
		if (!lightboxState.open || !touchActive) {
			return;
		}

		const currentY = event.touches[0]?.clientY ?? touchY;
		const deltaY = touchY - currentY;

		if (Math.abs(deltaY) > 1) {
			event.preventDefault();
			scrollViewport(deltaY);
			touchY = currentY;
		}
	};

	const handleTouchEnd = () => {
		touchActive = false;
	};
</script>

<svelte:window onkeydown={handleKeydown} />

{#if lightboxState.open}
	<div
		class="product-lightbox"
		role="dialog"
		tabindex="-1"
		aria-label={`Imagen ampliada de ${lightboxState.alt}`}
		onwheel={forwardWheel}
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
		ontouchcancel={handleTouchEnd}
	>
		<button
			type="button"
			class="product-lightbox-backdrop"
			aria-label="Cerrar imagen"
			onclick={closeProductLightbox}
			transition:fade={{ duration: 180 }}
		></button>
		<div class="product-lightbox-panel" transition:scale={{ duration: 220, start: 0.96, easing: cubicOut }}>
			<button type="button" class="product-lightbox-close" aria-label="Cerrar imagen" onclick={closeProductLightbox}>
				<Icon name="close-line" class="text-xl" />
			</button>
			<img src={lightboxState.src} alt={lightboxState.alt} class="product-lightbox-image" loading="eager" />
		</div>
	</div>
{/if}
