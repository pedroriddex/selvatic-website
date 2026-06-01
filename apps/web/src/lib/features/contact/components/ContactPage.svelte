<script lang="ts">
	import DataHealthNotice from '$lib/components/ui/DataHealthNotice.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { type ContactFormState } from '$lib/features/contact/model/contact-page';
	import { getDefaultPageContent, textFor } from '$lib/features/content/model/page-content';
	import type { DataHealth, PageContent, Service } from '$lib/types';

	type Props = {
		services: Service[];
		dataHealth: DataHealth;
		pageContent?: PageContent;
		form?: ContactFormState;
	};

	let { services, dataHealth, pageContent = getDefaultPageContent('contact'), form }: Props = $props();

	const state = $derived((form ?? {}) as ContactFormState);
	const processSteps = $derived([
		textFor(pageContent, 'process.step1'),
		textFor(pageContent, 'process.step2'),
		textFor(pageContent, 'process.step3')
	]);
</script>

<section class="section-intro mb-14 reveal">
	<div class="swiss-grid items-end gap-y-8">
		<div class="col-span-4 md:col-span-5 xl:col-span-8">
			<p class="section-kicker">{textFor(pageContent, 'intro.kicker')}</p>
			<h1 class="section-title mt-3" style="max-width: none;">
				{textFor(pageContent, 'intro.title')}
			</h1>
		</div>
		<div class="col-span-4 md:col-span-3 xl:col-span-4">
			<p class="section-note" style="max-width: none;">
				{textFor(pageContent, 'intro.description')}
			</p>
		</div>
	</div>
</section>

<DataHealthNotice health={dataHealth} class="mb-6" />

{#if services.length === 0}
	<section class="section-integrated reveal">
		<div class="swiss-grid">
			<EmptyState
				kicker="Servicios"
				title={textFor(pageContent, 'emptyServices.title')}
				description={textFor(pageContent, 'emptyServices.description')}
				class="col-span-4 md:col-span-8 xl:col-span-12"
			/>
		</div>
	</section>
{/if}

<section class="section-integrated reveal">
	<div class="swiss-grid items-start gap-y-10">
		<aside class="col-span-4 md:col-span-3 xl:col-span-5">
			<p class="section-kicker text-[#222D22B8]">{textFor(pageContent, 'process.kicker')}</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-[#222D22E0]">{textFor(pageContent, 'process.label')}</h2>
			<h3 class="section-subtitle mt-3 max-w-none text-2xl sm:text-3xl">
				{textFor(pageContent, 'process.title')}
			</h3>
			<ol class="mt-5 divide-y divide-[#222D221F] border-y border-[#222D221F] text-sm leading-relaxed text-[#222D22BD]">
				{#each processSteps as step}
					<li class="py-4">{step}</li>
				{/each}
			</ol>
			<p class="section-note mt-5 text-sm">
				{textFor(pageContent, 'process.note')}
			</p>
		</aside>

		<form method="POST" class="col-span-4 md:col-span-5 xl:col-span-7 grid-rail-left">
			<div class="grid gap-5 sm:grid-cols-2">
				<label class="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#222D22C7]">
					{textFor(pageContent, 'form.name')}
					<input type="text" name="name" required value={state.values?.name ?? ''} class="input-embedded" />
					{#if state.errors?.name?.[0]}
						<span class="text-[10px] uppercase tracking-[0.1em] text-[#9B4B4B]">{state.errors.name[0]}</span>
					{/if}
				</label>
				<label class="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#222D22C7]">
					{textFor(pageContent, 'form.email')}
					<input type="email" name="email" required value={state.values?.email ?? ''} class="input-embedded" />
					{#if state.errors?.email?.[0]}
						<span class="text-[10px] uppercase tracking-[0.1em] text-[#9B4B4B]">{state.errors.email[0]}</span>
					{/if}
				</label>
			</div>

			<div class="mt-5 grid gap-5 sm:grid-cols-2">
				<label class="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#222D22C7]">
					{textFor(pageContent, 'form.phone')}
					<input type="text" name="phone" value={state.values?.phone ?? ''} class="input-embedded" />
					{#if state.errors?.phone?.[0]}
						<span class="text-[10px] uppercase tracking-[0.1em] text-[#9B4B4B]">{state.errors.phone[0]}</span>
					{/if}
				</label>
				<label class="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#222D22C7]">
					{textFor(pageContent, 'form.service')}
					<select name="service" class="input-embedded" disabled={services.length === 0}>
						<option value="">{services.length > 0 ? textFor(pageContent, 'form.select') : textFor(pageContent, 'form.noServices')}</option>
						{#each services as service}
							<option value={service.title} selected={state.values?.service === service.title}>
								{service.title}
							</option>
						{/each}
					</select>
					{#if services.length === 0}
						<span class="text-[10px] uppercase tracking-[0.1em] text-[#222D228F]">
							{textFor(pageContent, 'form.noServicesHelp')}
						</span>
					{/if}
					{#if state.errors?.service?.[0]}
						<span class="text-[10px] uppercase tracking-[0.1em] text-[#9B4B4B]">{state.errors.service[0]}</span>
					{/if}
				</label>
			</div>

			<label class="mt-5 flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#222D22C7]">
				{textFor(pageContent, 'form.message')}
				<textarea name="message" required minlength="4" rows="7" class="input-embedded">{state.values?.message ?? ''}</textarea>
				{#if state.errors?.message?.[0]}
					<span class="text-[10px] uppercase tracking-[0.1em] text-[#9B4B4B]">{state.errors.message[0]}</span>
				{/if}
			</label>

			{#if state.message}
				<p
					class={`mt-5 rounded-[0.36rem] border px-3 py-2 text-sm ${state.success ? 'border-[#222D2240] bg-[#222D220D] text-[#222D22]' : 'border-[#B7636366] bg-[#B7636314] text-[#7F3838]'}`}
				>
					{state.message}
				</p>
			{/if}

			<button type="submit" class="btn-dark mt-7">
				<Icon name="send-plane-line" />
				{textFor(pageContent, 'form.submit')}
			</button>
		</form>
	</div>
</section>
