import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { dev } from '$app/environment';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const MAINTENANCE_BYPASS_COOKIE = 'selvatic_maintenance_bypass';
const MAINTENANCE_BYPASS_TTL_SECONDS = 60 * 60;
const ACCESS_API_VERSION = '2025-07-11';

type MaintenanceBypassPayload = {
	userId: string;
	exp: number;
};

type AccessApiUserResponse = {
	memberships?: Array<{
		resourceType?: string;
		resourceId?: string;
		roleNames?: string[];
	}>;
};

const toBase64Url = (value: string): string => Buffer.from(value, 'utf8').toString('base64url');
const fromBase64Url = (value: string): string => Buffer.from(value, 'base64url').toString('utf8');

const projectId = (privateEnv.SANITY_PROJECT_ID || publicEnv.PUBLIC_SANITY_PROJECT_ID || '').trim();
const dataset = (privateEnv.SANITY_DATASET || publicEnv.PUBLIC_SANITY_DATASET || 'production').trim();

const fallbackStudioUrl = (appOrigin?: string): string => {
	if (appOrigin && !/localhost:5173|127\.0\.0\.1:5173/.test(appOrigin)) {
		return `${appOrigin.replace(/\/$/, '')}/admin/`;
	}

	const appUrl = (publicEnv.PUBLIC_APP_URL || '').trim();

	if (appUrl) {
		try {
			const url = new URL(appUrl);
			url.port = '3333';
			return url.origin;
		} catch {
			return 'http://localhost:3333';
		}
	}

	return 'http://localhost:3333';
};

const signingSecret =
	privateEnv.MAINTENANCE_BYPASS_SECRET?.trim() ||
	privateEnv.SANITY_WRITE_TOKEN?.trim() ||
	privateEnv.SANITY_READ_TOKEN?.trim() ||
	randomBytes(32).toString('hex');

const sign = (payload: string): string =>
	createHmac('sha256', signingSecret).update(payload).digest('base64url');

export const getSanityStudioUrl = (appOrigin?: string): string =>
	(privateEnv.SANITY_STUDIO_URL || publicEnv.PUBLIC_SANITY_STUDIO_URL || '').trim() ||
	fallbackStudioUrl(appOrigin);

export const createMaintenanceBypassCookieValue = (userId: string): string => {
	const payload: MaintenanceBypassPayload = {
		userId,
		exp: Math.floor(Date.now() / 1000) + MAINTENANCE_BYPASS_TTL_SECONDS
	};

	const encodedPayload = toBase64Url(JSON.stringify(payload));
	const encodedSignature = sign(encodedPayload);
	return `${encodedPayload}.${encodedSignature}`;
};

export const verifyMaintenanceBypassCookieValue = (
	value: string | undefined | null
): MaintenanceBypassPayload | null => {
	if (!value) {
		return null;
	}

	const [encodedPayload, encodedSignature] = value.split('.');
	if (!encodedPayload || !encodedSignature) {
		return null;
	}

	const expectedSignature = sign(encodedPayload);
	const expectedBuffer = Buffer.from(expectedSignature);
	const signatureBuffer = Buffer.from(encodedSignature);

	if (expectedBuffer.length !== signatureBuffer.length) {
		return null;
	}

	if (!timingSafeEqual(expectedBuffer, signatureBuffer)) {
		return null;
	}

	try {
		const payload = JSON.parse(fromBase64Url(encodedPayload)) as MaintenanceBypassPayload;
		if (!payload.userId || !payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
			return null;
		}

		return payload;
	} catch {
		return null;
	}
};

export const maintenanceBypassCookieOptions = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: !dev,
	maxAge: MAINTENANCE_BYPASS_TTL_SECONDS
};

export const clearMaintenanceBypassCookieOptions = {
	...maintenanceBypassCookieOptions,
	maxAge: 0
};

export const sanitizeReturnPath = (value: string | null | undefined): string => {
	if (!value || typeof value !== 'string') {
		return '/';
	}

	if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/api/maintenance-access')) {
		return '/';
	}

	return value;
};

export const verifyAdministratorSession = async (token: string, userId: string): Promise<boolean> => {
	if (!projectId || !token || !userId) {
		return false;
	}

	const endpoint = new URL(
		`https://api.sanity.io/v${ACCESS_API_VERSION}/access/project/${projectId}/users/${userId}`
	);
	endpoint.searchParams.set('includeImpliedRoles', 'true');

	const response = await fetch(endpoint, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		return false;
	}

	const payload = (await response.json()) as AccessApiUserResponse;
	return (
		payload.memberships?.some(
			(membership) =>
				membership.resourceType === 'project' &&
				membership.resourceId === projectId &&
				membership.roleNames?.includes('administrator')
		) ?? false
	);
};
