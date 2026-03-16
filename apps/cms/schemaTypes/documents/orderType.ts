import { defineField, defineType } from 'sanity';

export const orderType = defineType({
	name: 'order',
	title: 'Pedidos',
	type: 'document',
	fields: [
		defineField({ name: 'orderNumber', title: 'Número de pedido', type: 'string', validation: (rule) => rule.required() }),
		defineField({ name: 'stripeSessionId', title: 'Stripe Session ID', type: 'string' }),
		defineField({ name: 'stripePaymentIntentId', title: 'Stripe Payment Intent ID', type: 'string' }),
		defineField({ name: 'customerEmail', title: 'Email cliente', type: 'string' }),
		defineField({ name: 'amountTotal', title: 'Importe total', type: 'number' }),
		defineField({ name: 'currency', title: 'Moneda', type: 'string' }),
		defineField({ name: 'status', title: 'Estado', type: 'string' }),
		defineField({ name: 'items', title: 'Líneas', type: 'array', of: [{ type: 'orderItem' }] }),
		defineField({ name: 'metadata', title: 'Metadata JSON', type: 'text' }),
		defineField({ name: 'paidAt', title: 'Pagado en', type: 'datetime' }),
		defineField({ name: 'receivedAt', title: 'Recibido en', type: 'datetime' })
	],
	preview: {
		select: {
			title: 'orderNumber',
			subtitle: 'customerEmail'
		}
	}
});
