# MLCAPS Infinite Canvas — export Stitch

> Carpeta ignorada por git (solo este README se versiona). Regenera el export localmente con el script indicado abajo.

Proyecto: **MLCAPS Infinite Canvas** (`4080389428660489312`)

Exportado desde la API MCP de Google Stitch (`get_screen` + `curl -L`).

## Estructura

| Carpeta | Pantalla | screenshot | HTML/código |
|---------|----------|------------|-------------|
| `01-catalogo-editorial` | MLCAPS - Catálogo Editorial | ✓ | ✓ `screen.html` |
| `02-design-md` | DESIGN.md (referencia Nike) | — | ✓ `DESIGN.md` + `screen.html` |
| `03-design-system-kinetic-monochrome` | Design System Kinetic Monochrome | — | `DESIGN.md`, `design-system.json` |
| `04-coleccion-delimitada` | MLCAPS - Colección Delimitada | ✓ | ✓ |
| `05-photo-navy-trucker` | Foto gorra navy | ✓ (JPEG) | — |
| `06-photo-beige-vintage` | Foto gorra beige | ✓ | — |
| `07-photo-white-minimal` | Foto gorra blanca | ✓ | — |
| `08-photo-black-baseball` | Foto gorra negra | ✓ | — |
| `09-exploracion-infinita` | MLCAPS - Exploración Infinita | ✓ | ✓ |
| `10-exploracion-infinita-ampliada` | Exploración Infinita Ampliada | ✓ | ✓ |
| `11-exploracion-infinita-2` | Exploración Infinita (variante) | ✓ | ✓ |
| `12-detalle-producto` | MLCAPS - Detalle de Producto | ✓ | ✓ |

`manifest.json` — índice de todas las pantallas.

## Regenerar

```powershell
powershell -ExecutionPolicy Bypass -File scripts/download-stitch-mlcaps.ps1
```
