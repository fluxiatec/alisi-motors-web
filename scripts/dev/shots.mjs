#!/usr/bin/env node
// Capturas en viewport mobile. Uso: node scripts/shots.mjs OUTDIR "#ancla:offset,#otra,1200" [ancho]
// Scrollea de a poco hasta cada punto para disparar las animaciones de entrada.
import puppeteer from 'puppeteer-core';
const [out = '.', points = '0', width = '390', url = 'http://localhost:5173/'] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage();
const w = +width;
await page.setViewport(w < 800 ? { width: w, height: 844, isMobile: true, hasTouch: true } : { width: w, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 2200));
let cur = 0;
for (const p of points.split(',')) {
  const [sel, off = '0'] = p.split(':');
  const base = sel.startsWith('#') ? await page.$eval(sel, (el) => el.getBoundingClientRect().top + scrollY) : +sel;
  const target = base + +off;
  for (let y = cur; y < target; y += 350) {
    await page.evaluate((t) => window.scrollTo(0, t), y);
    await new Promise((r) => setTimeout(r, 90));
  }
  await page.evaluate((t) => window.scrollTo(0, t), target);
  cur = target;
  await new Promise((r) => setTimeout(r, 1800));
  const name = `shot-${w}-${p.replace(/[#:]/g, '_')}.png`;
  await page.screenshot({ path: `${out}/${name}` });
  console.log(name);
}
await browser.close();
