<script lang="ts">
	import MaintenanceAdminBypass from '$lib/components/site/MaintenanceAdminBypass.svelte';
	import { SITE_MEDIA } from '$lib/config/site-media';
	import { getDefaultPageContent, textFor } from '$lib/features/content/model/page-content';
	import type { PageContent } from '$lib/types';

	type Props = {
		title: string;
		message: string;
		studioUrl: string;
		returnTo: string;
		content?: PageContent;
	};

	let { title, message, studioUrl, returnTo, content = getDefaultPageContent('maintenance') }: Props = $props();

	const getMaintenanceVideoUrl = () => SITE_MEDIA.heroVideoUrl;
	const getMaintenancePosterUrl = () => SITE_MEDIA.heroVideoPosterUrl;
	const getMaintenanceVideoType = () =>
		/\.webm(\?|$)/i.test(getMaintenanceVideoUrl() ?? '') ? 'video/webm' : 'video/mp4';
</script>

<div class="min-h-screen">
	<MaintenanceAdminBypass mode="claim" {studioUrl} {returnTo} />
	<main class="swiss-shell">
		<div class="site-frame frame-gutter py-8 sm:py-10">
			<section class="reveal flex min-h-[calc(100vh-4rem)] items-center">
				<article class="maintenance-stage">
					{#if getMaintenanceVideoUrl()}
						<video
							class="maintenance-stage-media"
							autoplay
							muted
							loop
							playsinline
							preload="metadata"
							poster={getMaintenancePosterUrl()}
						>
							<source src={getMaintenanceVideoUrl()} type={getMaintenanceVideoType()} />
						</video>
					{/if}

					<div class="maintenance-stage-overlay"></div>
					<div class="maintenance-stage-glow"></div>

					<div class="maintenance-stage-content">
						<a href="/" class="header-brand-link">
							<span class="header-brand-title">SELVATIC</span>
						</a>
						<div class="maintenance-stage-text">
							<p class="section-kicker text-[#222D22B8]">{textFor(content, 'kicker')}</p>
							<h1 class="maintenance-stage-title">{title}</h1>
							<p class="maintenance-stage-copy">{message}</p>
						</div>
						<p class="maintenance-stage-meta">
							{textFor(content, 'meta')}
						</p>
					</div>
				</article>
			</section>
		</div>
	</main>
</div>

<style>
	.maintenance-stage {
		position: relative;
		width: 100%;
		min-height: calc(100vh - 8rem);
		overflow: hidden;
		border: 1px solid rgba(34, 45, 34, 0.16);
		border-radius: 0.7rem;
		background: #ebf1e5;
		box-shadow: 0 24px 56px -36px rgba(34, 45, 34, 0.22);
	}

	.maintenance-stage-media {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.maintenance-stage-overlay {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(108deg, rgba(235, 241, 229, 0.9) 0%, rgba(235, 241, 229, 0.76) 45%, rgba(235, 241, 229, 0.6) 100%);
	}

	.maintenance-stage-glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 84% 14%, rgba(34, 45, 34, 0.12), transparent 36%);
	}

	.maintenance-stage-content {
		position: relative;
		z-index: 1;
		display: flex;
		min-height: calc(100vh - 8rem);
		width: 100%;
		flex-direction: column;
		justify-content: center;
		gap: clamp(1.8rem, 3vw, 2.6rem);
		padding: clamp(1.6rem, 4vw, 3.4rem);
	}

	.maintenance-stage-text {
		display: flex;
		flex-direction: column;
		gap: clamp(0.9rem, 1.8vw, 1.35rem);
		width: min(100%, 72rem);
	}

	.maintenance-stage-title {
		color: var(--text-strong);
		font-size: clamp(2.6rem, 6.5vw, 6rem);
		line-height: 0.9;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}

	.maintenance-stage-copy {
		color: rgba(34, 45, 34, 0.8);
		font-size: clamp(1rem, 1.9vw, 1.15rem);
		line-height: 1.72;
		max-width: 56rem;
	}

	.maintenance-stage-meta {
		color: rgba(34, 45, 34, 0.56);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	@media (max-width: 767px) {
		.maintenance-stage {
			min-height: calc(100vh - 6.5rem);
		}

		.maintenance-stage-content {
			min-height: calc(100vh - 6.5rem);
		}
	}
</style>
