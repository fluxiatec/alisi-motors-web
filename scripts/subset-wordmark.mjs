#!/usr/bin/env node
// Genera un subset de Anton solo con las letras del wordmark y lo embebe (base64) en el CSS crítico de index.html.
// Requiere Python + fonttools (pip install fonttools brotli). Uso: node scripts/subset-wordmark.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const SRC = 'public/fonts/anton-latin-400.woff2';
const OUT = 'public/fonts/anton-wordmark.woff2';
execFileSync('python', ['-m', 'fontTools.subset', SRC, '--text=ALISIMOTORS', '--flavor=woff2', `--output-file=${OUT}`,
  '--layout-features=kern', '--no-hinting', '--desubroutinize'], { stdio: 'inherit' });

const b64 = fs.readFileSync(OUT).toString('base64');
const html = fs.readFileSync('index.html', 'utf8');
const re = /\/\*WM-FONT\*\/url\([^)]*\)/;
if (!re.test(html)) throw new Error('No encontré el marcador /*WM-FONT*/ en index.html');
fs.writeFileSync('index.html', html.replace(re, `/*WM-FONT*/url(data:font/woff2;base64,${b64})`));
console.log(`Subset: ${fs.statSync(OUT).size} bytes → embebido en index.html`);
