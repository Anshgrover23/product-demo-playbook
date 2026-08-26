---
name: product-demo
description: Make a YC-grade product demo video (45-60s) from the real app code in a repo, script, animated composition, frame-perfect recording, captions, AI voiceover plan, self-scoring sound design, and music mixing. Use when the user asks to "make a product demo", "demo video for my app", "launch video", "promo video from my code", "record my app for a demo", "add sound to my demo", "fix stutter in my screen recording", or wants captions/voiceover/SFX/music for a product video. Part of Showreel; reference outputs are the Vouch and Excalidraw demos.
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

## One starter prompt runs everything

When the user asks for a demo, orchestrate all eight steps yourself. Never
hand the user a step list or tell them to come back with the next prompt.
Instead, ask the user directly in conversation at exactly the moments you
need something only they can give, and attach the artifact that makes the
question answerable in seconds:

1. After step 1: show the scene table and voiceover script, ask for
   approval before writing any code. Retiming a script is cheap; retiming
   a rendered film is not.
2. After the smoke render: show the 4 spot frames, ask to proceed before
   the long full render.
3. At step 5: hand over the paste-ready tagged voiceover block (no sync
   notes in it) and ask for the generated audio file path.
4. At step 7: hand over the music-generator prompt you wrote and ask for
   the generated file path. Both asks can be batched with step 3's if the
   user prefers one trip to the tools.
5. After the scored preview: deliver a small cut for a listen before
   exporting final masters.

Between asks, proceed without checking in. If the user declines an
optional asset (voice, music), ship without it rather than stalling.

## Progress tracking (resumable runs)

Maintain demo/PROGRESS.md in the target repo: one line per step with
status (todo / in progress / done) and the artifact paths produced. Read
it FIRST in every session; a half-finished pipeline resumes from its last
question instead of restarting. Update it after every step.

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
6. **No flat black.** Every dark scene sits on the product's own art or
   wallpaper, blurred and graded down; the first frame is the thumbnail.
   Flat black only where it is the product's real surface (03).

## Templates

Working scripts in [templates/](./templates/): `record.mjs` (deterministic
playwright frame renderer, resumable), `mix-audio.mjs` (cue-driven ffmpeg
mixer; `--vo` for a retimed voiceover stem, `--bgm` for the bed),
`retime-vo.mjs` (cuts a generated read at its silences and places each
phrase on its authored timecode), `sfx-cues.example.json` (a real 10-cue
score), `package.json` (the npm scripts). Copy them into a `demo/` directory in the target repo and adapt
paths; each recipe says when.

## Complementary skills

If the target repo uses Remotion or ElevenLabs, install their official
skills too; this skill covers the pipeline and taste, theirs cover their
APIs:

```sh
npx skills add remotion-dev/skills
npx skills add elevenlabs/skills
```

## What the user receives (besides the film)

Two paste-ready artifacts, so the human workload is exactly two paste
jobs: a tagged voiceover block for the voice tool (05) and a style prompt
for the music generator (07). Never make the user write either.

## Reference outputs

Four demos prove the pipeline on unrelated products: the Vouch demo
(54.3s, receipt splitting), an Excalidraw demo (35.5s, filmed on the
real @excalidraw/excalidraw npm component, source in this repo under
examples/excalidraw), Asakiri Studio (54s, a Tauri+React course editor,
real components bundled with esbuild), and Colosseum (54s, a Qt/QML
Windows media app, surfaces rebuilt from its tokens and its own
screenshots; see the native-app path in 02). The Vouch repo
[github.com/Anshgrover23/vouch](https://github.com/Anshgrover23/vouch) carries
the full working `demo/` directory, composition, vendored runtime, cue file,
captions, as a reference implementation. The manual with every number and
failure: https://anshgrover23.github.io/product-demo-playbook/
