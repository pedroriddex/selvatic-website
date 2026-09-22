import { useCallback } from 'react';
import { set, type FormPatch, type PatchEvent, type StringInputProps } from 'sanity';

// Input para los textos de página: al vaciar un campo, el Studio por defecto
// hace `unset` (elimina el campo del documento). Como la web rellena los
// campos AUSENTES con el texto de serie, borrar un texto lo "resucitaba" al
// publicar. Este input convierte ese unset en `set('')`: el vacío queda
// guardado como decisión editorial y la web lo respeta (no muestra nada).

type OnChangeArg = FormPatch | FormPatch[] | PatchEvent;

const isPatchEvent = (value: OnChangeArg): value is PatchEvent =>
	typeof value === 'object' && value !== null && 'patches' in value;

const keepEmpty = (patch: FormPatch): FormPatch =>
	patch.type === 'unset' && (patch.path?.length ?? 0) === 0 ? set('') : patch;

export function KeepEmptyTextInput(props: StringInputProps) {
	const { onChange } = props;

	const handleChange = useCallback(
		(change: OnChangeArg) => {
			const patches = isPatchEvent(change) ? change.patches : Array.isArray(change) ? change : [change];
			onChange(patches.map(keepEmpty));
		},
		[onChange]
	);

	return props.renderDefault({ ...props, onChange: handleChange });
}
