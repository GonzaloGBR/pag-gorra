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
