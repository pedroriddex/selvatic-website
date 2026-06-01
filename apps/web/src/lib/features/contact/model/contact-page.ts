export type ContactFormState = {
	success?: boolean;
	message?: string;
	errors?: {
		name?: string[];
		email?: string[];
		phone?: string[];
		service?: string[];
		message?: string[];
	};
	values?: {
		name?: string;
		email?: string;
		phone?: string;
		service?: string;
		message?: string;
	};
};

export const CONTACT_PROCESS_STEPS = [
	'1. Escuchamos la idea, el uso del espacio y el timing del proyecto.',
	'2. Preparamos una propuesta floral y un presupuesto personalizado.',
	'3. Seleccionamos producto, producimos y acompañamos hasta la entrega final.'
] as const;
