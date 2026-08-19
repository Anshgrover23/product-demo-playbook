// Mixes the composition's sound cues (and optionally a music bed) onto an
// exported video. The cue file is the same one the browser preview plays, so
// preview and export always agree.
// Usage:
//   node mix-audio.mjs --video out/vouch-demo-1440p60-nocaptions.mp4 \
//     [--bgm path.mp3] [--bgm-start 17.9] [--bgm-db -21] [--out path.mp4]
// BGM is EQ-carved for voice clarity (250Hz/2.8kHz notches) and faded.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : dflt;
};
const video = resolve(arg('--video', join(HERE, 'out/vouch-demo-1440p60-nocaptions.mp4')));
const bgm = arg('--bgm', null);
const bgmStart = Number(arg('--bgm-start', 0));
const bgmDb = Number(arg('--bgm-db', -21));
const out = resolve(arg('--out', video.replace(/\.mp4$/, '-scored.mp4')));

const spec = JSON.parse(readFileSync(join(HERE, 'composition/sfx-cues.json'), 'utf8'));
const dur = Number(execFileSync('ffprobe', ['-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]).toString());

// SFX files arrive at arbitrary loudness; normalize each to peak -1dBFS so a
// cue's db value is its true output peak level.
const makeup = {};
for (const [name, snd] of Object.entries(spec.sounds)) {
  const f = resolve(HERE, 'composition', snd.file);
  const det = spawnSync('ffmpeg', ['-i', f, '-af', 'volumedetect', '-f', 'null', '-']).stderr.toString();
  const m = /max_volume: (-?[\d.]+) dB/.exec(det);
  makeup[name] = m ? -(1 + Number(m[1])) : 0;
}

const inputs = ['-i', video];
const chains = [];
const mixIns = [];
let idx = 1;
for (const cue of spec.cues) {
  const snd = spec.sounds[cue.sound];
  inputs.push('-i', resolve(HERE, 'composition', snd.file));
  // land the file's measured hit point on the cue time
  const startAt = cue.t - (snd.hit ?? 0);
  const gain = (makeup[cue.sound] + (cue.db ?? -12)).toFixed(1);
  const pre = startAt < 0 ? `atrim=${(-startAt).toFixed(3)},` : '';
  const ms = Math.round(Math.max(0, startAt) * 1000);
  chains.push(`[${idx}]${pre}adelay=${ms}|${ms},volume=${gain}dB[s${idx}]`);
  mixIns.push(`[s${idx}]`);
  idx++;
}
if (bgm) {
  inputs.push('-ss', String(bgmStart), '-i', resolve(bgm));
  chains.push(
    `[${idx}]equalizer=f=250:t=q:w=1.0:g=-3,equalizer=f=2800:t=q:w=1.1:g=-4.5,` +
    `atrim=0:${dur.toFixed(3)},volume=${bgmDb}dB,afade=t=in:d=0.2,afade=t=out:st=${(dur - 2.5).toFixed(3)}:d=2.5[bgm]`
  );
  mixIns.push('[bgm]');
  idx++;
}
// pad to the video's length so -shortest never truncates the video when the
// last sound ends before the final frame (e.g. SFX-only mixes)
const graph = chains.join(';') + `;${mixIns.join('')}amix=inputs=${mixIns.length}:duration=longest:normalize=0,alimiter=limit=0.95,apad=whole_dur=${dur.toFixed(3)}[aout]`;
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', graph,
  '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', out]);
console.log(`scored → ${out} (${spec.cues.length} cues${bgm ? ' + bgm' : ''})`);
