import type { ContactRequestInput } from '$lib/types';
import { createRequestId } from '$lib/server/logger';
import { sanityMutate } from '../client';
import { externalFetch } from '../shared';

export async function createContactRequest(
	_fetchFn: typeof fetch,
	input: ContactRequestInput,
	requestId = createRequestId()
): Promise<void> {
	const scope = 'sanity.createContactRequest';
	const contactDoc = {
		_type: 'contactRequest',
		name: input.name,
		email: input.email,
		phone: input.phone,
		service: input.service,
		message: input.message,
		sourcePage: input.sourcePage ?? '/contacto',
		status: 'new',
		receivedAt: new Date().toISOString()
	};

	await sanityMutate(externalFetch, [{ create: contactDoc }], { scope, requestId });
}
