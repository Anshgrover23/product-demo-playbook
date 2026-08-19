# Step 5: Captions and voiceover

## Captions are a projection, not a transcription

The composition already holds every line and time (its caption table). SRT and
VTT files are projections of that table, same cue times, sentence-case text.
Never transcribe your own video. Keep them in sync by convention; check in
review.

## The VO script format

One line per beat, timecode first, delivery direction at the top, sync notes
at the bottom:

```
PRODUCT, 54.3s DEMO, VOICEOVER SCRIPT
(read deadpan; timecodes are line START times)

[00:00]  Every group chat has one receipt
[00:01]  That starts a war.
...
Sync notes: 'Show it.' lands on the squash-on-impact frame (~0:09.3);
silence from 0:48.5 to end.
```

If the voice tool supports tags, use them: pause tags to hit timecodes,
emotion tags per line, sound-word tags where supported.

## ElevenLabs specifics (if that is the voice tool)

- Generate line by line, and pass `previousText` and `nextText` on every
  request. The model then inflects each line as part of a continuous
  thought instead of six isolated headlines:

  ```js
  await client.textToSpeech.convert(VOICE_ID, {
    text: lines[i].text,
    previousText: lines[i - 1]?.text,
    nextText: lines[i + 1]?.text,
  });
  ```

- Settings that fix robotic delivery: stability 0.55, style 0.2,
  speed 1.0. If it still sounds rushed, lengthen the scene, not the
  speed; robotic TTS is usually a pacing problem, not a voice problem.

## Fixing a slow, flat voice clone

In order of impact:

1. **Split long sentences into short fragments**, TTS phrases fragments with
   more energy. "Every line. Every price." punches; one long sentence sags.
2. **Raise speed slightly** (1.05-1.15) instead of regenerating endlessly.
3. **Emotion tag on the fragment, not the paragraph**, paragraph-level tags
   average into mush.
4. **Generate line-by-line** so one bad read never forces a full redo, and
   each line can be nudged onto its timecode in the editor.

## Previewing an SRT without an editor

One HTML page: `<video>` + `<track kind="captions">` (convert SRT→VTT for
browsers), styled with `::cue`. Two minutes to build; catches every off-by-one
cue.

## Distribution

Ship the SRT as a sidecar wherever the video posts (platform CC renders in
the viewer's style); keep the burned-in master for platforms that restyle
captions badly. If an intro is later prepended (08), shift every SRT cue by
the intro's length, script in 08.
