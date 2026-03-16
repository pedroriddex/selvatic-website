import type { ProductCategory } from '$lib/config/product-categories';

export type EntityId = number | string;
export type AppErrorCode = 'CONFIG' | 'AUTH' | 'NETWORK' | 'UPSTREAM' | 'VALIDATION' | 'UNKNOWN';
export type DataHealthStatus = 'ok' | 'degraded' | 'error';

export interface AppError {
	name: string;
	message: string;
	code: AppErrorCode;
	scope: string;
	status?: number;
	requestId?: string;
	details?: unknown;
}

export interface DataHealth {
	status: DataHealthStatus;
	message?: string;
	code?: AppErrorCode;
	requestId?: string;
}

export interface Product {
	id: EntityId;
	documentId?: string;
	name: string;
	slug: string;
	category?: ProductCategory | null;
	description?: string;
	imageUrl?: string;
	price: number;
	currency: string;
	stock: number;
	stripePriceId?: string | null;
	isActive: boolean;
}

export interface CartItem {
	slug: string;
	name: string;
	imageUrl?: string;
	price: number;
	currency: string;
	stock: number;
	quantity: number;
}

export interface CartTotals {
	count: number;
	subtotal: number;
	shipping: number;
	total: number;
	currency: string | null;
}

export interface CartSnapshot extends CartTotals {
	items: CartItem[];
}

export interface Service {
	id: EntityId;
	documentId?: string;
	title: string;
	slug: string;
	summary?: string;
	content?: string;
	startingPrice?: number;
	featured?: boolean;
}

export interface ContactRequestInput {
	name: string;
	email: string;
	phone?: string;
	service?: string;
	message: string;
	sourcePage?: string;
}
