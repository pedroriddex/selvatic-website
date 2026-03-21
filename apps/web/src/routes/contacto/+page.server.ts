import { createContactRequest, getServicesResult } from '$lib/server/sanity';
import { toAppError } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const contactSchema = z.object({
	name: z.string().trim().min(2, 'El nombre es obligatorio.'),
	email: z.email('Correo no válido.'),
	phone: z.string().trim().max(30).optional(),
	service: z.string().trim().max(120).optional(),
	message: z.string().trim().min(12, 'Cuéntanos un poco más sobre tu necesidad.'),
	sourcePage: z.string().trim().default('/contacto')
});

export const load = (async ({ fetch }) => {
	const requestId = createRequestId();
	const servicesResult = await getServicesResult(fetch, requestId);

	return {
		services: servicesResult.services,
		dataHealth: servicesResult.dataHealth
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, fetch }) => {
		const requestId = createRequestId();
		const formData = await request.formData();
		const payload = {
			name: String(formData.get('name') ?? ''),
			email: String(formData.get('email') ?? ''),
			phone: String(formData.get('phone') ?? ''),
			service: String(formData.get('service') ?? ''),
			message: String(formData.get('message') ?? ''),
			sourcePage: '/contacto'
		};

		const parsed = contactSchema.safeParse(payload);
		if (!parsed.success) {
			return fail(400, {
				success: false,
				message: 'Revisa los campos del formulario.',
				errors: parsed.error.flatten().fieldErrors,
				values: payload
			});
		}

		try {
			await createContactRequest(fetch, parsed.data, requestId);
			return {
				success: true,
				message: 'Mensaje enviado. Te responderemos lo antes posible.'
			};
		} catch (error) {
			const normalized = toAppError(error, {
				scope: 'contacto.action.createContactRequest',
				requestId,
				message: 'No se pudo enviar el formulario en este momento.'
			});

			logger.error(normalized, {
				scope: 'contacto.action.createContactRequest',
				requestId
			});

			return fail(500, {
				success: false,
				message:
					normalized.code === 'CONFIG'
						? 'El formulario no está disponible temporalmente.'
						: 'No se pudo guardar el mensaje en este momento. Inténtalo de nuevo.',
				requestId
			});
		}
	}
} satisfies Actions;
