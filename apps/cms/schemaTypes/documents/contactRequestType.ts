import { defineField, defineType } from 'sanity';
import { ContactRequestIcon } from '../shared/icons';

export const contactRequestType = defineType({
	name: 'contactRequest',
	title: 'Solicitudes de contacto',
	icon: ContactRequestIcon,
	type: 'document',
	fields: [
		defineField({ name: 'name', title: 'Nombre', type: 'string', validation: (rule) => rule.required().min(2) }),
		defineField({ name: 'email', title: 'Email', type: 'string', validation: (rule) => rule.required().email() }),
		defineField({ name: 'phone', title: 'Teléfono', type: 'string' }),
		defineField({ name: 'service', title: 'Servicio', type: 'string' }),
		defineField({ name: 'message', title: 'Mensaje', type: 'text', validation: (rule) => rule.required().min(12) }),
		defineField({ name: 'sourcePage', title: 'Página de origen', type: 'string' }),
		defineField({ name: 'status', title: 'Estado', type: 'string', initialValue: 'new' }),
		defineField({ name: 'receivedAt', title: 'Recibido en', type: 'datetime', initialValue: () => new Date().toISOString() })
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'email'
		}
	}
});
