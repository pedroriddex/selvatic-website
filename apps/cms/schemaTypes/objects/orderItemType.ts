import { defineField, defineType } from 'sanity';
import { OrderItemIcon } from '../shared/icons';

export const orderItemType = defineType({
	name: 'orderItem',
	title: 'Línea de pedido',
	icon: OrderItemIcon,
	type: 'object',
	fields: [
		defineField({ name: 'description', title: 'Descripción', type: 'string' }),
		defineField({ name: 'quantity', title: 'Cantidad', type: 'number' }),
		defineField({ name: 'amountSubtotal', title: 'Subtotal', type: 'number' }),
		defineField({ name: 'amountTotal', title: 'Total', type: 'number' }),
		defineField({ name: 'unitAmount', title: 'Precio unitario', type: 'number' }),
		defineField({ name: 'currency', title: 'Moneda', type: 'string' }),
		defineField({ name: 'stripePriceId', title: 'Stripe Price ID', type: 'string' }),
		defineField({ name: 'stripeProductId', title: 'Stripe Product ID', type: 'string' })
	]
});
