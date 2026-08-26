// Retimes a generated voiceover onto the authored clock.
// TTS tools compress pause tags, so a raw read drifts off the picture by
// mid-film. Cut the file at its silences and place every segment at its
// authored timecode instead of nudging the whole clip.
//
// 1. Find the silence boundaries:
//      ffmpeg -i vo.mp3 -af silencedetect=noise=-32dB:d=0.25 -f null -
//    Speech segments run from each silence_end to the next silence_start.
// 2. Map segments to lines by matching the BIG pauses first: they survive
//    compression in rank order, so if your five longest authored pauses come
//    back as the five longest gaps, in the same order, the map is right.
// 3. Fill SEGS below and run:  node retime-vo.mjs vo.mp3 [duration]
import { execFileSync } from 'node:child_process';

const SRC = process.argv[2];
const DURATION = Number(process.argv[3] ?? 54);
if (!SRC) throw new Error('usage: node retime-vo.mjs vo.mp3 [durationSecs]');

// [srcStart, srcEnd, timelineAt] in seconds. One entry per phrase; a line
// may span several entries when the read splits it (tighten intra-line gaps
// here when a phrase must land on a specific frame).
const SEGS = [
  [0.257, 2.779, 0.60],
  [3.484, 4.565, 3.20],
  // ...
];

const PRE = 0.08, POST = 0.06; // padding into the surrounding silences
const chains = [];
const mixIns = [];
SEGS.forEach(([a, b, at], i) => {
  const s = Math.max(0, a - PRE);
  const e = b + POST;
  const ms = Math.round(at * 1000);
  chains.push(`[0]atrim=${s.toFixed(3)}:${e.toFixed(3)},asetpts=PTS-STARTPTS,adelay=${ms}|${ms}[v${i}]`);
  mixIns.push(`[v${i}]`);
});
const graph = chains.join(';') +
  `;${mixIns.join('')}amix=inputs=${SEGS.length}:duration=longest:normalize=0,` +
  `apad=whole_dur=${DURATION},alimiter=limit=0.95[o]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', SRC, '-filter_complex', graph,
  '-map', '[o]', '-ar', '48000', 'vo-final.wav'], { stdio: 'inherit' });
console.log(`retimed → vo-final.wav (${SEGS.length} segments on the authored clock)`);
// Verify: speech at every line start, silence in the air pockets:
//   ffmpeg -ss 6.62 -t 0.35 -i vo-final.wav -af volumedetect -f null -
