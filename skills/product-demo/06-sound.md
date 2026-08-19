# Step 6: Sound (self-scoring)

Sound is where demos most often turn amateur. A first pass of 58 hand-placed
synth blips earned the only feedback that matters: "no sound effects are
better than harsh and forceful sound effects." The rebuilt rules:

- **One sound per story turn.** ~10 cues for a 54s film, not 58. First ask if
  the moment needs sound at all. Never repeat a sound back-to-back.
- **Whooshes lead their motion by ~20ms** (brains process audio faster than
  video); **impacts land on the settle frame**, not the motion start.
- **Reward scales with the moment.** Taps are whispers (-13 dB); the thesis
  moment gets the one big hit (-8 dB). Establish a repeated sound once, then
  let the rest play silent.
- **Whoosh and impact are different sounds in different frequency ranges**;
  layer them.
- **Generate organic sounds** (paper, rubber stamp, felt tap), not synth
  beeps. Taps: short clean plastic transient. Success: warm two-note
  resolution, and if it sits next to a bigger hit, cut it entirely.

## Two traps in AI-generated SFX

1. **They pad silence before the hit** (a stamp's impact 0.35s into the file;
   a whoosh peaking at 1.15s). Measure each file's peak-energy offset, store
   it as `hit`, and have every player subtract it, or every impact lands
   ~0.3s late and reads "cheap".
2. **They are mastered quiet** (peaks at -9.6 dBFS). Peak-normalize each file
   at mix time so cue levels mean what they say, or the SFX bury under any
   music bed.

Measure with:

```sh
ffmpeg -i x.mp3 -af volumedetect -f null - 2>&1 | grep max_volume  # stderr!
ffprobe -f lavfi -i "amovie=x.mp3,astats=metadata=1:reset=1" \
  -show_entries frame=pts_time:frame_tags=lavfi.astats.Overall.Peak_level \
  -of csv=p=0 2>/dev/null | head -40   # first loud window = the hit
```

## The self-scoring architecture

Cues live IN the composition as data, one file is the single source of sound
truth (see [templates/sfx-cues.example.json](./templates/sfx-cues.example.json)):

```json
{ "sounds": { "big-stamp": { "file": "../sfx/big-stamp.mp3", "hit": 0.35 } },
  "cues": [
    { "t": 36.98, "sound": "big-stamp", "db": -8, "why": "the one big hit" }
  ] }
```

Every cue carries a `why`, the review surface. A cue that cannot justify
itself in one clause gets deleted.

Two consumers read the same file:

1. **A ~40-line WebAudio player** so the browser preview is audible while
   authoring. The composition calls `window.__SFX_TICK(T)` per rendered frame;
   fire cues only during forward playback (`0 < dt < 0.25`) so seeks stay
   silent.
2. **[templates/mix-audio.mjs](./templates/mix-audio.mjs)**, bakes identical
   cues onto any export: per-file peak normalization, hit retiming
   (`startAt = t - hit`), adelay+volume per cue, one `amix` with
   `normalize=0`, limiter at 0.95, and `apad` to the video's length so the
   container never truncates.

Preview and export can never disagree, and `record → encode → mix` from a
clean checkout is a fully scored master.

## Verify in the file, not the editor

```sh
for t in 13.45 42.15; do
  ffmpeg -ss $t -t 0.4 -i final.mp4 -af volumedetect -f null - 2>&1 | grep max_volume
done   # expect peaks at cue times, quiet elsewhere
```
