type HeroScrollOptions = {
	root: HTMLElement;
	getIsHomeRoute: () => boolean;
	prefersReducedMotion: boolean;
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const targetProgress = (): number => clamp((window.scrollY - 12) / 420, 0, 1);

export const setupHeroScroll = ({ root, getIsHomeRoute, prefersReducedMotion }: HeroScrollOptions) => {
	let frameId = 0;
	let progress = 0;

	const render = () => {
		const target = targetProgress();
		progress = prefersReducedMotion ? target : progress + (target - progress) * 0.2;

		if (Math.abs(target - progress) < 0.001) {
			progress = target;
		}

		root.style.setProperty('--hero-scroll-progress', progress.toFixed(4));
		root.dataset.heroRoute = getIsHomeRoute() ? 'home' : 'other';

		const keepAnimating = progress > 0.001 || Math.abs(target - progress) > 0.001;
		frameId = keepAnimating ? window.requestAnimationFrame(render) : 0;
	};

	const start = () => {
		if (!frameId) {
			frameId = window.requestAnimationFrame(render);
		}
	};

	const onScroll = () => start();
	const onResize = () => start();

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onResize);
	start();

	return {
		refresh: start,
		destroy: () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			if (frameId) {
				window.cancelAnimationFrame(frameId);
			}
			root.style.setProperty('--hero-scroll-progress', '0');
			root.dataset.heroRoute = 'other';
		}
	};
};
