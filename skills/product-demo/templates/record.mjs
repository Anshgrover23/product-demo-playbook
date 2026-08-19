// Renders the demo composition to PNG frames, deterministically.
// Usage:
//   npm install && npx playwright install chromium   (once)
//   node record.mjs [--no-captions] [--smoke] [--fps 60] [--scale 2]
// Then encode with ffmpeg (see README.md).
//
// Why frame-by-frame: the composition renders as a pure function of one
// authored clock and exposes a synchronous seek event. Asking for each frame
// by timestamp and screenshotting it makes dropped frames impossible; live
// playback capture inherits every skipped requestAnimationFrame.
import { createServer } from 'node:http';
import { readFileSync, mkdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : dflt;
};
const NOCAP = process.argv.includes('--no-captions');
const SMOKE = process.argv.includes('--smoke');
const FPS = Number(arg('--fps', 60));
const SCALE = Number(arg('--scale', 2));
const OUT = join(HERE, 'out', NOCAP ? 'frames-nocap' : 'frames');
mkdirSync(OUT, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.jsx': 'text/jsx', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png' };
const srv = createServer((req, res) => {
  const p = join(HERE, decodeURIComponent(req.url.split('?')[0]));
  try {
    res.setHeader('Content-Type', MIME[extname(p)] ?? 'application/octet-stream');
    res.end(readFileSync(p));
  } catch { res.statusCode = 404; res.end(); }
}).listen(0);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1460, height: 900 }, deviceScaleFactor: SCALE });
if (NOCAP) await page.addInitScript(() => { window.__NO_CAPTIONS = true; });
page.on('pageerror', (e) => console.error('[js]', String(e).slice(0, 300)));
await page.goto(`http://127.0.0.1:${srv.address().port}/composition/index.html`, { waitUntil: 'networkidle', timeout: 90_000 });
await page.waitForSelector('[data-om-exportable-video-with-duration-secs]', { timeout: 90_000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(2500); // recharts + image settle

const stage = await page.$('[data-om-exportable-video-with-duration-secs]');
const duration = Number(await stage.getAttribute('data-om-exportable-video-with-duration-secs'));
const frames = SMOKE ? 3 : Math.round(duration * FPS);
console.log(`duration=${duration}s frames=${frames} fps=${FPS} scale=${SCALE}x captions=${!NOCAP}`);

for (let f = 0; f <= frames; f++) {
  const t = SMOKE ? [2, 16, 36.5, 48][f] : Math.min(f / FPS, duration - 1e-4);
  await page.evaluate((time) => {
    const el = document.querySelector('[data-om-exportable-video-with-duration-secs]');
    el.dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', { detail: { time, sync: true } }));
    // Pin CSS keyframe animations (spinners) to the authored clock: they run
    // on wall-clock time and race ahead under slow frame capture otherwise.
    for (const a of document.getAnimations()) {
      try { a.pause(); a.currentTime = time * 1000; } catch { /* detached */ }
    }
  }, t);
  await stage.screenshot({ path: join(OUT, `f${String(f).padStart(5, '0')}.png`) });
  if (f % 300 === 0) console.log(`frame ${f}/${frames}`);
}
console.log(`done → ${OUT}`);
await browser.close();
srv.close();
