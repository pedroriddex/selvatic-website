import { useEffect, useState } from 'react';
import { useCurrentUser, useWorkspace, userHasRole } from 'sanity';

const getFrontendOrigins = () =>
	(
		process.env.SANITY_STUDIO_FRONTEND_ORIGINS ||
		process.env.PUBLIC_APP_URL ||
		'http://localhost:5173,http://127.0.0.1:5173'
	)
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean);

const getAllowedOrigins = (configuredOrigins: string[]) => {
	const runtimeOrigin =
		typeof window !== 'undefined' && window.location.origin ? [window.location.origin] : [];

	return [...new Set([...configuredOrigins, ...runtimeOrigin])];
};

export function StudioAdminBridge() {
	const workspace = useWorkspace();
	const currentUser = useCurrentUser();
	const [authToken, setAuthToken] = useState<string | null>(null);
	const frontendOrigins = getFrontendOrigins();

	useEffect(() => {
		const token$ = workspace.auth.token;
		if (!token$) {
			setAuthToken(null);
			return;
		}

		const subscription = token$.subscribe((nextToken) => {
			setAuthToken(nextToken);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [workspace]);

	useEffect(() => {
		const allowedOrigins = new Set(getAllowedOrigins(frontendOrigins));

		const handleMessage = (event: MessageEvent) => {
			if (!allowedOrigins.has(event.origin)) {
				return;
			}

			if (!event.data || event.data.type !== 'selvatic:admin-bypass:request') {
				return;
			}

			const source = event.source as WindowProxy | null;
			if (!source) {
				return;
			}

			const isAdministrator = userHasRole(currentUser, 'administrator');

			source.postMessage(
				{
					type: 'selvatic:admin-bypass:response',
					requestId: event.data.requestId,
					admin: isAdministrator,
					userId: currentUser?.id ?? null,
					token: isAdministrator ? authToken : null
				},
				event.origin
			);
		};

		window.addEventListener('message', handleMessage);
		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, [authToken, currentUser, frontendOrigins]);

	return null;
}
