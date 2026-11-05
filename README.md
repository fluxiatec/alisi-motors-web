# Alisi Motors · Miles GT40

Landing one-page, mobile-first. Vite + React + TypeScript + Tailwind v4.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview
```

## Medios

Los originales van en `raw/` (fuera del repo). Los optimizados en `public/media/` sí se versionan.

```bash
npm run optimize:images   # raw/fotos  → public/media/img  (AVIF+WebP 480/960/1600/2400) + metadatos en units.json
npm run optimize:videos   # raw/videos → public/media/video (H.264 720/1080, faststart, sin audio) + poster WebP
npm run report            # tabla de pesos antes/después
```

- `optimize-images.mjs` solo regenera lo que falta; `--force` regenera todo.
- `optimize-videos.sh` usa el `ffmpeg` del sistema o, si no hay, el de `ffmpeg-static`. Los tramos se definen en `JOBS`.
- Foto nueva: copiarla a `raw/fotos/`, agregar `{ "file": "IMG_XXXX", "alt": "…" }` a la unidad en `src/data/units.json` y correr `npm run optimize:images`.

## Performance (primer pantallazo)

- El wordmark está en `index.html` (HTML + CSS crítico inline), no en React: es el LCP y pinta sin esperar al JS.
- Usa un subset de Anton con solo las letras de ALISIMOTORS (~1 KB) embebido en base64. Si cambia el texto del wordmark: `npm run subset:wordmark` (requiere Python + `pip install fonttools brotli`).
- El CSS del bundle se inserta inline en el HTML (plugin `inlineCss` en `vite.config.ts`): cero recursos que bloqueen el render.
- Los videos no usan el atributo `autoplay` (anula `preload="none"`); se reproducen con IntersectionObserver y el negro mate recién se pide cerca del viewport.
- Para medir como en producción (brotli + caché + Range): `npm run build && npm run serve:dist` y Lighthouse contra http://localhost:4180.

## Contenido editable (`src/data/`)

| Archivo | Qué contiene |
|---|---|
| `units.json` | Unidades: color, número de carrera, `unidad` ("07/24", vacío = no se muestra), fotos, `credit` |
| `specs.json` | Cifras animadas y ficha técnica. Los ítems con `"pending": true` no se muestran: completar `value` y borrar el flag |
| `timeline.json` | Hitos de la trayectoria + dato destacado |
| `contact.json` | Mail, WhatsApp, Instagram y mensajes precargados (`{unit}` se reemplaza por "verde #77", etc.) |
| `site.json` | `showPartners` (false hasta que el cliente apruebe) y lista de partners |

## Capas del wordmark

`Wordmark` es `position: fixed` en `z-0`. El video del hero va en `z-[-1]`. Las secciones (`.section`) son negras en `z-10` y lo tapan; los `<div class="window">` son huecos transparentes donde vuelve a verse. **Ningún ancestro de las secciones puede crear stacking context** (transform, opacity < 1, z-index), y `body` no lleva background.

## Deploy

**VPS (nginx):** ver `deploy/nginx.conf`.

```bash
npm run build
rsync -avz --delete dist/ usuario@servidor:/var/www/alisimotors/dist/
```

**GitHub Pages:** `.github/workflows/pages.yml` (build en cada push a `main`).
