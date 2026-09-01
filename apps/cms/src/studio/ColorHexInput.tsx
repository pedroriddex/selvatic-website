import { useCallback, useEffect, useId, useState } from 'react';
import { Card, Flex, Stack, Text, TextInput } from '@sanity/ui';
import { set, unset, type ObjectInputProps } from 'sanity';

// Input de color propio (sustituye al de @sanity/color-input, cuyo render
// falla en los builds de producción del Studio). Guarda el mismo formato de
// dato ({_type: 'color', hex}), así la web no necesita cambios.

const HEX_PATTERN = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const normalizeHex = (raw: string): string | null => {
	const value = raw.trim();
	if (!HEX_PATTERN.test(value)) {
		return null;
	}

	const hex = value.startsWith('#') ? value.slice(1) : value;
	const expanded =
		hex.length === 3
			? hex
					.split('')
					.map((char) => `${char}${char}`)
					.join('')
			: hex;
	return `#${expanded.toUpperCase()}`;
};

export function ColorHexInput(props: ObjectInputProps) {
	const { value, onChange, readOnly, elementProps } = props;
	const hex = typeof value?.hex === 'string' ? value.hex : '';
	const pickerId = useId();
	const [draft, setDraft] = useState(hex);

	useEffect(() => {
		setDraft(hex);
	}, [hex]);

	const commitHex = useCallback(
		(nextRaw: string) => {
			const normalized = normalizeHex(nextRaw);
			if (!normalized) {
				return;
			}

			onChange(set({ _type: 'color', hex: normalized }));
		},
		[onChange]
	);

	const handleTextChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const raw = event.currentTarget.value;
			setDraft(raw);

			if (raw.trim() === '') {
				onChange(unset());
				return;
			}

			commitHex(raw);
		},
		[commitHex, onChange]
	);

	return (
		<Card border padding={2} radius={2}>
			<Flex align="center" gap={3}>
				<label htmlFor={pickerId} style={{ cursor: readOnly ? 'default' : 'pointer' }}>
					<Card
						radius={2}
						shadow={1}
						style={{
							width: 64,
							height: 40,
							background: hex || 'repeating-conic-gradient(#e2e2e2 0% 25%, #ffffff 0% 50%) 50% / 12px 12px',
							border: '1px solid rgba(0,0,0,0.15)'
						}}
					/>
					<input
						id={pickerId}
						type="color"
						value={normalizeHex(hex) ?? '#ffffff'}
						disabled={Boolean(readOnly)}
						onChange={(event) => commitHex(event.currentTarget.value)}
						style={{
							position: 'absolute',
							width: 1,
							height: 1,
							opacity: 0,
							pointerEvents: 'none'
						}}
					/>
				</label>
				<Stack space={2} flex={1}>
					<TextInput
						{...elementProps}
						value={draft}
						placeholder="#000000"
						readOnly={Boolean(readOnly)}
						onChange={handleTextChange}
					/>
					<Text size={1} muted>
						{hex ? `Color actual: ${hex}` : 'Sin color definido (se usa el de serie de la web).'}
					</Text>
				</Stack>
			</Flex>
		</Card>
	);
}
