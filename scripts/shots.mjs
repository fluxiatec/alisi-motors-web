#!/usr/bin/env node
// Capturas en viewport mobile scrolleando la página. Uso: node scripts/shots.mjs URL OUTDIR [y1,y2,...] [ancho]
import puppeteer from 'puppeteer-core';
const [url = 'http://localhost:5173/', out = '.', ys = '0', width = '390'] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage();
const w = +width;
await page.setViewport(w < 800 ? { width: w, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true } : { width: w, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 2500));
for (const y of ys.split(',')) {
  const target = y.startsWith('#') ? await page.$eval(y, (el) => el.getBoundingClientRect().top + scrollY) : +y;
  await page.evaluate((t) => window.scrollTo(0, t), target);
  await new Promise((r) => setTimeout(r, 1400));
  await page.screenshot({ path: `${out}/shot-${w}-${y.replace('#', '')}.png` });
}
await browser.close();
