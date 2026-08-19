# Step 4 — Record

Never screen-record: live playback capture inherits every skipped
requestAnimationFrame — that is the stutter you cannot edit out. Drive the
seek contract instead: for each output frame, seek to its timestamp,
screenshot, repeat. A slow frame costs render time, never a dropped frame.

Start from [templates/record.mjs](./templates/record.mjs). The core loop:

```js
for (let f = 0; f <= frames; f++) {
  const t = Math.min(f / FPS, duration - 1e-4);
  await page.evaluate((time) => {
    stage.dispatchEvent(new CustomEvent('seek-to-time',
      { detail: { time, sync: true } }));
    // Pin CSS keyframe animations to the authored clock — they run on
    // wall-clock time and race ahead under slow capture otherwise.
    for (const a of document.getAnimations()) {
      try { a.pause(); a.currentTime = time * 1000; } catch {}
    }
  }, t);
  await stage.screenshot({ path: `f${String(f).padStart(5,'0')}.png` });
}
```

The `document.getAnimations()` pinning is mandatory: a CSS spinner ran ~11x
too fast in output before it, because CSS animations ignore the seek clock.

## The rig

- Serve locally with a tiny `node:http` static server (never `file://`).
- Before frame 0: network idle → `document.fonts.ready` → ~2.5s settle for
  charts/images. A first frame with fallback fonts ruins the render.
- Render at 2x deviceScaleFactor and downscale in the encoder; `--scale 3`
  gives 4K.
- `--smoke` renders 4 spot frames for a seconds-long eyeball check. Run it
  after every component refresh, before any full run.
- `--no-captions` sets `window.__NO_CAPTIONS` via an init script — two
  masters (burned + clean) from one composition.

## Encode

```sh
ffmpeg -framerate 60 -i frames/f%05d.png \
  -vf scale=2560:1440:flags=lanczos \
  -c:v libx264 -preset slow -crf 12 -pix_fmt yuv420p \
  -movflags +faststart demo-1440p60.mp4
```

CRF 12 = visually lossless master, meant to survive an editor re-encode plus
every platform's. ~3,260 PNGs and ~10 min for 54s at 60fps; `--fps 30` for
drafts.
