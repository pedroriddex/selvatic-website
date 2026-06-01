<script lang="ts">
	import type { DataHealth } from '$lib/types';

	type Props = {
		health: DataHealth;
		class?: string;
	};

	let { health, class: className = '' }: Props = $props();

	const toneClass = $derived(
		health.status === 'error'
			? 'border-[#B7636366] bg-[#B7636314] text-[#7F3838]'
			: 'border-[#B08B3866] bg-[#B08B3812] text-[#6E571A]'
	);
</script>

{#if health.status !== 'ok'}
	<div class={`rounded-[0.35rem] border px-3 py-2 text-sm ${toneClass} ${className}`.trim()} role="status" aria-live="polite">
		{health.message || 'Hay una incidencia temporal cargando contenido.'}
		{#if health.requestId}
			<span class="ml-2 text-[10px] uppercase tracking-[0.12em] opacity-70">Ref: {health.requestId}</span>
		{/if}
	</div>
{/if}
