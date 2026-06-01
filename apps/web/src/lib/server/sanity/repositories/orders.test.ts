import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppException } from '$lib/server/errors';

const sanityMutate = vi.fn();
const sanityQuery = vi.fn();

vi.mock('../client', () => ({
	sanityMutate: (...args: unknown[]) => sanityMutate(...args),
	sanityQuery: (...args: unknown[]) => sanityQuery(...args)
}));

vi.mock('$lib/server/logger', () => ({
	createRequestId: () => 'req-test',
	logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}));

import { createOrderFromCheckoutSession, parseCartMetadata } from './orders';

const fakeFetch = (() => undefined) as unknown as typeof fetch;

type SessionOverrides = Partial<Record<string, unknown>>;

function buildSession(overrides: SessionOverrides = {}) {
	return {
		id: 'cs_test_123',
		payment_status: 'paid',
		payment_intent: 'pi_1',
		amount_total: 3390,
		currency: 'eur',
		customer_details: { email: 'cliente@selvatic.com' },
		metadata: { cartItems: 'ramo-rosa:2|planta-mini:1' },
		...overrides
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any;
}

const ORDER_ID = 'order.cs_test_123';

beforeEach(() => {
	sanityMutate.mockReset();
	sanityQuery.mockReset();
	sanityMutate.mockResolvedValue(undefined);
});

describe('parseCartMetadata', () => {
	it('convierte "slug:cantidad" en un mapa', () => {
		expect(parseCartMetadata('ramo-rosa:2|planta-mini:1')).toEqual(
			new Map([
				['ramo-rosa', 2],
				['planta-mini', 1]
			])
		);
	});

	it('agrega cantidades del mismo slug', () => {
		expect(parseCartMetadata('ramo-rosa:2|ramo-rosa:3')).toEqual(new Map([['ramo-rosa', 5]]));
	});

	it('ignora entradas vacías o mal formadas', () => {
		expect(parseCartMetadata('')).toEqual(new Map());
		expect(parseCartMetadata(undefined)).toEqual(new Map());
		expect(parseCartMetadata('a:|:5|b:-1|c:0|d:abc')).toEqual(new Map());
	});
});

describe('createOrderFromCheckoutSession', () => {
	it('crea el pedido de forma idempotente y descuenta el stock una vez', async () => {
		sanityQuery
			.mockResolvedValueOnce({ _rev: 'rev1', inventoryAdjusted: false })
			.mockResolvedValueOnce([
				{ _id: 'p1', slug: 'ramo-rosa' },
				{ _id: 'p2', slug: 'planta-mini' }
			]);

		await createOrderFromCheckoutSession(fakeFetch, buildSession(), [], 'req-1');

		expect(sanityMutate).toHaveBeenCalledTimes(2);

		// 1ª mutación: createIfNotExists con _id determinista.
		const createMutations = sanityMutate.mock.calls[0][1];
		expect(createMutations[0].createIfNotExists._id).toBe(ORDER_ID);
		expect(createMutations[0].createIfNotExists.inventoryAdjusted).toBe(false);

		// 2ª mutación: transacción de ajuste con cerrojo ifRevisionID + decrementos.
		const adjustMutations = sanityMutate.mock.calls[1][1];
		expect(adjustMutations[0].patch).toMatchObject({
			id: ORDER_ID,
			ifRevisionID: 'rev1',
			set: { inventoryAdjusted: true }
		});

		const decById = Object.fromEntries(
			adjustMutations
				.slice(1)
				.map((m: { patch: { id: string; dec: { stock: number } } }) => [m.patch.id, m.patch.dec.stock])
		);
		expect(decById).toEqual({ p1: 2, p2: 1 });
	});

	it('no vuelve a descontar stock si el pedido ya estaba ajustado', async () => {
		sanityQuery.mockResolvedValueOnce({ _rev: 'rev1', inventoryAdjusted: true });

		await createOrderFromCheckoutSession(fakeFetch, buildSession(), [], 'req-2');

		// Solo el createIfNotExists; ninguna transacción de ajuste.
		expect(sanityMutate).toHaveBeenCalledTimes(1);
		expect(sanityQuery).toHaveBeenCalledTimes(1);
	});

	it('no toca el inventario para pedidos no pagados', async () => {
		await createOrderFromCheckoutSession(
			fakeFetch,
			buildSession({ payment_status: 'unpaid' }),
			[],
			'req-3'
		);

		expect(sanityMutate).toHaveBeenCalledTimes(1);
		expect(sanityQuery).not.toHaveBeenCalled();
	});

	it('trata un conflicto de revisión (409) como ajuste ya aplicado, sin lanzar', async () => {
		sanityQuery
			.mockResolvedValueOnce({ _rev: 'rev1', inventoryAdjusted: false })
			.mockResolvedValueOnce([{ _id: 'p1', slug: 'ramo-rosa' }]);

		sanityMutate
			.mockResolvedValueOnce(undefined) // createIfNotExists
			.mockRejectedValueOnce(
				new AppException({ code: 'UPSTREAM', scope: 'test', status: 409, message: 'conflict' })
			);

		await expect(
			createOrderFromCheckoutSession(
				fakeFetch,
				buildSession({ metadata: { cartItems: 'ramo-rosa:1' } }),
				[],
				'req-4'
			)
		).resolves.toBeUndefined();
	});
});
