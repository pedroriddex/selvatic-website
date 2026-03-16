export const getFeaturedProductSpan = (index: number): string => {
	if (index === 0) {
		return 'col-span-4 md:col-span-8 xl:col-span-8';
	}

	return 'col-span-4 md:col-span-4 xl:col-span-4';
};

export const getBestSellerProductSpan = (index: number): string => {
	if (index === 0) {
		return 'col-span-4 md:col-span-8 xl:col-span-6';
	}

	return 'col-span-4 md:col-span-4 xl:col-span-3';
};

export const getCatalogProductSpan = (index: number): string => {
	if (index % 7 === 0) {
		return 'col-span-4 md:col-span-8 xl:col-span-6';
	}

	if (index % 5 === 0) {
		return 'col-span-4 md:col-span-4 xl:col-span-6';
	}

	return 'col-span-4 md:col-span-4 xl:col-span-3';
};

export const getRelatedProductSpan = (index: number): string => {
	if (index === 0) {
		return 'col-span-4 md:col-span-8 xl:col-span-6';
	}

	return 'col-span-4 md:col-span-4 xl:col-span-3';
};
