import {
	DEFAULT_MAINTENANCE_MESSAGE,
	DEFAULT_MAINTENANCE_TITLE,
	MAINTENANCE_ROUTE
} from '$lib/config/site-maintenance';
import { createRequestId } from '$lib/server/logger';
import {
	getSanityStudioUrl,
	MAINTENANCE_BYPASS_COOKIE,
	sanitizeReturnPath,
	verifyMaintenanceBypassCookieValue
} from '$lib/server/maintenance-access';
import { toDesignCssVariables } from '$lib/features/design/model/design-settings';
import { getDesignSettingsResult, getPageContentResult, getSiteSettingsResult } from '$lib/server/sanity';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch, url, cookies }) => {
	const requestId = createRequestId();
	const [siteSettingsResult, designResult, globalContentResult, maintenanceContentResult] =
		await Promise.all([
			getSiteSettingsResult(fetch, requestId),
			getDesignSettingsResult(fetch, requestId),
			getPageContentResult(fetch, 'global', requestId),
			getPageContentResult(fetch, 'maintenance', requestId)
		]);
	const isMaintenanceRoute = url.pathname === MAINTENANCE_ROUTE;
	const returnTo = sanitizeReturnPath(url.searchParams.get('from'));
	const maintenanceEnabled =
		siteSettingsResult.unavailable || siteSettingsResult.settings?.maintenanceMode === true;
	const maintenanceBypass = verifyMaintenanceBypassCookieValue(
		cookies.get(MAINTENANCE_BYPASS_COOKIE)
	);
	const maintenanceScreenActive = maintenanceEnabled && !maintenanceBypass;

	if (maintenanceScreenActive && !isMaintenanceRoute) {
		const nextReturnTo = sanitizeReturnPath(`${url.pathname}${url.search}`);
		throw redirect(307, `${MAINTENANCE_ROUTE}?from=${encodeURIComponent(nextReturnTo)}`);
	}

	if ((!maintenanceEnabled || maintenanceBypass) && isMaintenanceRoute) {
		throw redirect(307, returnTo);
	}

	return {
		design: {
			settings: designResult.settings,
			css: toDesignCssVariables(designResult.settings),
			dataHealth: designResult.dataHealth
		},
		content: {
			global: globalContentResult.page,
			maintenance: maintenanceContentResult.page
		},
		maintenance: {
			active: maintenanceEnabled,
			bypassed: Boolean(maintenanceBypass),
			isMaintenanceRoute,
			title:
				siteSettingsResult.settings?.maintenanceTitle?.trim() || DEFAULT_MAINTENANCE_TITLE,
			message:
				siteSettingsResult.settings?.maintenanceMessage?.trim() || DEFAULT_MAINTENANCE_MESSAGE,
			studioUrl: getSanityStudioUrl(url.origin),
			returnTo
		}
	};
}) satisfies LayoutServerLoad;
