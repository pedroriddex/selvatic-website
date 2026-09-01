// Media global manual del frontend.
// Sube los archivos a: apps/web/static/media/
// y referencia aquí las rutas públicas (por ejemplo: /media/mi-archivo.webp).
//
// NOTA: las imágenes de las páginas (promo de inicio, servicios, sobre
// nosotros, checkout…) ya NO viven aquí: se editan desde Sanity en cada página
// (pestaña "Imágenes") y sus valores de serie están en
// src/lib/features/content/model/page-content.ts. Aquí solo queda el vídeo del
// hero (Sanity no aloja vídeo en un campo de imagen) y sus respaldos.
export const SITE_MEDIA = {
	heroVideoUrl: '/media/Video%20Selvatic.webm',
	heroVideoPosterUrl: '/media/selvatic-images/bouquet-lazo-coral.webp',
	homePromoImageUrl: '/media/selvatic-images/bouquet-lazo-coral.webp'
} as const;
