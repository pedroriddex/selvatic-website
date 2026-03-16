import { expect, test } from '@playwright/test';

test('home renders hero content', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Shop now' })).toBeVisible();
});

test('shop route renders section heading', async ({ page }) => {
	await page.goto('/tienda');
	await expect(page.getByRole('heading', { name: 'Productos' })).toBeVisible();
});

test('checkout renders cart summary from localStorage', async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem(
			'selvatic-cart-v1',
			JSON.stringify([
				{
					slug: 'demo-product',
					name: 'Producto Demo',
					imageUrl: '',
					price: 29,
					currency: 'EUR',
					stock: 5,
					quantity: 1
				}
			])
		);
	});

	await page.goto('/checkout');
	await expect(page.getByRole('heading', { name: 'Carrito' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Ir a Stripe' })).toBeVisible();
});

test('contact form validates required fields', async ({ page }) => {
	await page.goto('/contacto');
	await page.getByLabel('Nombre').fill('Pe');
	await page.getByLabel('Email').fill('test@selvatic.com');
	await page.getByLabel('Mensaje').fill('Hola');
	await page.getByRole('button', { name: 'Enviar solicitud' }).click();
	await expect(page.getByText('Revisa los campos del formulario.')).toBeVisible();
});
