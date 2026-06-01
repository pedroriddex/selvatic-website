import {
	clearMaintenanceBypassCookieOptions,
	MAINTENANCE_BYPASS_COOKIE
} from '$lib/server/maintenance-access';
import { json } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
	cookies.set(MAINTENANCE_BYPASS_COOKIE, '', clearMaintenanceBypassCookieOptions);
	return json({ ok: true });
};
