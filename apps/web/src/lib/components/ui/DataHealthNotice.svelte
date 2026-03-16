<script lang="ts">
	import type { DataHealth } from '$lib/types';

	type Props = {
		health: DataHealth;
		class?: string;
	};

	let { health, class: className = '' }: Props = $props();

	const toneClass = $derived(
		health.status === 'error'
			? 'border-red-300/50 bg-red-500/10 text-red-100'
			: 'border-amber-300/45 bg-amber-500/10 text-amber-100'
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
