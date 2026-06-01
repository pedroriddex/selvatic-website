export interface ContactRequestInput {
	name: string;
	email: string;
	phone?: string;
	service?: string;
	message: string;
	sourcePage?: string;
}
