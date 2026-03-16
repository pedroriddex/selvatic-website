<script lang="ts">
	type Props = {
		kicker?: string;
		title: string;
		description: string;
		actionHref?: string;
		actionLabel?: string;
		class?: string;
	};

	let {
		kicker = 'Contenido pendiente',
		title,
		description,
		actionHref,
		actionLabel,
		class: className = ''
	}: Props = $props();
</script>

<div class={`border border-white/14 bg-white/[0.03] p-6 sm:p-7 ${className}`.trim()}>
	<p class="section-kicker text-white/68">{kicker}</p>
	<h4 class="mt-3 text-xl leading-[1.05] text-white sm:text-2xl">{title}</h4>
	<p class="mt-3 max-w-2xl text-sm leading-relaxed text-white/74">{description}</p>
	{#if actionHref && actionLabel}
		<a href={actionHref} class="btn-outline mt-6">{actionLabel}</a>
	{/if}
</div>
