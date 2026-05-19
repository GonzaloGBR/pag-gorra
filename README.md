# MLCAPS — tienda de gorras

Sitio estático con **Astro 6**, **TypeScript**, **Tailwind CSS 4** y **Node.js 22+**.

## Concepto

- Pantalla inicial: **lienzo infinito** de gorras en todas direcciones.
- Solo puedes desplazarte donde hay gorras (límites del bounding box del catálogo).
- Clic en una gorra → ficha de producto.

## Requisitos

- Node.js **≥ 22.12.0**

## Comandos

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

## Despliegue en Vercel

1. Importa el repositorio [github.com/GonzaloGBR/pag-gorra](https://github.com/GonzaloGBR/pag-gorra) en [Vercel](https://vercel.com/new).
2. Vercel detecta **Astro** automáticamente (`vercel.json` ya define build y salida).
3. **Build command:** `npm run build` · **Output directory:** `dist` · **Node.js:** 22.x (`.node-version`).

No hace falta variables de entorno para el sitio estático actual. Tras el deploy, las rutas `/` y `/producto/*` funcionan como en build local.

## Estructura

```
src/
  components/     # Nav, Footer, InfiniteCapCanvas
  data/products.ts
  layouts/
  lib/            # whatsapp, site, infinite-canvas
  pages/
public/images/    # logo y PNG de gorras
scripts/          # re-export Stitch (opcional)
```

## Referencia de diseño (local)

El export de Google Stitch vive en `stitch-mlcaps/` (ignorado por git salvo el README). Para regenerarlo:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/download-stitch-mlcaps.ps1
```
