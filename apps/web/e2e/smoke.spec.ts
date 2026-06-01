import { expect, test } from '@playwright/test';

// Los textos visibles se editan desde el CMS (Sanity), por lo que estas pruebas
// se apoyan en estructura estable (roles, atributos name, href) y no en la copia.

test('home renders hero content', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	// El CTA principal del hero enlaza a la tienda.
	await expect(page.locator('a[href="/tienda"]').first()).toBeVisible();
});

test('shop route renders product catalog', async ({ page }) => {
	await page.goto('/tienda');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
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
	// El artículo del carrito (cliente) se renderiza desde localStorage...
	await expect(page.getByRole('heading', { name: 'Producto Demo' })).toBeVisible();
	// ...y el botón de pago queda habilitado al haber artículos.
	await expect(page.locator('form button[type="submit"]')).toBeEnabled();
});

test('contact form rejects invalid input server-side', async ({ page }) => {
	await page.goto('/contacto');
	// "P" supera el required de HTML5 pero falla la validación de servidor (min 2),
	// ejercitando el camino de error sin persistir nada en Sanity.
	await page.locator('input[name="name"]').fill('P');
	await page.locator('input[name="email"]').fill('test@selvatic.com');
	await page.locator('textarea[name="message"]').fill('Hola');
	await page.locator('form button[type="submit"]').click();
	await expect(page.getByText('Revisa los campos del formulario.')).toBeVisible();
});
