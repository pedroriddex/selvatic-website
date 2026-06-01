import type { ProductCategory } from './categories';

export type EntityId = number | string;

export interface ProductImage {
	url: string;
	alt?: string;
	isPrimary?: boolean;
}

export interface Product {
	id: EntityId;
	documentId?: string;
	name: string;
	slug: string;
	category?: ProductCategory | null;
	description?: string;
	imageUrl?: string;
	gallery: ProductImage[];
	price: number;
	currency: string;
	stock: number;
	stripePriceId?: string | null;
	isActive: boolean;
}
