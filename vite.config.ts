import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Inserta el CSS del bundle dentro del HTML (<style>) en vez de <link>:
 * cero recursos que bloqueen el render. Se visita una vez por QR, así que no perdemos caché útil.
 */
function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find((f) => f.type === 'asset' && f.fileName === 'index.html');
      if (!html || html.type !== 'asset') return;
      let src = String(html.source);
      for (const f of Object.values(bundle)) {
        if (f.type !== 'asset' || !f.fileName.endsWith('.css')) continue;
        const tag = new RegExp(`<link rel="stylesheet"[^>]*href="[^"]*${f.fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`);
        if (!tag.test(src)) continue;
        src = src.replace(tag, () => `<style>${String(f.source)}</style>`);
        delete bundle[f.fileName];
      }
      html.source = src;
    },
  };
}

// BASE_PATH permite servir desde un subpath (GitHub Pages sin dominio propio).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss(), inlineCss()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
  },
});
