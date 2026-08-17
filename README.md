# The Product Demo Playbook

A step-by-step playbook for making a YC-grade product demo video from your
real app code — script, composition, frame-perfect recording, AI voiceover,
sound design, and music. Distilled from shipping the
[Vouch](https://vouch.anshgrover.com) demo end to end.

**Read it here: https://divanshu-go.github.io/product-demo-playbook/**

## The steps, in order

1. **Know the shape** — 45–60s, one claim per scene, honest data, real UI
2. **Write the story first** — scene table, timecoded VO, a rhythmic grid, air pockets
3. **Make your real UI renderable standalone** — vendored component bundle, framework stubs
4. **Author the demo as code, on one clock** — pure function of time, seek contract, nothing fades
5. **Record frame-by-frame** — seek + screenshot per frame, pin CSS animations, never screen-record
6. **Captions and AI voiceover** — SRT/VTT projected from the composition's caption table
7. **Sound design** — sparse cues in a JSON file the demo plays itself; measured hit offsets; peak normalization
8. **Music** — tempo-match the interaction grid, start at the drop, EQ-carve 250Hz/2.8kHz, duck gently
9. **Assemble** — founder intro, one branded transition, stem-based audio layering, −14 LUFS export
10. **Ship checklist**

Plus four appendices with the real artifacts from the shipped demo:

- **A. The worked example** — the full 16-line VO script, the complete 10-cue sound sheet with levels and measured hit offsets, the music numbers
- **B. Troubleshooting log** — 15 real failures as symptom → cause → fix
- **C. Command reference** — every ffmpeg/ffprobe command: render, encode, hit measurement, cue verification, loudness, SRT shifting
- **D. Research sources**

## Templates

Working scripts extracted from the real pipeline, in [`templates/`](templates/):

| File | What it is |
| --- | --- |
| `record.mjs` | Deterministic playwright frame renderer (smoke mode, caption toggle, fps/scale flags) |
| `mix-audio.mjs` | ffmpeg auto-mixer: cues + hit-offset retiming + peak normalization + carved music bed |
| `sfx-cues.example.json` | A real cue file: 10 cues scoring a 54s film |
| `package.json` | The npm scripts (`smoke`, `record`, `encode`, `mix`, ...) |

The templates assume a composition that renders as a pure function of an
authored clock and answers a synchronous seek event — the playbook's step 4
explains how and why to build that.
