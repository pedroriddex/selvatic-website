<script lang="ts">
	type Props = {
		kicker: string;
		title: string;
		description?: string;
		class?: string;
		titleClass?: string;
		descriptionClass?: string;
	};

	let {
		kicker,
		title,
		description,
		class: className = 'section-intro mb-14 reveal',
		titleClass = 'section-title mt-3',
		descriptionClass = 'section-note mt-4'
	}: Props = $props();
</script>

<section class={className}>
	<p class="section-kicker">{kicker}</p>
	<h1 class={titleClass}>{title}</h1>
	{#if description}
		<p class={descriptionClass}>{description}</p>
	{/if}
</section>
