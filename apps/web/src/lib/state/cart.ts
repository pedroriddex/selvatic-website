import { browser } from '$app/environment';
import type { CartItem, CartSnapshot } from '$lib/types';
import { get, writable } from 'svelte/store';

const CART_STORAGE_KEY = 'selvatic-cart-v1';
const MAX_QUANTITY = 10;
export const CART_SHIPPING_AMOUNT = 4.9;

type AddCartItemInput = Omit<CartItem, 'quantity'> & {
	quantity?: number;
};

type CartMutationResult =
	| {
			ok: true;
	  }
	| {
			ok: false;
			error: string;
	  };

const emptySnapshot: CartSnapshot = {
	items: [],
	count: 0,
	subtotal: 0,
	shipping: 0,
	total: 0,
	currency: null
};

const clampQuantity = (quantity: number, stock: number): number => {
	const stockCap = Math.max(1, Math.min(MAX_QUANTITY, Math.max(0, Math.trunc(stock))));
	const normalized = Math.max(1, Math.trunc(quantity));
	return Math.min(normalized, stockCap);
};

const quantityCap = (stock: number): number =>
	Math.max(1, Math.min(MAX_QUANTITY, Math.max(0, Math.trunc(stock))));

const sanitizeCartItem = (item: Partial<CartItem>): CartItem | null => {
	if (
		typeof item.slug !== 'string' ||
		typeof item.name !== 'string' ||
		typeof item.price !== 'number' ||
		!Number.isFinite(item.price) ||
		item.price <= 0 ||
		typeof item.currency !== 'string' ||
		typeof item.stock !== 'number' ||
		!Number.isFinite(item.stock) ||
		item.stock < 1
	) {
		return null;
	}

	const quantity = clampQuantity(typeof item.quantity === 'number' ? item.quantity : 1, item.stock);

	return {
		slug: item.slug.trim(),
		name: item.name.trim(),
		imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : undefined,
		price: Number(item.price),
		currency: item.currency.toUpperCase(),
		stock: Math.max(1, Math.trunc(item.stock)),
		quantity
	};
};

const buildSnapshot = (items: CartItem[]): CartSnapshot => {
	const normalizedItems = items
		.map((item) => sanitizeCartItem(item))
		.filter((item): item is CartItem => item !== null);
	const currency = normalizedItems[0]?.currency ?? null;
	const singleCurrencyItems = currency
		? normalizedItems.filter((item) => item.currency === currency)
		: normalizedItems;

	const count = singleCurrencyItems.reduce((acc, item) => acc + item.quantity, 0);
	const subtotal = singleCurrencyItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
	const shipping = singleCurrencyItems.length > 0 ? CART_SHIPPING_AMOUNT : 0;

	return {
		items: singleCurrencyItems,
		count,
		subtotal,
		shipping,
		total: subtotal + shipping,
		currency
	};
};

const { subscribe, set } = writable<CartSnapshot>(emptySnapshot);

const persist = (snapshot: CartSnapshot): void => {
	if (!browser) {
		return;
	}

	try {
		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(snapshot.items));
	} catch (error) {
		console.error('[cart] persist', error);
	}
};

const commit = (items: CartItem[]): CartSnapshot => {
	const snapshot = buildSnapshot(items);
	set(snapshot);
	persist(snapshot);
	return snapshot;
};

const getSnapshot = (): CartSnapshot => get({ subscribe });

export const hydrateCart = (): CartSnapshot => {
	if (!browser) {
		return getSnapshot();
	}

	try {
		const raw = localStorage.getItem(CART_STORAGE_KEY);
		if (!raw) {
			set(emptySnapshot);
			return emptySnapshot;
		}

		const parsed = JSON.parse(raw) as unknown;
		const items = Array.isArray(parsed) ? parsed : [];
		return commit(items as CartItem[]);
	} catch (error) {
		console.error('[cart] hydrate', error);
		set(emptySnapshot);
		localStorage.removeItem(CART_STORAGE_KEY);
		return emptySnapshot;
	}
};

export const addItemToCart = (item: AddCartItemInput): CartMutationResult => {
	const cartItem = sanitizeCartItem({
		...item,
		quantity: item.quantity ?? 1
	});

	if (!cartItem) {
		return {
			ok: false,
			error: 'Producto inválido para carrito.'
		};
	}

	const current = getSnapshot();

	if (current.currency && current.currency !== cartItem.currency) {
		return {
			ok: false,
			error: `No puedes mezclar monedas. El carrito está en ${current.currency}.`
		};
	}

	const existing = current.items.find((entry) => entry.slug === cartItem.slug);
	if (existing) {
		const cap = quantityCap(cartItem.stock);
		if (existing.quantity >= cap) {
			return {
				ok: false,
				error: `No puedes añadir más unidades de "${cartItem.name}". Stock disponible: ${cartItem.stock}.`
			};
		}

		const mergedQuantity = clampQuantity(existing.quantity + cartItem.quantity, cartItem.stock);
		commit(
			current.items.map((entry) =>
				entry.slug === cartItem.slug ? { ...entry, stock: cartItem.stock, quantity: mergedQuantity } : entry
			)
		);
		return { ok: true };
	}

	commit([...current.items, cartItem]);
	return { ok: true };
};

export const removeItemFromCart = (slug: string): void => {
	const current = getSnapshot();
	commit(current.items.filter((item) => item.slug !== slug));
};

export const setCartItemQuantity = (slug: string, quantity: number): void => {
	const current = getSnapshot();
	commit(
		current.items.map((item) =>
			item.slug === slug ? { ...item, quantity: clampQuantity(quantity, item.stock) } : item
		)
	);
};

export const clearCart = (): void => {
	set(emptySnapshot);
	if (browser) {
		localStorage.removeItem(CART_STORAGE_KEY);
	}
};

export const cartStore = {
	subscribe
};
