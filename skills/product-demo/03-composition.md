# Step 3 — Composition

The whole demo is one React tree rendered as a pure function of an authored
clock `T`. No GUI timelines. A function from seconds to pixels.

## The master cue table

The scene table from step 1 becomes a literal the composition derives
everything from:

```js
OM_SCENES = [
  { name: "ColdOpen",     secs: 6   },
  { name: "TheDrop",      secs: 5.5 },
  { name: "MachineReads", secs: 8   },
  { name: "Witness",      secs: 11  },
  { name: "AddsUp",       secs: 12  },
  { name: "TheStamp",     secs: 11.8},
]
```

Scene code keys off derived offsets (`CUES.Witness + 2.1`), never absolute
times — retiming a scene is editing one number.

## The seek contract

Expose a synchronous seek: an event that sets `T` and commits via `flushSync`
in the same task, so an external driver gets exactly the requested frame:

```js
el.dispatchEvent(new CustomEvent('seek-to-time', {
  detail: { time: 36.98, sync: true }
}))
```

Determinism is the point: ask for `T = 36.98` twice, get identical pixels
twice. This contract powers recording (04) and self-scoring sound (06).

## Motion rules

- **Nothing fades.** Everything stamps, slides, rips, or snaps. Fades read as
  apology; physical motion reads as conviction.
- Easing is allowed in at most three shared helpers and nowhere else, so the
  film moves with one accent.
- Build a small kit of instruments (stamp-in, slide, flip, ticker, sticker,
  badge, cursor, tape-wipe, paper-tear, scan-beam) and compose scenes from
  those, the way a soundtrack is composed from a few sounds.

## Fixtures are the honesty layer

Data tables (items, prices, people) live at the top of the scene file with a
standing comment: fixtures must match the real artifact — printed prices, a
total that reconciles. Review catches "improved" numbers against that rule.

## Captions are part of the composition

Caption cards render inside the film (same type, same motion), guarded by one
flag the recorder controls:

```js
function CaptionStamp(...) {
  if (window.__NO_CAPTIONS) return null;
  ...
}
```

## Styling vendored components

Override component CSS by targeting the hashed class names in the vendored
bundle. Names survive rebuilds unless a source CSS module is renamed — after
every design-system refresh, run the smoke render (04) before trusting a full
run.
