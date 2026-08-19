# Excalidraw demo (reference output #2)

A 35.5s demo filmed on the real @excalidraw/excalidraw npm component,
made end to end with the product-demo skill: script, live-canvas
composition, frame-by-frame recording, tagged voiceover for MiniMax,
10-cue self-scoring soundtrack, music bed mixed from its arrival point.

```sh
npm install && npx playwright install chromium
npm run bundle    # esbuild: real Excalidraw + React into vendor/
npm run smoke     # 4 spot frames, eyeball first
npm run record && npm run encode && npm run mix
```

SFX files are not vendored here; copy any organic pack into sfx/ and
adjust composition/sfx-cues.json hit offsets (see skill recipe 06).
