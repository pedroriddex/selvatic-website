# Selvatic CMS (Sanity Studio)

Panel editorial de Selvatic basado en Sanity.
Este proyecto usa exclusivamente Sanity Studio (sin legado Strapi).

## Variables de entorno

```bash
cp .env.example .env
```

Configura:

- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_TITLE` (opcional)

## Tipos de contenido activos

- `product`
- `service`
- `contactRequest`
- `order`

## Desarrollo

```bash
npm install
npm run dev
```

Studio: [http://localhost:3333](http://localhost:3333)

## Build

```bash
npm run build
```
