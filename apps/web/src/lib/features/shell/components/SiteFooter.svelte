<script lang="ts">
	import { getDefaultPageContent, textFor } from '$lib/features/content/model/page-content';
	import type { PageContent } from '$lib/types';

	type Props = {
		year: number;
		content?: PageContent;
	};

	let { year, content = getDefaultPageContent('global') }: Props = $props();
</script>

<footer class="border-t border-[#222D221A]">
	<div class="swiss-shell">
		<div class="site-frame frame-gutter grid gap-8 py-12 lg:grid-cols-2 lg:py-14">
			<div>
				<p class="section-kicker">{textFor(content, 'brand.name')}</p>
				<p class="mt-3 max-w-md text-sm leading-relaxed text-[#222D22B8]">
					{textFor(content, 'footer.description')}
				</p>
			</div>
			<div class="flex flex-wrap items-end justify-start gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#222D22A8] lg:justify-end">
				<a href="/tienda" class="hover:text-[#222D22]">{textFor(content, 'nav.shop')}</a>
				<a href="/sobre-nosotros" class="hover:text-[#222D22]">{textFor(content, 'nav.about')}</a>
				<a href="/servicios" class="hover:text-[#222D22]">{textFor(content, 'nav.services')}</a>
				<a href="/contacto" class="hover:text-[#222D22]">{textFor(content, 'nav.contact')}</a>
				<span class="text-[#222D2270]">© {year}</span>
			</div>
		</div>
	</div>
</footer>
