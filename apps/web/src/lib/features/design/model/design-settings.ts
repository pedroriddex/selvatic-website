import type { DesignSettings } from '$lib/types';

export const DEFAULT_DESIGN_SETTINGS: DesignSettings = {
	light: '#EBF1E5',
	dark: '#222D22',
	accent: '#222D22',
	accentHover: '#344034',
	accentInk: '#EBF1E5',
	surface: '#FFFFFF',
	success: '#222D22',
	warning: '#B08B38',
	error: '#9B4B4B'
};

const HEX_COLOR_PATTERN = /^#(?:[\da-f]{3}|[\da-f]{6})$/i;

export const normalizeHexColor = (value: unknown, fallback: string): string => {
	if (typeof value !== 'string') {
		return fallback;
	}

	const normalized = value.trim();
	if (!HEX_COLOR_PATTERN.test(normalized)) {
		return fallback;
	}

	if (normalized.length === 4) {
		const [, r, g, b] = normalized;
		return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
	}

	return normalized.toUpperCase();
};

const hexToRgb = (hex: string): [number, number, number] => {
	const normalized = normalizeHexColor(hex, '#000000').slice(1);
	return [0, 2, 4].map((start) => Number.parseInt(normalized.slice(start, start + 2), 16)) as [
		number,
		number,
		number
	];
};

const cssRgb = (hex: string): string => hexToRgb(hex).join(' ');

export const mergeDesignSettings = (
	settings: Partial<DesignSettings> | null | undefined
): DesignSettings => ({
	light: normalizeHexColor(settings?.light, DEFAULT_DESIGN_SETTINGS.light),
	dark: normalizeHexColor(settings?.dark, DEFAULT_DESIGN_SETTINGS.dark),
	accent: normalizeHexColor(settings?.accent, DEFAULT_DESIGN_SETTINGS.accent),
	accentHover: normalizeHexColor(settings?.accentHover, DEFAULT_DESIGN_SETTINGS.accentHover),
	accentInk: normalizeHexColor(settings?.accentInk, DEFAULT_DESIGN_SETTINGS.accentInk),
	surface: normalizeHexColor(settings?.surface, DEFAULT_DESIGN_SETTINGS.surface),
	success: normalizeHexColor(settings?.success, DEFAULT_DESIGN_SETTINGS.success),
	warning: normalizeHexColor(settings?.warning, DEFAULT_DESIGN_SETTINGS.warning),
	error: normalizeHexColor(settings?.error, DEFAULT_DESIGN_SETTINGS.error)
});

export const toDesignCssVariables = (settings: DesignSettings): string => {
	const design = mergeDesignSettings(settings);

	return `:root{--design-light:${design.light};--design-light-rgb:${cssRgb(design.light)};--design-dark:${design.dark};--design-dark-rgb:${cssRgb(design.dark)};--design-accent:${design.accent};--design-accent-rgb:${cssRgb(design.accent)};--design-accent-hover:${design.accentHover};--design-accent-hover-rgb:${cssRgb(design.accentHover)};--design-accent-ink:${design.accentInk};--design-accent-ink-rgb:${cssRgb(design.accentInk)};--design-surface:${design.surface};--design-surface-rgb:${cssRgb(design.surface)};--design-success:${design.success};--design-success-rgb:${cssRgb(design.success)};--design-warning:${design.warning};--design-warning-rgb:${cssRgb(design.warning)};--design-error:${design.error};--design-error-rgb:${cssRgb(design.error)};}`;
};
