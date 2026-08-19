# Step 2 — Standalone UI

The composition must render the app's real components from a static folder
with no app running (`python3 -m http.server` is the whole stack). App code
assumes routers, auth, env vars, a database — strip those assumptions.

## Approach

Bundle components + CSS + tokens + fonts into one static snapshot (esbuild
works) committed next to the demo (e.g. `demo/ds/`), with a refresh script for
when components change. The demo must outlive every tool that made it.

## The gotchas (each cost a day; check all of them)

- **Pin every component explicitly.** In an app repo (vs a packaged design
  system) there is no dist/types tree to walk; auto-discovery finds one
  component and stops.
- **Shim `process`.** Framework client modules (Next.js especially) read
  `process.env.__NEXT_*` at module scope and crash in a browser IIFE. Prepend
  a process shim to EVERY entry point — extra entries initialize before the
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
  un-triggerable states — drag-over, mid-scan — become filmable.
- **Pin runtime font variables.** next/font injects `--font-*` vars at
  runtime; outside the app they are undefined and every `var()` font-family
  silently invalidates. Pin them in a preview stylesheet; ship the woff2s.
- **Ship real images as data URIs.** A 2.6MB sample photo becomes a ~20KB webp
  data URI at width 512 — big enough to film, small enough to commit.
- **Measure fixture coordinates from the artifact.** OCR-bounds fixtures said
  58px row pitch; the actual photo measured ~86px. Overlays drawn from
  fixtures drift; measure from the image you are showing.
- **Split big screens into lego.** Buttons, badges, stickers, textures,
  overlays as separate small components; small pieces animate independently.
  Add pieces additively — never delete old components other demos depend on.

## Write it down

Keep a NOTES file in the repo recording every fork, stub, and re-sync risk
("renaming the font variables in layout.tsx silently breaks all typography").
It is the difference between a minutes-long re-sync and a day-long one.
