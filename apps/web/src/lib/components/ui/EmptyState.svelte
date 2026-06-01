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

<div class={`border border-[#222D2224] bg-[#FFFFFF8C] p-6 sm:p-7 ${className}`.trim()}>
	<p class="section-kicker text-[#222D22AD]">{kicker}</p>
	<h4 class="mt-3 text-xl leading-[1.05] text-[#222D22] sm:text-2xl">{title}</h4>
	<p class="mt-3 max-w-2xl text-sm leading-relaxed text-[#222D22BD]">{description}</p>
	{#if actionHref && actionLabel}
		<a href={actionHref} class="btn-outline mt-6">{actionLabel}</a>
	{/if}
</div>
