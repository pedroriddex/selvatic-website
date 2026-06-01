import {
	MAINTENANCE_BYPASS_COOKIE,
	createMaintenanceBypassCookieValue,
	maintenanceBypassCookieOptions,
	verifyAdministratorSession
} from '$lib/server/maintenance-access';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, cookies }) => {
	const payload = (await request.json().catch(() => null)) as { token?: string; userId?: string } | null;
	const token = payload?.token?.trim();
	const userId = payload?.userId?.trim();

	if (!token || !userId) {
		return json({ ok: false }, { status: 400 });
	}

	const isAdministrator = await verifyAdministratorSession(token, userId);
	if (!isAdministrator) {
		return json({ ok: false }, { status: 403 });
	}

	cookies.set(MAINTENANCE_BYPASS_COOKIE, createMaintenanceBypassCookieValue(userId), maintenanceBypassCookieOptions);
	return json({ ok: true });
};

