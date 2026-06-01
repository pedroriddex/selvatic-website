import type { LayoutProps } from 'sanity';
import { StudioAdminBridge } from './auth-bridge';

export function StudioLayout(props: LayoutProps) {
	return (
		<>
			<StudioAdminBridge />
			{props.renderDefault(props)}
		</>
	);
}
