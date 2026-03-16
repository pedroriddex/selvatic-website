import type { CSSProperties } from 'react';
import studioFavicon from '../../favicon.png';

const containerStyles: CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	gap: 10
};

const imageStyles: CSSProperties = {
	width: 24,
	height: 24,
	borderRadius: 6,
	objectFit: 'cover',
	boxShadow: '0 0 0 1px rgba(228, 238, 221, 0.25)'
};

const wordmarkStyles: CSSProperties = {
	fontFamily: 'Manrope, system-ui, sans-serif',
	fontSize: 14,
	fontWeight: 700,
	letterSpacing: '0.12em',
	textTransform: 'uppercase'
};

export function StudioLogo() {
	return (
		<span style={containerStyles}>
			<img src={studioFavicon} alt="Selvatic" style={imageStyles} />
			<span style={wordmarkStyles}>Selvatic</span>
		</span>
	);
}
