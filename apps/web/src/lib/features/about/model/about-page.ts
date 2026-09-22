import { galleryFor } from '$lib/features/content/model/page-content';
import type { PageContent } from '$lib/types';

/** Galería de "Sobre nosotros": lista gestionada desde el CMS (o la de serie). */
export const getAboutGalleryItems = (content: PageContent) =>
	galleryFor(content, 'media.gallery').map((image, index) => ({
		src: image.url,
		alt: image.alt || `Imagen ${index + 1} de la galería de Selvatic`
	}));

// El mosaico editorial cicla en grupos de tres (ancha, estrecha, media) para
// que la galería funcione con cualquier número de imágenes.
const GALLERY_SPANS = [
	'col-span-4 md:col-span-4 xl:col-span-5',
	'col-span-4 md:col-span-4 xl:col-span-3',
	'col-span-4 md:col-span-8 xl:col-span-4'
];

export const getAboutGallerySpan = (index: number): string =>
	GALLERY_SPANS[index % GALLERY_SPANS.length];
