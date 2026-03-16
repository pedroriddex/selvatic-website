const formatterCache = new Map<string, Intl.NumberFormat>();

const getFormatter = (locale: string, currency: string): Intl.NumberFormat => {
	const key = `${locale}:${currency}`;
	const cachedFormatter = formatterCache.get(key);

	if (cachedFormatter) {
		return cachedFormatter;
	}

	const formatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});

	formatterCache.set(key, formatter);

	return formatter;
};

export const formatCurrency = (amount: number, currency = 'EUR', locale = 'es-ES'): string => {
	const safeAmount = Number.isFinite(amount) ? amount : 0;
	const normalizedCurrency = currency.trim().toUpperCase() || 'EUR';

	try {
		return getFormatter(locale, normalizedCurrency).format(safeAmount);
	} catch {
		return `€${safeAmount.toFixed(2)}`;
	}
};
