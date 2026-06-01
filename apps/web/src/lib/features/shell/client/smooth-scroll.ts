import Lenis from 'lenis';

type SmoothScrollOptions = {
	prefersReducedMotion: boolean;
};

type SmoothScrollController = {
	start: () => void;
	stop: () => void;
	resize: () => void;
	destroy: () => void;
};

const noop = (): void => {};

const createNoopController = (): SmoothScrollController => ({
	start: noop,
	stop: noop,
	resize: noop,
	destroy: noop
});

export const setupSmoothScroll = ({
	prefersReducedMotion
}: SmoothScrollOptions): SmoothScrollController => {
	if (prefersReducedMotion) {
		return createNoopController();
	}

	const lenis = new Lenis({
		autoRaf: true,
		smoothWheel: true,
		anchors: true,
		stopInertiaOnNavigate: true,
		lerp: 0.085
	});

	return {
		start: () => {
			lenis.start();
		},
		stop: () => {
			lenis.stop();
		},
		resize: () => {
			lenis.resize();
		},
		destroy: () => {
			lenis.destroy();
		}
	};
};
