// Media global manual del frontend.
// Sube los archivos a: apps/web/static/media/
// y referencia aquí las rutas públicas (por ejemplo: /media/mi-archivo.webp).
export const SITE_MEDIA = {
	heroVideoUrl: '/media/Video%20Selvatic.webm',
	heroVideoPosterUrl: '/media/selvatic-images/bouquet-lazo-coral.webp',
	homePromoImageUrl: '/media/selvatic-images/bouquet-lazo-coral.webp',
	servicesVisualImageUrl: '/media/selvatic-images/atelier-setup.webp',
	checkoutVisualImageUrl: '/media/selvatic-images/composicion-invernal.webp',
	aboutVisualImageUrl: '/media/selvatic-images/ramo-color-studio.webp',
	aboutGalleryImageUrls: [
		'/media/selvatic-images/ramo-color-studio-alt.webp',
		'/media/selvatic-images/detalle-floral-pastel.webp',
		'/media/selvatic-images/bouquet-lazo-coral-alt.webp'
	]
} as const;
