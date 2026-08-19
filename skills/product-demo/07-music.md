# Step 7: Music

- **Tempo-match the picture.** The interaction grid from step 1 is a BPM
  (0.6s = 100 BPM). Music at that tempo puts the taps on the beat with zero
  editing. Chillhop/lo-fi lives right there.
- **Start at the drop, not the file start.** Find where the track actually
  arrives (e.g. 17.9s in) and trim to it, nobody grants a demo a 15-second
  intro build. Land the drop on a story beat, not frame zero.
- **Carve, don't just duck.** Notch the music at ~250 Hz (voice body) and
  ~2.8 kHz (presence/consonants) so the voice pops through instead of the
  music audibly pumping:

  ```
  equalizer=f=250:t=q:w=1.0:g=-3, equalizer=f=2800:t=q:w=1.1:g=-4.5
  ```

- **Then duck gently on top.** Bed 15-20 dB under dialogue (~-21 dB), dipping
  another 3-6 dB while dense lines land, swelling in the air pockets, up to
  ~-7 dB for a VO-free outro. The swell is what makes the ending feel like an
  ending.
- **Fade musically.** ~0.2s fade-in at the trim point (cutting into a playing
  track), ~2.5s smooth fade-out finishing with the picture.
- **Deliver at -14 LUFS integrated, -1 dBTP**, what platforms normalize to.
  Mastering louder just gets turned down.

`mix-audio.mjs --bgm music.mp3 --bgm-start 17.9 --bgm-db -21` applies the
carve, trim, fades, and level in one pass. Two-pass loudnorm for final
delivery:

```sh
ffmpeg -i final.mp4 -af loudnorm=I=-14:TP=-1:LRA=11:print_format=summary -f null -
```
