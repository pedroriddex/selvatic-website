<script lang="ts">
	import ServiceList from '$lib/components/services/ServiceList.svelte';
	import DataHealthNotice from '$lib/components/ui/DataHealthNotice.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import MediaPlaceholder from '$lib/components/ui/MediaPlaceholder.svelte';
	import SectionHeader from '$lib/components/ui/SectionHeader.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import { SITE_MEDIA } from '$lib/config/site-media';
	import type { PageData } from './$types';

	let { data } = $props() as { data: PageData };

	const methodSteps = [
		'1. Escuchamos la necesidad, el espacio y el tono del proyecto.',
		'2. Definimos una propuesta floral y un presupuesto personalizado.',
		'3. Seleccionamos material, producimos y acompañamos hasta la entrega final.'
	];
</script>

<SectionIntro
	kicker="Servicios"
	title="Diseño floral natural para espacios, encargos y proyectos con identidad."
	description="Trabajamos desde la experiencia, el criterio y el respeto por lo natural. Cada propuesta se construye con sencillez, equilibrio y una escucha cercana."
/>

<DataHealthNotice health={data.dataHealth} class="mb-6" />

<section class="section-integrated reveal reveal-delay">
	<div class="swiss-grid items-start gap-y-10">
		<div class="grid-span-copy">
			<p class="section-kicker text-white/72">Metodología</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-white/88">Proceso</h2>
			<h3 class="section-subtitle mt-3 max-w-3xl">Servicio cercano, criterio claro y una producción pensada con calma.</h3>
			<ol class="mt-6 divide-y divide-white/12 border-y border-white/12 text-sm leading-relaxed text-white/74">
				{#each methodSteps as step}
					<li class="py-4">{step}</li>
				{/each}
			</ol>
			<a href="/contacto" class="btn-lime mt-7">Pedir propuesta</a>
		</div>
		<div class="grid-span-image">
			<div class="image-panel image-panel-arched">
				{#if SITE_MEDIA.servicesVisualImageUrl}
					<img src={SITE_MEDIA.servicesVisualImageUrl} alt="Dirección floral Selvatic" loading="lazy" />
				{:else}
					<MediaPlaceholder class="h-full w-full" />
				{/if}
			</div>
		</div>
	</div>
</section>

<section class="section-integrated mt-14 reveal">
	<div class="swiss-grid items-start gap-y-10">
		<div class="grid-span-copy">
			<p class="section-kicker text-white/72">Materia y criterio</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-white/88">Materialidad</h2>
			<h3 class="section-subtitle mt-3 max-w-3xl">
				Flor seca, preservada y planta natural trabajadas con una estética atemporal.
			</h3>
			<p class="section-note mt-5">
				Aproximadamente el 70% de nuestro trabajo se centra en creaciones con flor seca y preservada, combinadas con una cuidada selección de planta natural.
			</p>
			<p class="section-note mt-4">
				Cada pieza se diseña de forma consciente, respetando la forma y el carácter del material vegetal para que la composición mantenga calma, equilibrio y verdad.
			</p>
		</div>
		<div class="grid-span-image grid-rail-left">
			<p class="section-kicker text-white/72">Presentación</p>
			<h3 class="section-subtitle mt-3 max-w-3xl">
				La cerámica forma parte de la composición, no solo del soporte.
			</h3>
			<p class="section-note mt-5">
				Todas las composiciones se presentan en cerámica decorativa, seleccionada con el mismo criterio natural y honesto que guía el diseño floral.
			</p>
			<p class="section-note mt-4">
				Son piezas pensadas para integrarse en los espacios y acompañar el día a día con belleza serena, desde encargos personales hasta proyectos de interiorismo.
			</p>
		</div>
	</div>
</section>

<section class="section-integrated mt-14 reveal">
	<SectionHeader
		label="Servicios"
		title="Intervenciones, encargos y ramos a medida"
		description="Propuestas personalizadas adaptadas a cada proyecto, con acompañamiento desde la idea hasta la entrega."
	/>
	{#if data.services.length > 0}
		<ServiceList services={data.services} revealDelayStep={35} class="divide-y divide-white/12 mt-9" />
	{:else}
		<div class="swiss-grid mt-9">
			<EmptyState
				kicker="Servicios"
				title="No hay servicios publicados"
				description="Muy pronto mostraremos aquí todas las propuestas y encargos disponibles."
				class="col-span-4 md:col-span-8 xl:col-span-12"
			/>
		</div>
	{/if}
</section>
