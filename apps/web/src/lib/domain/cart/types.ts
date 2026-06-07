export interface CartSelection {
	groupName: string;
	optionLabel: string;
}

export interface CartItem {
	slug: string;
	/** Identificador estable de línea: slug + firma de opciones (o solo slug si no hay opciones). */
	lineId: string;
	name: string;
	imageUrl?: string;
	/** Precio efectivo de la línea (base + suplementos). Cosmético; el servidor lo recalcula. */
	price: number;
	currency: string;
	stock: number;
	quantity: number;
	selections: CartSelection[];
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
