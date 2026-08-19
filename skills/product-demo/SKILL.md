---
name: product-demo
description: Make a YC-grade product demo video (45-60s) from the real app code in a repo, script, animated composition, frame-perfect recording, captions, AI voiceover plan, self-scoring sound design, and music mixing. Use when the user asks to "make a product demo", "demo video for my app", "launch video", "promo video from my code", "record my app for a demo", "add sound to my demo", "fix stutter in my screen recording", or wants captions/voiceover/SFX/music for a product video. Built by the creators of Vouch (vouch.anshgrover.com); the Vouch demo is the reference output.
---

# Product Demo

Turn the app in this repo into a scored, captioned, frame-perfect demo video
using only node + playwright + ffmpeg. The pipeline is deterministic: the whole
demo re-renders and re-scores from a clean checkout.

## The pipeline, in order

| Step | Recipe | Output |
| --- | --- | --- |
| 1. Script | [01-script.md](./01-script.md) | scene table, VO lines with timecodes, rhythm grid |
| 2. Standalone UI | [02-standalone-ui.md](./02-standalone-ui.md) | app components rendering from a static folder |
| 3. Composition | [03-composition.md](./03-composition.md) | one React tree as a pure function of a clock |
| 4. Record | [04-record.md](./04-record.md) | PNG frames → visually lossless H.264 masters |
| 5. Captions + VO | [05-captions-vo.md](./05-captions-vo.md) | SRT/VTT sidecars, timecoded voiceover script |
| 6. Sound | [06-sound.md](./06-sound.md) | sfx-cues.json, live preview player, auto-mixer |
| 7. Music | [07-music.md](./07-music.md) | EQ-carved, ducked bed starting at the drop |
| 8. Assemble | [08-assemble.md](./08-assemble.md) | intro + transition + stems → final export |

Work the steps in order; each consumes the previous step's output. Steps 5-8
are optional for a silent draft, mandatory for a launch-quality film.

## Decision rules

- **User has no script or story** → start at 01. Never start by writing code.
- **User has a video that stutters** → 04 only (frame-by-frame recording fixes it).
- **User wants sound/SFX on an existing video** → 06 (cue file + mixer), then 07 if music.
- **User's demo "feels fake"** → the honesty rules in 01 and 03 (real data, reconciling totals).
- **User asks how long / what shape** → 45-60s, one claim per scene, ~6 scenes,
  arc: problem → drop → magic → interaction → proof → brand.
- **Voice clone sounds slow and flat** → the fixes in 05.
- **SFX land late or get buried** → measured hit offsets + peak normalization in 06.

## Non-negotiables (enforce these even if not asked)

1. **Honest data.** Fixtures must be real: real items, printed prices, totals
   that reconcile. Never invent rounder numbers.
2. **Nothing fades.** Everything stamps, slides, rips, or snaps. Fades read as
   apology. Easing lives in at most three shared helpers.
3. **Never screen-record.** Render frame-by-frame via the seek contract (04).
4. **No sound beats a forced sound.** ~10 cues per minute maximum, one per
   story turn, nothing repeated back-to-back.
5. **Two masters.** Captions burned + clean, from one composition via a
   `window.__NO_CAPTIONS` flag.

## Templates

Working scripts in [templates/](./templates/): `record.mjs` (deterministic
playwright frame renderer), `mix-audio.mjs` (cue-driven ffmpeg mixer),
`sfx-cues.example.json` (a real 10-cue score), `package.json` (the npm
scripts). Copy them into a `demo/` directory in the target repo and adapt
paths; each recipe says when.

## Reference output

The Vouch demo (54.3s) was shipped with exactly this pipeline; the repo
[github.com/Anshgrover23/vouch](https://github.com/Anshgrover23/vouch) carries
the full working `demo/` directory, composition, vendored runtime, cue file,
captions, as a reference implementation. The manual with every number and
failure: https://anshgrover23.github.io/product-demo-playbook/
