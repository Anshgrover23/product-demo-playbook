/* VKit — Vouch animation instruments. Token-only styling; everything stamps, slides, rips, or snaps. */
(() => {
const { Easing, clamp } = window;
const MONO = { fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" };
const DISP = { fontFamily: "var(--font-display)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.95 };
const CARD = { border: "2px solid var(--color-ink)", background: "var(--color-paper-2)", borderRadius: 6 };
const ABS = { position: "absolute" };
// ——— the only three motion helpers ———
const MOTION = {
  stamp(T, at, dur = 0.16, from = 1.9) { // scale from→1, shadow slams down
    const p = clamp((T - at) / dur, 0, 1);
    const e = Easing.easeOutQuart(p);
    return { p, e, on: T >= at, style: { opacity: T < at ? 0 : 1, transform: `scale(${from - (from - 1) * e})` }, shadow: `${Math.round(5 * e)}px ${Math.round(5 * e)}px 0 0 var(--color-ink)` };
  },
  slide(T, at, dur, from, to) { // hard mechanical slide (short + sharp)
    const p = clamp((T - at) / dur, 0, 1);
    return { p, v: from + (to - from) * Easing.easeOutQuart(p), on: T >= at, done: p >= 1 };
  },
  flip(T, rate = 12) { return Math.floor(Math.max(0, T) * rate); }, // quantized step clock
};
const shake = (T, at, amp = 3) => (T < at ? 0 : Math.sin((T - at) * 42) * amp * Math.exp(-(T - at) * 5));
const wobble = (T, at) => (T >= at ? Math.sin((T - at) * 30) * 2 * Math.exp(-(T - at) * 6) : 0);
const flick = (T, at, dur = 0.2) => (T < at ? 0 : T > at + dur ? 1 : (Math.sin((T - at) * 90) > -0.2 ? 1 : 0.15));
const hash10 = (q, i) => ((q * 31 + i * 17 + 7) % 10);

function Ticker({ T, at, y, speed = 340, color = "var(--color-lime)", bg = "transparent", text, angle = 0, size = 30 }) {
  const tx = -(((T - at) * speed) % 2400);
  return <div style={{ ...ABS, top: y, left: -60, width: 5200, whiteSpace: "nowrap", transform: `rotate(${angle}deg) translateX(${tx}px)`, ...MONO, fontSize: size, fontWeight: 700, color, background: bg, padding: bg === "transparent" ? 0 : "6px 0" }}>{text + text + text}</div>;
}
function Sticker({ T, at, children, bg = "var(--color-lime)", ink = "var(--color-lime-ink)", x, y, rot = -6, size = 15 }) {
  const s = MOTION.stamp(T, at, 0.14);
  if (!s.on) return null;
  return <div style={{ ...ABS, left: x, top: y, ...MONO, fontSize: size, fontWeight: 700, background: bg, color: ink, border: "2px solid var(--color-ink)", padding: "6px 12px", boxShadow: s.shadow, opacity: s.style.opacity, transform: `rotate(${rot + wobble(T, at + 0.14)}deg) ${s.style.transform}`, zIndex: 40 }}>{children}</div>;
}
function Badge({ T, at, children, bg = "var(--color-orange)", ink = "var(--color-orange-ink)", x, y, rot = -2, size = 12, z = 30 }) {
  const s = MOTION.stamp(T, at, 0.12);
  if (!s.on) return null;
  return <div style={{ ...ABS, left: x, top: y, ...MONO, fontSize: size, background: bg, color: ink, border: "2px solid var(--color-ink)", padding: "3px 8px", boxShadow: s.shadow, transform: `rotate(${rot}deg) ${s.style.transform}`, zIndex: z }}>{children}</div>;
}
function MoneyTile({ T, at, label, value, scrambleUntil = -1, tone = "var(--color-paper-2)", ink = "var(--color-ink)" }) {
  const s = MOTION.stamp(T, at, 0.16);
  if (!s.on) return null;
  const q = MOTION.flip(T);
  const disp = value.split("").map((ch, i) => (T < scrambleUntil && /\d/.test(ch)) ? String(hash10(q, i)) : ch).join("");
  return <div style={{ ...CARD, background: tone, boxShadow: s.shadow, transform: s.style.transform, padding: "12px 30px", minWidth: 240, textAlign: "center" }}>
    <div style={{ ...MONO, fontSize: 13, color: "var(--color-ink-2)" }}>{label}</div>
    <div style={{ ...MONO, fontSize: 40, fontWeight: 700, color: ink, fontVariantNumeric: "tabular-nums", letterSpacing: "0.12em", marginTop: 2 }}>{disp}</div>
  </div>;
}
function Chip({ T, at = 1e9, children, on }) { // punches to lime at `at`
  const hit = T >= at || on;
  const s = MOTION.stamp(T, at, 0.14);
  return <span style={{ ...MONO, fontSize: 12, border: "2px solid var(--color-ink)", padding: "4px 10px", background: hit ? "var(--color-lime)" : "var(--color-paper-2)", color: "var(--color-ink)", display: "inline-block", transform: T >= at ? s.style.transform : "none", boxShadow: hit ? "var(--shadow-hard-sm)" : "none" }}>{children}</span>;
}
function Flash({ T, hits, color = "var(--color-lime)", dur = 0.09, opacity = 0.2 }) {
  const on = hits.some((h) => T >= h && T < h + dur);
  return on ? <div style={{ ...ABS, inset: 0, background: color, opacity, zIndex: 80 }}></div> : null;
}
function Cursor({ x, y, press }) {
  return <svg width="26" height="30" viewBox="0 0 26 30" style={{ ...ABS, left: x, top: y, zIndex: 60, transform: press ? "scale(0.85)" : "none", filter: "drop-shadow(3px 3px 0 rgba(0,0,0,0.35))" }}>
    <polygon points="2,1 2,24 8,18 12,28 16,26 12,16 21,16" fill="var(--color-ink)" stroke="var(--color-paper-2)" strokeWidth="1.5"></polygon>
  </svg>;
}
function NamedCursor({ x, y, press, name, bg = "var(--color-pink)", ink = "var(--color-pink-ink)" }) {
  return <div style={{ ...ABS, left: x, top: y, zIndex: 60, transform: press ? "scale(0.85)" : "none" }}>
    <svg width="26" height="30" viewBox="0 0 26 30" style={{ filter: "drop-shadow(3px 3px 0 rgba(0,0,0,0.35))", display: "block" }}>
      <polygon points="2,1 2,24 8,18 12,28 16,26 12,16 21,16" fill="var(--color-ink)" stroke="var(--color-paper-2)" strokeWidth="1.5"></polygon>
    </svg>
    <span style={{ ...MONO, fontSize: 11, fontWeight: 700, background: bg, color: ink, border: "2px solid var(--color-ink)", padding: "2px 7px", position: "absolute", left: 18, top: 24, whiteSpace: "nowrap", boxShadow: press ? "none" : "var(--shadow-hard-sm)", transform: press ? "translate(3px,3px)" : "none" }}>{name}</span>
  </div>;
}
function CaptionStamp({ T, items, y = 622 }) { // ONE caption element; words stamp in on the clock
  if (window.__NO_CAPTIONS) return null;
  const cur = items.reduce((a, it) => (T >= it.at && T < (it.until ?? 1e9) ? it : a), null);
  if (!cur) return null;
  const words = cur.text.split(" ");
  const n = Math.min(words.length, 1 + Math.floor((T - cur.at) * 9));
  return <div style={{ ...ABS, left: 0, right: 0, top: cur.y ?? y, display: "flex", justifyContent: "center", zIndex: 70 }}>
    <div style={{ ...CARD, padding: "9px 18px", boxShadow: "var(--shadow-hard-sm)", display: "flex", alignItems: "baseline" }}>
      {words.slice(0, n).map((w, i) => {
        const s = MOTION.stamp(T, cur.at + i / 9, 0.1, 1.18);
        return <span key={i} style={{ ...DISP, fontSize: 32, color: "var(--color-ink)", transform: s.style.transform, transformOrigin: "center bottom", display: "inline-block", marginRight: i < words.length - 1 ? 9 : 0 }}>{w}</span>;
      })}
    </div>
  </div>;
}
// ——— transitions ———
function TapeWipe({ T, at, dur = 0.8, bg = "var(--color-lime)", ink = "var(--color-lime-ink)", text = "✦ VOUCH ", angle = -2 }) {
  if (T < at || T > at + dur) return null;
  const x = MOTION.slide(T, at, dur, 1500, -4200).v;
  return <div style={{ ...ABS, top: -80, left: 0, height: 880, width: 4000, transform: `rotate(${angle}deg) translateX(${x}px)`, background: bg, borderLeft: "4px solid var(--color-ink)", borderRight: "4px solid var(--color-ink)", zIndex: 90, overflow: "hidden" }}>
    {[0, 1, 2, 3, 4, 5, 6].map((r) => <div key={r} style={{ ...MONO, fontSize: 46, fontWeight: 700, color: ink, whiteSpace: "nowrap", marginTop: r ? 60 : 40, marginLeft: -(r * 160) }}>{text.repeat(30)}</div>)}
  </div>;
}
function BeamWipe({ T, at, dur = 0.8 }) {
  if (T < at || T > at + dur) return null;
  const y = MOTION.slide(T, at, dur, -30, 760).v;
  return <div style={{ ...ABS, left: -20, right: -20, top: y, height: 8, background: "var(--color-scan)", boxShadow: "0 0 32px 10px var(--color-scan)", zIndex: 90 }}></div>;
}
function LimeBoxJump({ T, at, dur = 0.8 }) { // a bounds box escapes the canvas and becomes the next shot's frame
  if (T < at || T > at + dur) return null;
  const k = Math.min(3, Math.floor(((T - at) / dur) * 4)); // 4 hard size snaps
  const rects = [[300, 330, 420, 46], [200, 240, 700, 240], [90, 90, 1100, 540], [28, 22, 1224, 676]];
  const r = rects[k];
  return <div style={{ ...ABS, left: r[0], top: r[1], width: r[2], height: r[3], border: "3px solid var(--color-ink)", outline: "4px solid var(--color-lime)", background: "oklch(94% 0.21 122 / 0.12)", zIndex: 88 }}></div>;
}
function TearWipe({ T, at, dur = 0.9 }) { // paper tears apart to reveal the next scene
  if (T < at || T > at + dur) return null;
  const closeP = clamp((T - at) / 0.18, 0, 1); // halves slam shut
  const open = MOTION.slide(T, at + 0.32, dur - 0.32, 0, 560);
  const zig = (yBase) => { let pts = ""; for (let x = 0; x <= 1280; x += 64) pts += `${x}px ${yBase + (x / 64 % 2 ? 16 : -14)}px,`; return pts; };
  const topClip = `polygon(0 0,1280px 0,${zig(346).split(",").filter(Boolean).reverse().join(",")})`;
  const botClip = `polygon(${zig(396)}1280px 720px,0 720px)`;
  const paper = { background: "var(--color-paper-3)", backgroundImage: "linear-gradient(var(--grid-line) 1px,transparent 1px),linear-gradient(90deg,var(--grid-line) 1px,transparent 1px)", backgroundSize: "28px 28px" };
  return <div style={{ ...ABS, inset: 0, zIndex: 90, opacity: closeP >= 1 || T < at + 0.18 ? 1 : 1 }}>
    <div style={{ ...ABS, inset: 0, ...paper, clipPath: topClip, transform: `translateY(${-(1 - closeP) * 420 - open.v}px)`, borderBottom: "3px solid var(--color-ink)" }}></div>
    <div style={{ ...ABS, inset: 0, ...paper, clipPath: botClip, transform: `translateY(${(1 - closeP) * 420 + open.v}px)` }}></div>
  </div>;
}
function PaperBG() {
  return <div style={{ ...ABS, inset: 0, background: "var(--color-paper)", backgroundImage: "linear-gradient(var(--grid-line) 1px,transparent 1px),linear-gradient(90deg,var(--grid-line) 1px,transparent 1px)", backgroundSize: "28px 28px" }}></div>;
}
window.VKit = { MOTION, MONO, DISP, CARD, ABS, shake, wobble, flick, hash10, Ticker, Sticker, Badge, MoneyTile, Chip, Flash, Cursor, NamedCursor, CaptionStamp, TapeWipe, BeamWipe, LimeBoxJump, TearWipe, PaperBG };
})();
