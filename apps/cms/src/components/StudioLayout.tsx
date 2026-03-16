import type { LayoutProps } from 'sanity';
import { createGlobalStyle } from 'styled-components';

const StudioSwissGlobalStyle = createGlobalStyle`
	@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

	:root {
		--selvatic-bg-0: #0b1410;
		--selvatic-bg-1: #101b16;
		--selvatic-bg-2: #16241d;
		--selvatic-line-soft: rgba(228, 238, 221, 0.14);
		--selvatic-line-strong: rgba(228, 238, 221, 0.26);
		--selvatic-text: #d1dacd;
		--selvatic-text-strong: #edf3e8;
		--selvatic-grid-major: rgba(228, 238, 221, 0.09);
		--selvatic-grid-minor: rgba(228, 238, 221, 0.03);
		--selvatic-accent-soft: rgba(185, 217, 138, 0.22);
		--selvatic-accent-strong: rgba(201, 232, 157, 0.72);
		--selvatic-ease: cubic-bezier(0.22, 1, 0.36, 1);
	}

	html,
	body,
	#sanity {
		font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
		color: var(--selvatic-text);
		background:
			radial-gradient(circle at 100% 0%, rgba(186, 219, 141, 0.1), transparent 38%),
			linear-gradient(180deg, var(--selvatic-bg-2) 0%, var(--selvatic-bg-1) 52%, var(--selvatic-bg-0) 100%);
	}

	#sanity {
		position: relative;
		isolation: isolate;
	}

	#sanity > * {
		position: relative;
		z-index: 1;
	}

	#sanity::before,
	#sanity::after {
		content: '';
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	#sanity::before {
		background:
			linear-gradient(to right, var(--selvatic-grid-major) 1px, transparent 1px),
			linear-gradient(to bottom, var(--selvatic-grid-major) 1px, transparent 1px),
			linear-gradient(to right, var(--selvatic-grid-minor) 1px, transparent 1px),
			linear-gradient(to bottom, var(--selvatic-grid-minor) 1px, transparent 1px);
		background-size: 128px 128px, 128px 128px, 32px 32px, 32px 32px;
		opacity: 0.5;
		animation: selvatic-grid-shift 24s linear infinite;
	}

	#sanity::after {
		background:
			radial-gradient(circle at 14% 15%, rgba(185, 217, 138, 0.14), transparent 34%),
			radial-gradient(circle at 86% 8%, rgba(121, 176, 140, 0.1), transparent 40%);
		opacity: 0.55;
		animation: selvatic-ambient-breathe 9.5s var(--selvatic-ease) infinite;
	}

	@keyframes selvatic-grid-shift {
		from {
			background-position: 0 0, 0 0, 0 0, 0 0;
		}

		to {
			background-position: 128px 0, 0 128px, 32px 0, 0 32px;
		}
	}

	@keyframes selvatic-ambient-breathe {
		0%,
		100% {
			opacity: 0.42;
			transform: translate3d(0, 0, 0) scale(1);
		}

		50% {
			opacity: 0.6;
			transform: translate3d(0, -1.5%, 0) scale(1.02);
		}
	}

	@keyframes selvatic-pane-enter {
		from {
			opacity: 0;
			transform: translateY(8px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	[data-ui='Navbar'],
	[data-ui='PaneHeader'] {
		backdrop-filter: blur(8px);
		background: rgba(16, 27, 22, 0.86) !important;
		border-bottom: 1px solid var(--selvatic-line-strong) !important;
		box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
	}

	[data-ui='PaneLayout'] > [data-ui='Pane'] {
		position: relative;
		border-right: 1px solid var(--selvatic-line-strong) !important;
		background:
			linear-gradient(180deg, rgba(15, 25, 20, 0.86) 0%, rgba(11, 20, 16, 0.78) 100%) !important;
		animation: selvatic-pane-enter 280ms var(--selvatic-ease);
	}

	[data-ui='PaneLayout'] > [data-ui='Pane']:last-child {
		border-right: none !important;
	}

	[data-ui='Pane']::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			repeating-linear-gradient(
				to bottom,
				transparent 0,
				transparent 37px,
				rgba(228, 238, 221, 0.045) 37px,
				rgba(228, 238, 221, 0.045) 38px
			);
		opacity: 0.6;
	}

	[data-ui='Card'],
	[data-ui='Pane'],
	[data-ui='Dialog'] {
		border-color: var(--selvatic-line-soft) !important;
	}

	[data-ui='Card'] {
		transition:
			border-color 180ms var(--selvatic-ease),
			background-color 180ms var(--selvatic-ease),
			box-shadow 220ms var(--selvatic-ease),
			transform 220ms var(--selvatic-ease);
	}

	[data-ui='Card']:hover {
		border-color: var(--selvatic-line-strong) !important;
		box-shadow: 0 8px 26px rgba(7, 12, 9, 0.28);
	}

	[data-ui='fieldHeaderContentBox'] {
		border-bottom: 1px dashed var(--selvatic-line-strong);
		padding-bottom: 0.45rem !important;
		margin-bottom: 0.2rem;
	}

	[data-ui='ArrayInput__content'] {
		border: 1px dashed var(--selvatic-line-strong);
		border-radius: 12px;
		padding: 0.55rem;
		background: linear-gradient(180deg, rgba(17, 30, 24, 0.7), rgba(10, 18, 14, 0.56));
	}

	[data-ui='ArrayInput__content'] > * + * {
		border-top: 1px dashed var(--selvatic-line-soft);
		margin-top: 0.7rem;
		padding-top: 0.7rem;
	}

	[data-ui='Button'],
	[data-ui='Tab'],
	[data-ui='Badge'],
	[data-ui='Label'] {
		font-weight: 700;
		letter-spacing: 0.035em;
		text-transform: uppercase;
	}

	[data-ui='Button'],
	[data-ui='Tab'] {
		transition:
			transform 160ms var(--selvatic-ease),
			border-color 160ms var(--selvatic-ease),
			background-color 160ms var(--selvatic-ease),
			box-shadow 180ms var(--selvatic-ease);
	}

	[data-ui='Button']:hover,
	[data-ui='Tab']:hover {
		transform: translateY(-1px);
		box-shadow: 0 8px 18px rgba(6, 10, 8, 0.24);
	}

	[data-ui='Heading'] {
		color: var(--selvatic-text-strong);
		letter-spacing: -0.015em;
	}

	[data-ui='TextInput'],
	[data-ui='TextArea'],
	[data-ui='Select'],
	[data-testid='new-document-button-search-input'] {
		border-color: var(--selvatic-line-strong) !important;
		background: rgba(19, 32, 24, 0.82) !important;
		box-shadow:
			inset 0 0 0 1px rgba(6, 11, 9, 0.45),
			0 8px 24px rgba(7, 12, 9, 0.24);
		transition:
			border-color 170ms var(--selvatic-ease),
			box-shadow 200ms var(--selvatic-ease),
			transform 170ms var(--selvatic-ease),
			background-color 200ms var(--selvatic-ease);
	}

	[data-ui='TextInput']:hover,
	[data-ui='TextArea']:hover,
	[data-ui='Select']:hover {
		border-color: var(--selvatic-accent-soft) !important;
	}

	[data-ui='TextInput']:focus-within,
	[data-ui='TextArea']:focus-within,
	[data-ui='Select']:focus-within {
		border-color: var(--selvatic-accent-strong) !important;
		background: rgba(24, 39, 31, 0.9) !important;
		box-shadow:
			0 0 0 1px rgba(201, 232, 157, 0.24),
			0 0 0 4px rgba(201, 232, 157, 0.08),
			0 10px 26px rgba(8, 14, 10, 0.3);
		transform: translateY(-1px);
	}

	[data-ui='TextInput'] input,
	[data-ui='TextArea'] textarea,
	[data-ui='Select'] select {
		color: var(--selvatic-text-strong) !important;
	}

	[data-ui='TextInput'] input::placeholder,
	[data-ui='TextArea'] textarea::placeholder {
		color: rgba(209, 218, 205, 0.66) !important;
	}

	[data-ui='TextWithTone'][data-muted='true'] {
		color: rgba(209, 218, 205, 0.82) !important;
	}

	[data-ui='Button'][data-tone='primary'] {
		color: #132014 !important;
		box-shadow: 0 8px 18px rgba(12, 26, 15, 0.28);
	}

	[data-ui='Button'][data-tone='primary']:hover {
		background: #c9e89d !important;
	}

	@media (prefers-reduced-motion: reduce) {
		#sanity::before,
		#sanity::after,
		[data-ui='PaneLayout'] > [data-ui='Pane'] {
			animation: none !important;
		}

		[data-ui='Button'],
		[data-ui='Tab'],
		[data-ui='Card'],
		[data-ui='TextInput'],
		[data-ui='TextArea'],
		[data-ui='Select'] {
			transition: none !important;
		}
	}
`;

export function StudioLayout(props: LayoutProps) {
	return (
		<>
			<StudioSwissGlobalStyle />
			{props.renderDefault(props)}
		</>
	);
}
