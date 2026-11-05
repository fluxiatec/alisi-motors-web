#!/usr/bin/env node
// Optimiza raw/fotos/*.JPG → public/media/img/{id}-{w}.{avif,webp}
// y escribe width/height/placeholder en src/data/units.json.
// Uso: node scripts/optimize-images.mjs [--force]
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(ROOT, 'raw/fotos');
const OUT = path.join(ROOT, 'public/media/img');
const DATA = path.join(ROOT, 'src/data/units.json');
const WIDTHS = [480, 960, 1600, 2400];
const AVIF = { quality: 60, effort: 5 };
const WEBP = { quality: 72, effort: 5 };
const FORCE = process.argv.includes('--force');

const exists = (p) => fs.access(p).then(() => true, () => false);
const slug = (file) => file.toLowerCase().replace(/\.[a-z]+$/, '').replace(/_/g, '-');

async function processPhoto(file) {
  const src = path.join(RAW, `${file}.JPG`);
  const id = slug(file);
  // .rotate() sin argumentos aplica la orientación EXIF.
  const base = sharp(src, { failOn: 'none' }).rotate();
  const meta = await base.metadata();
  const swap = (meta.orientation ?? 1) >= 5;
  const W = swap ? meta.height : meta.width;
  const H = swap ? meta.width : meta.height;
  const widths = WIDTHS.filter((w) => w <= W);

  for (const w of widths) {
    for (const [fmt, opts] of [['avif', AVIF], ['webp', WEBP]]) {
      const out = path.join(OUT, `${id}-${w}.${fmt}`);
      if (!FORCE && (await exists(out))) continue;
      await base.clone().resize({ width: w }).toFormat(fmt, opts).toFile(out);
    }
  }

  // Placeholder: WebP de 16px muy borroso, inline en base64 (~200 bytes).
  const tiny = await base.clone().resize({ width: 16 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  const placeholder = `data:image/webp;base64,${tiny.toString('base64')}`;

  return { id, width: W, height: H, widths, placeholder };
}

async function makeBrandAssets() {
  const pub = path.join(ROOT, 'public');
  // OG 1200x630 con el Gulf #6.
  await sharp(path.join(RAW, 'IMG_6862.JPG')).rotate()
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(pub, 'og-gulf6.jpg'));
  // Íconos PNG a partir del favicon SVG.
  const svg = await fs.readFile(path.join(pub, 'favicon.svg'));
  await sharp(svg, { density: 600 }).resize(180, 180).png().toFile(path.join(pub, 'apple-touch-icon.png'));
  await sharp(svg, { density: 600 }).resize(512, 512).png().toFile(path.join(pub, 'icon-512.png'));
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const data = JSON.parse(await fs.readFile(DATA, 'utf8'));
  const all = [...data.units.flatMap((u) => u.photos), ...data.details];
  const cache = new Map();

  for (const photo of all) {
    if (!cache.has(photo.file)) {
      process.stdout.write(`· ${photo.file} … `);
      cache.set(photo.file, await processPhoto(photo.file));
      console.log('ok');
    }
    Object.assign(photo, cache.get(photo.file));
  }

  await fs.writeFile(DATA, JSON.stringify(data, null, 2) + '\n');
  if (await exists(path.join(ROOT, 'public/favicon.svg'))) await makeBrandAssets();
  console.log(`\n${cache.size} fotos procesadas → public/media/img`);
}

main().catch((e) => { console.error(e); process.exit(1); });
