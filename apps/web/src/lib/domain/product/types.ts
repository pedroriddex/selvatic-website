import type { ProductCategory } from './categories';

export type EntityId = number | string;

export interface ProductImage {
	url: string;
	alt?: string;
	isPrimary?: boolean;
}

export interface VariantOption {
	label: string;
	/** Según el modo del grupo: importe que se suma al precio base ('add') o precio final del producto ('set'). */
	priceModifier: number;
	/** Imagen propia de la opción: al elegirla, sustituye a la imagen mostrada del producto. */
	imageUrl?: string;
}

export type VariantPricingMode = 'add' | 'set';

export interface VariantGroup {
	name: string;
	required: boolean;
	/** 'set': la opción fija el precio del producto. 'add': la opción suma al precio base (comportamiento histórico). */
	pricingMode: VariantPricingMode;
	options: VariantOption[];
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
	variantGroups: VariantGroup[];
	stripePriceId?: string | null;
	isActive: boolean;
}
