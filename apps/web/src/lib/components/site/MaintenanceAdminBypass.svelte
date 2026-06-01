<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		studioUrl: string;
		returnTo: string;
		mode: 'claim' | 'verify';
	};

	type BridgeResponse = {
		type: 'selvatic:admin-bypass:response';
		requestId: string;
		admin: boolean;
		userId: string | null;
		token: string | null;
	};

	let { studioUrl, returnTo, mode }: Props = $props();

	let iframeElement: HTMLIFrameElement | null = null;
	let bridgeRequestId = '';

	const claimAccess = async (token: string, userId: string) => {
		const response = await fetch('/api/maintenance-access/claim', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ token, userId })
		});

		return response.ok;
	};

	const revokeAccess = async () => {
		await fetch('/api/maintenance-access/revoke', {
			method: 'POST'
		});
	};

	onMount(() => {
		if (typeof window === 'undefined' || !studioUrl) {
			return;
		}

		const resolvedStudioUrl = new URL(studioUrl, window.location.origin);
		const targetOrigin = resolvedStudioUrl.origin;
		bridgeRequestId = crypto.randomUUID();
		let completed = false;

		const redirectToTarget = () => {
			window.location.href = returnTo;
		};

		const redirectToMaintenance = () => {
			const currentPath = `${window.location.pathname}${window.location.search}`;
			window.location.href = `/mantenimiento?from=${encodeURIComponent(currentPath)}`;
		};

		const handleMessage = async (event: MessageEvent<BridgeResponse>) => {
			if (event.origin !== targetOrigin) {
				return;
			}

			if (!event.data || event.data.type !== 'selvatic:admin-bypass:response' || event.data.requestId !== bridgeRequestId) {
				return;
			}

			completed = true;

			if (mode === 'claim') {
				if (event.data.admin && event.data.token && event.data.userId) {
					const ok = await claimAccess(event.data.token, event.data.userId);
					if (ok) {
						redirectToTarget();
					}
				}

				return;
			}

			if (event.data.admin && event.data.token && event.data.userId) {
				await claimAccess(event.data.token, event.data.userId);
				return;
			}

			await revokeAccess();
			redirectToMaintenance();
		};

		const postRequest = () => {
			if (!iframeElement?.contentWindow) {
				return;
			}

			iframeElement.contentWindow.postMessage(
				{
					type: 'selvatic:admin-bypass:request',
					requestId: bridgeRequestId
				},
				targetOrigin
			);
		};

		const timeout = window.setTimeout(async () => {
			if (completed || mode !== 'verify') {
				return;
			}

			await revokeAccess();
			redirectToMaintenance();
		}, 3000);

		window.addEventListener('message', handleMessage);

		if (iframeElement?.contentWindow) {
			postRequest();
		}

		return () => {
			window.clearTimeout(timeout);
			window.removeEventListener('message', handleMessage);
		};
	});
</script>

<iframe
	bind:this={iframeElement}
	src={studioUrl}
	title="Sanity admin bridge"
	class="hidden"
	tabindex="-1"
	aria-hidden="true"
	onload={() => {
		if (!bridgeRequestId || !iframeElement?.contentWindow) {
			return;
		}

		iframeElement.contentWindow.postMessage(
			{
				type: 'selvatic:admin-bypass:request',
				requestId: bridgeRequestId
			},
			new URL(studioUrl, window.location.origin).origin
		);
	}}
></iframe>
