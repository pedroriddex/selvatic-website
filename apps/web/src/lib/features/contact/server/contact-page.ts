import { persistContactRequestFallback } from '$lib/server/contact-request-fallback';
import { toAppError } from '$lib/server/errors';
import { createRequestId, logger } from '$lib/server/logger';
import { createContactRequest, getPageContentResult, getServicesResult } from '$lib/server/sanity';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

const contactSchema = z.object({
	name: z.string().trim().min(2, 'El nombre es obligatorio.'),
	email: z.email('Correo no válido.'),
	phone: z.string().trim().max(30).optional(),
	service: z.string().trim().max(120).optional(),
	message: z.string().trim().min(4, 'El mensaje es obligatorio.'),
	sourcePage: z.string().trim().default('/contacto')
});

export async function loadContactPage(fetchFn: typeof fetch) {
	const requestId = createRequestId();
	const [servicesResult, pageContentResult] = await Promise.all([
		getServicesResult(fetchFn, requestId),
		getPageContentResult(fetchFn, 'contact', requestId)
	]);

	return {
		services: servicesResult.services,
		pageContent: pageContentResult.page,
		dataHealth: servicesResult.dataHealth
	};
}

export const contactPageActions = {
	default: async ({ request, fetch }: { request: Request; fetch: typeof globalThis.fetch }) => {
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

			try {
				const fallbackPath = await persistContactRequestFallback(parsed.data, {
					requestId,
					reason: normalized.code
				});

				logger.warn(
					'contacto.action.persistContactRequestFallback',
					'La solicitud se ha guardado en el almacenamiento local de respaldo.',
					{
						requestId,
						reason: normalized.code,
						fallbackPath
					}
				);

				return {
					success: true,
					message: 'Mensaje enviado. Te responderemos lo antes posible.'
				};
			} catch (fallbackError) {
				logger.error(fallbackError, {
					scope: 'contacto.action.persistContactRequestFallback',
					requestId,
					message: 'No se pudo guardar la solicitud de contacto en el respaldo local.',
					details: {
						originalErrorCode: normalized.code
					}
				});
			}

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
};
