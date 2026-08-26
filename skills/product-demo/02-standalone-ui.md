# Step 2: Standalone UI

The composition must render the app's real components from a static folder
with no app running (`python3 -m http.server` is the whole stack). App code
assumes routers, auth, env vars, a database, strip those assumptions.

## Approach

Bundle components + CSS + tokens + fonts into one static snapshot (esbuild
works) committed next to the demo (e.g. `demo/ds/`), with a refresh script for
when components change. The demo must outlive every tool that made it.

## The npm-component shortcut

If the product ships itself as an npm package (Excalidraw, tldraw, most
editor-like products), skip the vendoring work: bundle the real package
plus React into one browser global with esbuild and film that. Learned
shipping the Excalidraw reference demo:

- Packages may gate exports behind a `production` condition; esbuild needs
  `conditions: ['production']` or the CSS import fails to resolve.
- Ship the package's own fonts and set its asset-path global before the
  bundle loads (`window.EXCALIDRAW_ASSET_PATH` style).
- Drive the component per frame imperatively: compute the scene from `T`,
  push it in `useLayoutEffect` (commits inside the synchronous seek), keep
  `pointer-events: none` on the container.
- Pin any per-element random `seed` the library uses for hand-drawn
  jitter, or the render boils frame to frame.

## The native-app path (Qt/QML, Swift, Flutter, anything not web)

When nothing in the repo can run in a browser, rebuild the surfaces in
HTML from the app's own materials, and only those. Learned shipping the
Colosseum demo (a Qt 6 QML Windows app):

- **Tokens from the source, not from eyeballing.** Find the theme file
  (`Theme.qml`, a design-tokens struct, a `.xcassets` color set) and copy
  every color, font, and radius into the composition's kit verbatim.
- **Fonts and icons from the repo.** Apps bundle their typefaces
  (`assets/fonts`) and SVG icons; load them directly. Inline SVGs so
  stroke colors follow the tokens.
- **Art from the app's own screenshots.** `docs/` and README hero GIFs are
  real app pixels. Crop regions with ffmpeg (`crop=w:h:x:y`), skipping
  burned-in chrome and text, and rebuild that chrome yourself in the same
  positions. Record every crop in NOTES.md (source file, crop rectangle).
- **Data from the screenshots too.** Titles, counts, timestamps, ratings
  visible in those screens are the fixture. The honesty rule holds: if a
  crop is unusable (an overlay button burned into a cover), swap in another
  item that is genuinely in the same screen, and say so in NOTES.md.
- **Contact-sheet every crop before composing** (ffmpeg hstack/vstack);
  a bad crop found at smoke time costs a rebuild.

## The gotchas (each cost a day; check all of them)

- **Pin every component explicitly.** In an app repo (vs a packaged design
  system) there is no dist/types tree to walk; auto-discovery finds one
  component and stops.
- **Shim `process`.** Framework client modules (Next.js especially) read
  `process.env.__NEXT_*` at module scope and crash in a browser IIFE. Prepend
  a process shim to EVERY entry point, extra entries initialize before the
  main entry's shim runs.
- **Stub the router.** Anything using `next/link` / `usePathname` needs fake
  `AppRouterContext`/`PathnameContext` providers. One `PreviewShell` wrapper
  used by every preview solves it once.
- **Cut server import chains.** An async server component can pull the
  database driver into the browser bundle through its import chain. Exclude
  it; use a client-safe stand-in.
- **Export page-internal components.** Components defined inside a route file
  must be exported to be bundleable. Extract interactive states into
  props-driven components (`DropZone active`, `ReadingPaper previewSrc`) so
  un-triggerable states, drag-over, mid-scan, become filmable.
- **Pin runtime font variables.** next/font injects `--font-*` vars at
  runtime; outside the app they are undefined and every `var()` font-family
  silently invalidates. Pin them in a preview stylesheet; ship the woff2s.
- **Ship real images as data URIs.** A 2.6MB sample photo becomes a ~20KB webp
  data URI at width 512, big enough to film, small enough to commit.
- **Measure fixture coordinates from the artifact.** OCR-bounds fixtures said
  58px row pitch; the actual photo measured ~86px. Overlays drawn from
  fixtures drift; measure from the image you are showing.
- **Split big screens into lego.** Buttons, badges, stickers, textures,
  overlays as separate small components; small pieces animate independently.
  Add pieces additively, never delete old components other demos depend on.

## Write it down

Keep a NOTES file in the repo recording every fork, stub, and re-sync risk
("renaming the font variables in layout.tsx silently breaks all typography").
It is the difference between a minutes-long re-sync and a day-long one.
