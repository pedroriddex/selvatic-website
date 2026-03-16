# Selvatic Web (SvelteKit)

Frontend de Selvatic con SvelteKit, TailwindCSS, Stripe Checkout y consumo de contenido desde Sanity.

## Entorno

```bash
cp .env.example .env
```

Variables clave:

- `SANITY_PROJECT_ID` / `PUBLIC_SANITY_PROJECT_ID`
- `SANITY_DATASET` / `PUBLIC_SANITY_DATASET`
- `SANITY_READ_TOKEN` (opcional, si el dataset no es público)
- `SANITY_WRITE_TOKEN` (contacto + persistencia de pedidos)
- `STRIPE_SECRET_KEY`
- `PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PUBLIC_APP_URL`

## Media manual global

1. Sube assets a `static/media/`.
2. Configura rutas/imports en `src/lib/config/site-media.ts`.

## Scripts

```bash
npm run dev
npm run check
npm run build
npm run preview
npm run test
npm run test:unit
npm run test:e2e
```

## Calidad

- `test`: ejecuta unit tests (stores, utilidades y capa de datos Sanity).
- `test:e2e`: smoke básico de rutas clave (`/`, `/tienda`, `/checkout`, `/contacto`) con Playwright.

Antes del primer `test:e2e` instala navegador:

```bash
npx playwright install chromium
```
