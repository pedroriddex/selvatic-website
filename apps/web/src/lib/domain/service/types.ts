import type { EntityId } from '$lib/domain/product/types';

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
