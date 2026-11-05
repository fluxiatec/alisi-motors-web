#!/usr/bin/env node
// Tabla de pesos: originales (raw/) vs optimizados (public/media).
import fs from 'node:fs';
import path from 'node:path';

const kb = (b) => (b / 1024 < 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`);
const size = (p) => (fs.existsSync(p) ? fs.statSync(p).size : 0);
const pct = (a, b) => `-${(100 - (b / a) * 100).toFixed(1)}%`;
const IMG = 'public/media/img';
const imgs = fs.existsSync(IMG) ? fs.readdirSync(IMG) : [];

const rows = [];
let tRaw = 0, tAll = 0, tMob = 0;
for (const f of fs.readdirSync('raw/fotos').sort()) {
  const id = f.replace(/\.JPG$/i, '').toLowerCase().replace(/_/g, '-');
  const raw = size(`raw/fotos/${f}`);
  const all = imgs.filter((x) => x.startsWith(id + '-')).reduce((s, x) => s + size(path.join(IMG, x)), 0);
  const mob = size(`${IMG}/${id}-960.avif`);
  tRaw += raw; tAll += all; tMob += mob;
  rows.push([f, kb(raw), kb(mob), kb(all), pct(raw, mob)]);
}
rows.push(['**Total fotos**', `**${kb(tRaw)}**`, `**${kb(tMob)}**`, `**${kb(tAll)}**`, `**${pct(tRaw, tMob)}**`]);

console.log('| Foto | Original | Mobile (960 AVIF) | Todas las variantes | Ahorro mobile |');
console.log('|---|---:|---:|---:|---:|');
rows.forEach((r) => console.log(`| ${r.join(' | ')} |`));

const V = 'public/media/video';
const vids = [
  ['Cine-3.mp4 → hero', 'raw/videos/Cine-3.mp4', 'hero'],
  ['.mov HEVC → mate', fs.readdirSync('raw/videos').filter((x) => x.endsWith('.mov')).map((x) => `raw/videos/${x}`)[0], 'mate'],
];
console.log('\n| Video | Original | 720p (mobile) | 1080p | Poster |');
console.log('|---|---:|---:|---:|---:|');
for (const [label, raw, n] of vids) {
  const r = size(raw), m = size(`${V}/${n}-720.mp4`);
  console.log(`| ${label} | ${kb(r)} | ${kb(m)} (${pct(r, m)}) | ${kb(size(`${V}/${n}-1080.mp4`))} | ${kb(size(`${V}/${n}-poster.webp`))} |`);
}
