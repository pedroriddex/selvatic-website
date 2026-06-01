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
