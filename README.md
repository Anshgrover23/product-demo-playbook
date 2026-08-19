# Showreel

**Your coding agent makes your product demo video.**

Agencies charge $5,000-$15,000 for a 60-second product demo. This skill lets
Claude Code, Cursor, or any coding agent make one from your repo, on your
machine, for $0, script, animated composition from your real components,
frame-perfect recording, captions, AI voiceover plan, self-scoring sound
design, and music mixing.

A [Vouch](https://vouch.anshgrover.com) project by
[Ansh Grover](https://x.com/Anshgrover23). The
[Vouch demo](https://github.com/Anshgrover23/vouch/tree/main/demo) is the
reference output, everything on the site was made with this pipeline.

**Site: https://anshgrover23.github.io/product-demo-playbook/**

## Install

```sh
npx skills add Anshgrover23/product-demo-playbook
```

or clone and copy `skills/product-demo/` anywhere your agent reads
instructions. Prereqs: Node 20+, ffmpeg, `npx playwright install chromium`.

Then ask your agent:

> Use the product-demo skill to make a launch demo video for the app in
> this repo. Run the whole pipeline yourself, start to finish. Ask me in
> chat when you need something: script approval, the voiceover audio, the
> music file. Track progress in demo/PROGRESS.md so we can resume anytime.

That is the only prompt. The agent orchestrates all eight steps and asks
you in conversation at the moments it needs a human: approving the script,
pasting the tagged voiceover block it writes into MiniMax or ElevenLabs,
and pasting its music prompt into a generator.

## What's inside

```
skills/product-demo/
  SKILL.md            triggers, decision rules, non-negotiables
  01-script.md        scene table, VO with timecodes, 0.6s rhythm grid
  02-standalone-ui.md vendoring your components, framework stubs
  03-composition.md   one-clock architecture, seek contract, motion rules
  04-record.md        frame-by-frame rig, animation pinning, encode
  05-captions-vo.md   SRT/VTT projection, voice-clone fixes
  06-sound.md         cue-file format, hit offsets, the 10-cue discipline
  07-music.md         carve + duck + start at the drop, -14 LUFS
  08-assemble.md      intro, transition, stems, X-ready export
  templates/          record.mjs, mix-audio.mjs, sfx-cues.example.json
```

The deep manual, full worked example, 15-entry troubleshooting log, complete
command reference, lives at
[manual.html](https://anshgrover23.github.io/product-demo-playbook/manual.html).

## Gallery

Shipped a demo with the skill?
[Open an issue](https://github.com/Anshgrover23/product-demo-playbook/issues/new?title=Gallery%20submission)
with the video and repo link to claim a gallery slot.
