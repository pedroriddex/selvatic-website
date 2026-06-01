<script lang="ts">
	type Props = {
		kicker?: string;
		label?: string;
		title?: string;
		description?: string;
		actionHref?: string;
		actionLabel?: string;
		class?: string;
		leftClass?: string;
		rightClass?: string;
		kickerClass?: string;
		labelClass?: string;
		titleClass?: string;
		descriptionClass?: string;
		actionClass?: string;
	};

	let {
		kicker,
		label,
		title,
		description,
		actionHref,
		actionLabel,
		class: className = 'swiss-grid items-end gap-y-6',
		leftClass = 'col-span-4 md:col-span-6 xl:col-span-8',
		rightClass = 'col-span-4 md:col-span-2 xl:col-span-4 md:justify-self-end',
		kickerClass = 'section-kicker',
		labelClass = 'mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-[#222D22E0]',
		titleClass = 'section-subtitle mt-3',
		descriptionClass = 'section-note mt-4',
		actionClass = 'btn-outline'
	}: Props = $props();
</script>

<div class={className}>
	<div class={leftClass}>
		{#if kicker}
			<p class={kickerClass}>{kicker}</p>
		{/if}
		{#if label}
			<h2 class={labelClass}>{label}</h2>
		{/if}
		{#if title}
			<h3 class={titleClass}>{title}</h3>
		{/if}
		{#if description}
			<p class={descriptionClass}>{description}</p>
		{/if}
	</div>
	{#if actionHref && actionLabel}
		<div class={rightClass}>
			<a href={actionHref} class={actionClass}>{actionLabel}</a>
		</div>
	{/if}
</div>
