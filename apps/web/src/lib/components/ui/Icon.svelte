<script lang="ts">
	import addLine from 'remixicon/icons/System/add-line.svg?raw';
	import arrowRightLine from 'remixicon/icons/Arrows/arrow-right-line.svg?raw';
	import arrowRightUpLine from 'remixicon/icons/Arrows/arrow-right-up-line.svg?raw';
	import bankCardLine from 'remixicon/icons/Finance/bank-card-line.svg?raw';
	import closeLine from 'remixicon/icons/System/close-line.svg?raw';
	import deleteBinLine from 'remixicon/icons/System/delete-bin-line.svg?raw';
	import eyeLine from 'remixicon/icons/System/eye-line.svg?raw';
	import imageLine from 'remixicon/icons/Media/image-line.svg?raw';
	import layoutGridLine from 'remixicon/icons/Design/layout-grid-line.svg?raw';
	import menuLine from 'remixicon/icons/System/menu-line.svg?raw';
	import sendPlaneLine from 'remixicon/icons/Business/send-plane-line.svg?raw';
	import shoppingBag3Line from 'remixicon/icons/Finance/shopping-bag-3-line.svg?raw';
	import starLine from 'remixicon/icons/System/star-line.svg?raw';
	import subtractLine from 'remixicon/icons/System/subtract-line.svg?raw';

	type IconName =
		| 'add-line'
		| 'arrow-right-line'
		| 'arrow-right-up-line'
		| 'bank-card-line'
		| 'close-line'
		| 'delete-bin-line'
		| 'eye-line'
		| 'image-line'
		| 'layout-grid-line'
		| 'menu-line'
		| 'send-plane-line'
		| 'shopping-bag-3-line'
		| 'star-line'
		| 'subtract-line';

	type Props = {
		name: IconName;
		class?: string;
	};

	const icons: Record<IconName, string> = {
		'add-line': addLine,
		'arrow-right-line': arrowRightLine,
		'arrow-right-up-line': arrowRightUpLine,
		'bank-card-line': bankCardLine,
		'close-line': closeLine,
		'delete-bin-line': deleteBinLine,
		'eye-line': eyeLine,
		'image-line': imageLine,
		'layout-grid-line': layoutGridLine,
		'menu-line': menuLine,
		'send-plane-line': sendPlaneLine,
		'shopping-bag-3-line': shoppingBag3Line,
		'star-line': starLine,
		'subtract-line': subtractLine
	};

	let { name, class: className = '' }: Props = $props();
	const markup = $derived(icons[name]);
</script>

<span class={`ri-svg inline-flex shrink-0 ${className}`.trim()} aria-hidden="true">
	{@html markup}
</span>

<style>
	.ri-svg :global(svg) {
		display: block;
		width: 1em;
		height: 1em;
		fill: currentColor;
	}
</style>
