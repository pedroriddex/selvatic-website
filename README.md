# Selvatic

Workspace monorepo de **Selvatic** con:

- `Sanity Studio` para contenido de negocio (productos, servicios, contactos, pedidos)
- `SvelteKit` para frontend
- `TailwindCSS` para estilos
- `RemixIcon` para iconografía
- `Stripe` para checkout alojado

## Estructura

- `apps/cms`: Sanity Studio
- `apps/web`: frontend SvelteKit

## Requisitos

- Node.js `20.x` o superior
- npm `10.x` o superior

## Configuración inicial

1. Copia variables de entorno:

```bash
cp apps/cms/.env.example apps/cms/.env
cp apps/web/.env.example apps/web/.env
```

2. Configura llaves y URLs:

- `apps/cms/.env`
  - `SANITY_STUDIO_PROJECT_ID`
  - `SANITY_STUDIO_DATASET`
  - `SANITY_STUDIO_TITLE` (opcional)
- `apps/web/.env`
  - `SANITY_PROJECT_ID` / `PUBLIC_SANITY_PROJECT_ID`
  - `SANITY_DATASET` / `PUBLIC_SANITY_DATASET`
  - `SANITY_WRITE_TOKEN` (contacto + persistencia de pedidos)
  - `STRIPE_SECRET_KEY`
  - `PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `PUBLIC_APP_URL`

3. Instala dependencias:

```bash
npm install --prefix apps/cms
npm install --prefix apps/web
```

4. Inicia el workspace:

```bash
npm run dev
```

- CMS: [http://localhost:3333](http://localhost:3333)
- Web: [http://localhost:5173](http://localhost:5173)

## Flujo recomendado

1. Crea contenido en Sanity:
   - `product`
   - `service`
2. Configura media global manual del frontend:
   - guarda assets en `apps/web/static/media/`
   - referencia URLs/imports en `apps/web/src/lib/config/site-media.ts`
3. Sincroniza productos en Stripe:

```bash
npm run stripe:seed-products
```

4. Prueba checkout y webhook:
   - `/checkout`
   - `/api/stripe/webhook`

## Scripts

- `npm run dev`: levanta CMS y web
- `npm run dev:cms`: levanta solo Sanity Studio
- `npm run dev:web`: levanta solo SvelteKit
- `npm run check`: type-check del frontend
- `npm run build`: build de ambos proyectos
- `npm run test`: tests unitarios del frontend
- `npm run test:unit`: alias explícito de tests unitarios
- `npm run test:e2e`: smoke E2E con Playwright
- `npm run stripe:seed-products`: crea/actualiza catálogo en Stripe desde Sanity
