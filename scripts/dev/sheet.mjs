// Une capturas en una tira: node scripts/sheet.mjs OUT img1 img2 ...
import sharp from 'sharp';
const [out, ...files] = process.argv.slice(2);
const imgs = await Promise.all(files.map((f) => sharp(f).resize(300).toBuffer()));
const hs = await Promise.all(imgs.map(async (b) => (await sharp(b).metadata()).height));
await sharp({ create: { width: 310 * files.length, height: Math.max(...hs), channels: 3, background: '#444' } })
  .composite(imgs.map((input, i) => ({ input, left: i * 310, top: 0 })))
  .png()
  .toFile(out);
