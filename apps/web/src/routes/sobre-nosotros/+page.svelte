<script lang="ts">
	import MediaPlaceholder from '$lib/components/ui/MediaPlaceholder.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import { SITE_MEDIA } from '$lib/config/site-media';

	const aboutVisual = SITE_MEDIA.aboutVisualImageUrl || SITE_MEDIA.homePromoImageUrl;
	const galleryImages = [
		{
			src: SITE_MEDIA.aboutGalleryImageUrls[0],
			alt: 'Ramo floral de color en estudio'
		},
		{
			src: SITE_MEDIA.aboutGalleryImageUrls[1],
			alt: 'Detalle floral en tonos suaves'
		},
		{
			src: SITE_MEDIA.aboutGalleryImageUrls[2],
			alt: 'Bouquet coral de Selvatic'
		}
	];
</script>

<SectionIntro
	kicker="Sobre nosotros"
	title="Selvatic es diseño floral natural con raíces familiares y una mirada serena."
	description="Un proyecto construido desde la experiencia, el respeto por el producto y una forma de trabajar basada en la sencillez, el equilibrio y la naturalidad."
/>

<section class="section-integrated reveal reveal-delay">
	<div class="swiss-grid items-start gap-y-10">
		<div class="grid-span-copy">
			<p class="section-kicker text-white/72">Origen</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-white/88">Legado familiar</h2>
			<h3 class="section-subtitle mt-3">
				La historia de Selvatic empieza mucho antes del estudio actual.
			</h3>
			<p class="section-note mt-5">
				Selvatic es un proyecto de diseño floral natural con raíces en una larga tradición familiar ligada al mundo de la planta y la flor.
			</p>
			<p class="section-note mt-4">
				Desde los años 70, cuando el abuelo Ananías recorría los mercados de Cuenca, Utiel, Requena y Ontinyent, hasta la continuidad del oficio en los años 90 de la mano de Vicente y Carmen, el conocimiento del sector y el respeto por el producto han marcado siempre nuestro camino.
			</p>
		</div>
		<div class="grid-span-image">
			<div class="image-panel image-panel-arched min-h-[18rem] sm:min-h-[22rem]">
				{#if aboutVisual}
					<img src={aboutVisual} alt="Universo visual de Selvatic" loading="lazy" />
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
			<p class="section-kicker text-white/72">Dirección actual</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-white/88">Noelia Pérez</h2>
			<h3 class="section-subtitle mt-3">
				Hoy, el estudio está liderado y gestionado de forma integral por Noelia Pérez.
			</h3>
			<p class="section-note mt-5">
				A lo largo de su trayectoria ha trabajado junto a destacados profesionales del sector, desarrollando una manera de entender el diseño floral basada en la sencillez, el equilibrio y la naturalidad.
			</p>
			<p class="section-note mt-4">
				Cada encargo se aborda con una mirada consciente, dejando que el material vegetal conserve su forma, su ritmo y su carácter, y buscando siempre una estética atemporal.
			</p>
		</div>
		<div class="grid-span-image grid-rail-left">
			<p class="section-kicker text-white/72">Forma de trabajar</p>
			<h3 class="section-subtitle mt-3 max-w-3xl">
				Servicio cercano, criterio claro y atención a cada detalle.
			</h3>
			<p class="section-note mt-5">
				En Selvatic ofrecemos un servicio cercano y personalizado, cuidando cada detalle desde la selección del producto hasta la entrega final.
			</p>
			<p class="section-note mt-4">
				Trabajamos desde la experiencia, el criterio y el respeto por lo natural. Selvatic es diseño floral natural, hecho con tiempo, conocimiento y sensibilidad.
			</p>
		</div>
	</div>
</section>

<section class="section-integrated mt-14 reveal">
	<div class="swiss-grid items-end gap-y-6">
		<div class="col-span-4 md:col-span-6 xl:col-span-8">
			<p class="section-kicker">Selección visual</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-white/88">Imágenes</h2>
			<h3 class="section-subtitle mt-3">Una muestra del gesto floral, la escala y la presencia material del estudio.</h3>
		</div>
	</div>

	<div class="swiss-grid editorial-mosaic mt-10 gap-y-8">
		{#each galleryImages as image, index}
			<div class={index === 0 ? 'col-span-4 md:col-span-4 xl:col-span-5' : index === 1 ? 'col-span-4 md:col-span-4 xl:col-span-3' : 'col-span-4 md:col-span-8 xl:col-span-4'}>
				<div class="image-panel image-panel-arched min-h-[18rem] sm:min-h-[22rem]">
					<img src={image.src} alt={image.alt} loading="lazy" />
				</div>
			</div>
		{/each}
	</div>
</section>

<section class="section-integrated mt-14 reveal">
	<div class="swiss-grid items-start gap-y-10">
		<div class="grid-span-copy">
			<p class="section-kicker text-white/72">Materialidad</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-white/88">Especialidad</h2>
			<h3 class="section-subtitle mt-3">
				Flor seca y preservada, combinadas con planta natural y una selección honesta de cerámica.
			</h3>
			<p class="section-note mt-5">
				Selvatic está especializado en creaciones florales con flor seca y preservada, que representan aproximadamente el 70% de nuestro trabajo, combinadas con una cuidada selección de planta natural.
			</p>
			<p class="section-note mt-4">
				Todas las composiciones se presentan en cerámica decorativa, seleccionada con el mismo criterio natural y honesto que define nuestro trabajo.
			</p>
		</div>
		<div class="grid-span-image grid-rail-left">
			<p class="section-kicker text-white/72">Presencia</p>
			<h3 class="section-subtitle mt-3 max-w-3xl">
				Piezas pensadas para integrarse en los espacios y acompañar el día a día con calma.
			</h3>
			<p class="section-note mt-5">
				Son composiciones concebidas para convivir con el espacio, aportar belleza serena y sostener una presencia natural y duradera.
			</p>
			<p class="section-note mt-4">
				Esa misma lógica guía tanto los encargos personales como los trabajos florales a medida para interiorismo, eventos o proyectos de marca.
			</p>
		</div>
	</div>
</section>

<section class="section-integrated mt-14 reveal">
	<div class="swiss-grid items-end gap-y-8">
		<div class="col-span-4 md:col-span-6 xl:col-span-8">
			<p class="section-kicker">Contacto</p>
			<h2 class="mt-2 text-lg font-semibold uppercase tracking-[0.12em] text-white/88">Encargos a medida</h2>
			<h3 class="section-subtitle mt-3">Tienes una idea o necesitas un trabajo floral personalizado?</h3>
			<p class="section-note mt-5">
				En Selvatic realizamos presupuestos personalizados y creaciones adaptadas a cada proyecto.
			</p>
		</div>
		<div class="col-span-4 md:col-span-2 xl:col-span-4 md:justify-self-end">
			<a href="/contacto" class="btn-lime">Solicitar presupuesto</a>
		</div>
	</div>
</section>
