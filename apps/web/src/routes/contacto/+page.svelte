<script lang="ts">
	import DataHealthNotice from '$lib/components/ui/DataHealthNotice.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form } = $props() as { data: PageData; form: ActionData };

	type ContactFormState = {
		success?: boolean;
		message?: string;
		values?: {
			name?: string;
			email?: string;
			phone?: string;
			service?: string;
			message?: string;
		};
	};

	const state = $derived((form ?? {}) as ContactFormState);
	const processSteps = [
		'1. Escuchamos la idea, el uso del espacio y el timing del proyecto.',
		'2. Preparamos una propuesta floral y un presupuesto personalizado.',
		'3. Seleccionamos producto, producimos y acompañamos hasta la entrega final.'
	];
</script>

<SectionIntro
	kicker="Contacto"
	title="Tienes una idea o necesitas un trabajo floral a medida?"
	description="En Selvatic realizo presupuestos personalizados y creaciones adaptadas a cada proyecto. Cuéntame qué necesitas y te responderé con una propuesta clara, sensible y realista."
/>

<DataHealthNotice health={data.dataHealth} class="mb-6" />

{#if data.services.length === 0}
	<section class="section-integrated reveal">
		<div class="swiss-grid">
			<EmptyState
				kicker="Servicios"
				title="Todavía no hay servicios publicados"
				description="Puedes enviarnos tu solicitud igualmente y te ayudaremos a definir el servicio ideal."
				class="col-span-4 md:col-span-8 xl:col-span-12"
			/>
		</div>
	</section>
{/if}

<section class="section-integrated reveal">
	<div class="swiss-grid items-start gap-y-10">
		<aside class="col-span-4 md:col-span-3 xl:col-span-4">
			<p class="section-kicker text-white/72">Servicio cercano</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-white/88">Proceso</h2>
			<h3 class="section-subtitle mt-3 text-2xl sm:text-3xl">Cada encargo se acompaña de principio a fin.</h3>
			<ol class="mt-5 divide-y divide-white/12 border-y border-white/12 text-sm leading-relaxed text-white/74">
				{#each processSteps as step}
					<li class="py-4">{step}</li>
				{/each}
			</ol>
			<p class="section-note mt-5 text-sm">
				Trabajamos desde la experiencia, el criterio y el respeto por lo natural, cuidando cada detalle desde la selección del producto hasta la entrega final.
			</p>
		</aside>

		<form method="POST" class="col-span-4 md:col-span-5 xl:col-span-8 grid-rail-left">
			<div class="grid gap-5 sm:grid-cols-2">
				<label class="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/78">
					Nombre
					<input type="text" name="name" required value={state.values?.name ?? ''} class="input-embedded" />
				</label>
				<label class="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/78">
					Email
					<input type="email" name="email" required value={state.values?.email ?? ''} class="input-embedded" />
				</label>
			</div>

			<div class="mt-5 grid gap-5 sm:grid-cols-2">
				<label class="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/78">
					Teléfono (opcional)
					<input type="text" name="phone" value={state.values?.phone ?? ''} class="input-embedded" />
				</label>
				<label class="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/78">
					Servicio
					<select name="service" class="input-embedded" disabled={data.services.length === 0}>
						<option value="">{data.services.length > 0 ? 'Seleccionar' : 'Sin servicios publicados'}</option>
						{#each data.services as service}
							<option value={service.title} selected={state.values?.service === service.title}>
								{service.title}
							</option>
						{/each}
					</select>
					{#if data.services.length === 0}
						<span class="text-[10px] uppercase tracking-[0.1em] text-white/56">
							Si aún no ves opciones, cuéntanos tu idea en el mensaje y te orientaremos personalmente.
						</span>
					{/if}
				</label>
			</div>

			<label class="mt-5 flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/78">
				Mensaje
				<textarea name="message" required rows="7" class="input-embedded">{state.values?.message ?? ''}</textarea>
			</label>

			{#if state.message}
				<p
					class={`mt-5 rounded-[0.36rem] border px-3 py-2 text-sm ${state.success ? 'border-lime-300/40 bg-lime-200/10 text-white' : 'border-red-300/60 bg-red-500/12 text-red-100'}`}
				>
					{state.message}
				</p>
			{/if}

			<button type="submit" class="btn-dark mt-7">
				<Icon name="send-plane-line" />
				Solicitar presupuesto
			</button>
		</form>
	</div>
</section>
