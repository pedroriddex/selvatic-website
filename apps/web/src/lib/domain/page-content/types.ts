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

export interface PageContent {
	key: PageKey;
	title?: string;
	route?: string;
	seoTitle?: string;
	seoDescription?: string;
	texts: Record<string, string>;
}

export type PageContentMap = Partial<Record<PageKey, PageContent>>;
