import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		host: '0.0.0.0',
		port: 4173
	},
	preview: {
		host: '0.0.0.0',
		port: 4173
	},
	plugins: [tailwindcss(), sveltekit()]
});
