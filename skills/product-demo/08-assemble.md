# Step 8: Assemble

1. **Founder intro up front** (≤5s, camera-real, one sentence). Authenticity
   before polish is the point of the format. If aspect ratios differ, choose
   the letterbox treatment deliberately (scale-to-fill or a branded matte),
   never accidental black bars.
2. **One branded transition** between intro and demo, e.g. a tape strip with
   the product name sweeping across (~50 frames at 60fps), a whoosh riding it,
   cued ~3 frames before the visual. One transition, used once.
3. **Layer audio as stems, not clips:** the VO track, the composition's SFX
   stem (export the scored demo's audio as one file and lay it in, never
   re-place individual sounds by hand, they are already frame-exact), and the
   carved music bed with ducking keyframes. Replacing hand-placed SFX clips
   with the stem restores cues that never made it into the editor and fixes
   every level at once.
4. **Mind clip-overwrite semantics.** Dropping a stem onto a track trims
   whatever it overlaps (a transition whoosh loses its tail exactly this way).
   Overlap-check after every placement.
5. **Shift the SRT by the intro length** for the combined cut:

   ```python
   import re
   shift = 5.2333
   def add(m):
       h,mn,s,ms = map(int, m.groups())
       t = h*3600 + mn*60 + s + ms/1000 + shift
       h2=int(t//3600); t-=h2*3600; m2=int(t//60); t-=m2*60
       return f"{h2:02d}:{m2:02d}:{int(t):02d},{round((t-int(t))*1000):03d}"
   out = re.sub(r'(\d{2}):(\d{2}):(\d{2}),(\d{3})', add, open('demo.srt').read())
   open('demo-fullcut.srt','w').write(out)
   ```

6. **Export H.264 1440p/4K 60fps master**, then a ~3.5 Mbps 1080p copy for
   chats and review links:

   ```sh
   ffmpeg -i master.mp4 -vf scale=1920:1080:flags=lanczos \
     -c:v libx264 -preset slow -b:v 3300k -maxrate 3800k -bufsize 7600k \
     -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart preview.mp4
   ```

7. **For X/Twitter:** autoplay is muted, use a version with captions burned
   in. Splice the captioned master's video with the final cut's soundtrack if
   needed; never post a caption-less video there.
8. **Verify audio in the exported file** at cue times (volumedetect windows,
   see 06), not just in the editor.

## Assembling in an editor the agent can drive

If an MCP-driven NLE is connected (Palmier Pro was used for the Colosseum
demo), keep the split: ffmpeg does the precision work, the editor does the
assembly you may want to tweak by hand later.

- Prepare three stems with the templates: `vo-final.wav` (retimed),
  `sfx-stem.wav` (run `mix-audio.mjs` on the clean master with no `--vo`,
  then extract the audio), and a carved, trimmed music bed
  (`-ss <drop> -t <film length>` plus the 250Hz/2.8kHz notches).
- One clip per track: picture on V1, then Dialogue, SFX, Music. Never let
  two audio clips share a track; a drop trims whatever it overlaps.
- Draw ducking as volume keyframes on the music clip (clip-relative
  frames): about -21 dB under lines, swells to -14/-16 dB in the air
  pockets, a -7 dB outro, then down to silence with the last frame.
- Export from the editor, then master with ffmpeg: measure with loudnorm,
  apply a plain `volume=` correction (gain down needs no limiter), and
  re-measure. Target -14 LUFS / -1 dBTP. Reference the stems in place so a
  picture-only re-render only needs a remux (`-map 0:v -map 1:a -c copy`).

## Picture-only revisions

When only the composition changes after the mix is final, do not re-mix.
Re-render, re-encode both masters, extract the mastered soundtrack once,
and remux it onto the new picture and the captions master. Rebuild the
1080p copies from those. Audio stays bit-identical to what you verified.
