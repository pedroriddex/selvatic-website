import { imageFor } from '$lib/features/content/model/page-content';
import type { PageContent } from '$lib/types';

const GALLERY_ALTS: string[] = [
	'Ramo floral de color en estudio',
	'Detalle floral en tonos suaves',
	'Bouquet coral de Selvatic'
];

/** Galería de "Sobre nosotros": imágenes editables desde el CMS con alt fijo. */
export const getAboutGalleryItems = (content: PageContent) =>
	GALLERY_ALTS.map((alt, index) => ({
		src: imageFor(content, `media.gallery${index + 1}`),
		alt
	})).filter((item): item is { src: string; alt: string } => Boolean(item.src));
