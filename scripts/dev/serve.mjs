#!/usr/bin/env node
// Servidor estático para medir dist/ como en producción (≈ deploy/nginx.conf):
// brotli/gzip en texto, Cache-Control, Range requests para video. Uso: node scripts/dev/serve.mjs [puerto]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = path.resolve('dist');
const PORT = +(process.argv[2] ?? 4180);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.avif': 'image/avif', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.mp4': 'video/mp4',
};
const TEXT = /\.(html|js|css|json|svg|webmanifest|txt)$/;
const cache = new Map();

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(ROOT, 'index.html');
  const ext = path.extname(file);
  const headers = { 'Content-Type': TYPES[ext] ?? 'application/octet-stream' };
  headers['Cache-Control'] = p.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : p.startsWith('/media/') ? 'public, max-age=2592000' : 'no-cache';

  if (TEXT.test(ext)) {
    const enc = /\bbr\b/.test(req.headers['accept-encoding'] ?? '') ? 'br' : /gzip/.test(req.headers['accept-encoding'] ?? '') ? 'gzip' : null;
    let body = fs.readFileSync(file);
    if (enc) {
      const key = file + enc + fs.statSync(file).mtimeMs;
      if (!cache.has(key)) cache.set(key, enc === 'br' ? zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 6 } }) : zlib.gzipSync(body, { level: 6 }));
      body = cache.get(key);
      headers['Content-Encoding'] = enc;
      headers['Vary'] = 'Accept-Encoding';
    }
    headers['Content-Length'] = body.length;
    res.writeHead(200, headers).end(body);
    return;
  }

  const size = fs.statSync(file).size;
  headers['Accept-Ranges'] = 'bytes';
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '');
  if (range) {
    const start = range[1] ? +range[1] : size - +range[2];
    const end = range[1] && range[2] ? Math.min(+range[2], size - 1) : size - 1;
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { ...headers, 'Content-Length': size });
    fs.createReadStream(file).pipe(res);
  }
}).listen(PORT, () => console.log(`dist/ → http://localhost:${PORT}`));
