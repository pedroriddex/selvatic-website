import { SITE_MEDIA } from '$lib/config/site-media';

export const ABOUT_VISUAL_IMAGE_URL = SITE_MEDIA.aboutVisualImageUrl || SITE_MEDIA.homePromoImageUrl;

export const ABOUT_GALLERY_ITEMS = [
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
] as const;
