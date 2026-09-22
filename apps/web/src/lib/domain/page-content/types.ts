export const PAGE_KEYS = [
	'global',
	'home',
	'shop',
	'product',
	'services',
	'about',
	'contact',
	'checkout',
	'maintenance'
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export interface PageTextEntry {
	key: string;
	label?: string;
	value: string;
}

export interface PageGalleryImage {
	url: string;
	alt?: string;
}

export interface PageContent {
	key: PageKey;
	title?: string;
	route?: string;
	seoTitle?: string;
	seoDescription?: string;
	texts: Record<string, string>;
	/** Imágenes editables de la página: clave punteada -> URL (Sanity o la de serie). */
	images: Record<string, string>;
	/** Galerías editables (listas ordenadas de imágenes): clave punteada -> imágenes. */
	galleries: Record<string, PageGalleryImage[]>;
}

export type PageContentMap = Partial<Record<PageKey, PageContent>>;
