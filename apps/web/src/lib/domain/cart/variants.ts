import type { CartSelection } from './types';
import type { Product } from '$lib/domain/product/types';

/**
 * Núcleo de seguridad de precio para productos con variantes (suplemento de precio).
 *
 * Reglas:
 * - El precio efectivo SIEMPRE se calcula en el servidor, en céntimos enteros, a
 *   partir del producto de Sanity. El cliente nunca envía importes ni modifiers.
 * - El stock es único del producto (las variantes no tienen stock propio).
 */

type PricingProduct = Pick<Product, 'price' | 'variantGroups'>;

export type ResolvedSelection = {
	groupName: string;
	optionLabel: string;
	priceModifier: number;
};

export type EffectivePriceResult =
	| { ok: true; amountCents: number; resolved: ResolvedSelection[] }
	| { ok: false; error: string };

const normalizeText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/**
 * Limpia, deduplica por grupo y ordena las selecciones de forma canónica.
 * Pensado para derivar firmas/identificadores de línea estables en el carrito.
 */
export const normalizeSelections = (
	selections: readonly CartSelection[] | null | undefined
): CartSelection[] => {
	if (!Array.isArray(selections)) {
		return [];
	}

	const seenGroups = new Set<string>();
	const cleaned: CartSelection[] = [];

	for (const selection of selections) {
		const groupName = normalizeText(selection?.groupName);
		const optionLabel = normalizeText(selection?.optionLabel);
		if (!groupName || !optionLabel) {
			continue;
		}

		const groupKey = groupName.toLowerCase();
		if (seenGroups.has(groupKey)) {
			continue;
		}
		seenGroups.add(groupKey);
		cleaned.push({ groupName, optionLabel });
	}

	return cleaned.sort((a, b) => a.groupName.localeCompare(b.groupName));
};

/** Firma determinista (canónica) de un conjunto de selecciones. Vacío => ''. */
export const canonicalSelectionSignature = (
	selections: readonly CartSelection[] | null | undefined
): string => {
	const normalized = normalizeSelections(selections);
	if (normalized.length === 0) {
		return '';
	}
	return JSON.stringify(normalized.map((selection) => [selection.groupName, selection.optionLabel]));
};

/** Identificador estable de línea de carrito. Sin opciones => el slug (compat. hacia atrás). */
export const lineIdFor = (
	slug: string,
	selections: readonly CartSelection[] | null | undefined
): string => {
	const signature = canonicalSelectionSignature(selections);
	return signature ? `${slug}#${signature}` : slug;
};

/** Texto legible de las opciones elegidas, para descripciones de pedido/Stripe. */
export const describeSelections = (selections: readonly ResolvedSelection[]): string =>
	selections.map((selection) => `${selection.groupName}: ${selection.optionLabel}`).join(', ');

/**
 * Calcula el precio efectivo (céntimos enteros) validando las selecciones contra
 * el producto real. Rechaza: grupos duplicados, opciones/grupos inexistentes y
 * grupos obligatorios sin elegir. Nunca lee importes del cliente.
 */
export const computeEffectiveUnitAmountCents = (
	product: PricingProduct,
	selections: readonly CartSelection[] | null | undefined
): EffectivePriceResult => {
	const groups = Array.isArray(product.variantGroups) ? product.variantGroups : [];
	const rawSelections = Array.isArray(selections) ? selections : [];

	const chosenByGroup = new Map<string, string>();
	for (const selection of rawSelections) {
		const groupName = normalizeText(selection?.groupName);
		const optionLabel = normalizeText(selection?.optionLabel);
		if (!groupName || !optionLabel) {
			return { ok: false, error: 'Selección de opción inválida.' };
		}

		const groupKey = groupName.toLowerCase();
		if (chosenByGroup.has(groupKey)) {
			return { ok: false, error: `Has elegido dos opciones para "${groupName}".` };
		}
		chosenByGroup.set(groupKey, optionLabel);
	}

	let amountCents = Math.round(product.price * 100);
	const resolved: ResolvedSelection[] = [];

	for (const [groupKey, optionLabel] of chosenByGroup) {
		const group = groups.find((candidate) => candidate.name.trim().toLowerCase() === groupKey);
		if (!group) {
			return { ok: false, error: 'La opción seleccionada ya no está disponible.' };
		}

		const optionKey = optionLabel.toLowerCase();
		const option = group.options.find((candidate) => candidate.label.trim().toLowerCase() === optionKey);
		if (!option) {
			return { ok: false, error: `La opción "${optionLabel}" no existe en "${group.name}".` };
		}

		amountCents += Math.max(0, Math.round(option.priceModifier * 100));
		resolved.push({
			groupName: group.name,
			optionLabel: option.label,
			priceModifier: Math.max(0, option.priceModifier)
		});
	}

	for (const group of groups) {
		if (group.required && !chosenByGroup.has(group.name.trim().toLowerCase())) {
			return { ok: false, error: `Debes elegir una opción de "${group.name}".` };
		}
	}

	if (!Number.isFinite(amountCents) || amountCents < 1) {
		return { ok: false, error: 'El precio del producto no es válido.' };
	}

	resolved.sort((a, b) => a.groupName.localeCompare(b.groupName));
	return { ok: true, amountCents, resolved };
};
