/* Excalidraw demo, filmed on the real @excalidraw/excalidraw component.
   Made with the product-demo skill; same engine and kit as the Vouch demo. */
(() => {
const K = () => window.VKit;
const X = () => window.ExcalidrawLib;

// palette: excalidraw's own element colors
const C = { blue: "#a5d8ff", green: "#b2f2bb", yellow: "#ffec99", violet: "#d0bfff", red: "#ffc9c9", stroke: "#1b1b1f" };

// ——— S1: cold open ———
function S1({ T, c }) {
  const { MOTION, ABS, DISP, MONO, Ticker, Sticker, PaperBG } = K();
  const s1 = MOTION.stamp(T, c + 0.5, 0.16);
  const s2 = MOTION.stamp(T, c + 2.6, 0.16);
  // a hand arrow that draws itself
  const p = Math.max(0, Math.min(1, (T - c - 3.4) / 0.7));
  return <div style={{ ...ABS, inset: 0 }}>
    <PaperBG></PaperBG>
    <Ticker T={T} at={c} y={92} angle={-2} speed={310} color="var(--color-ink)" text="SPEC DOCS NOBODY READS ✦ WHITEBOARD PHOTOS AT AN ANGLE ✦ 40-LAYER DESIGN FILES ✦ "></Ticker>
    <Ticker T={T} at={c} y={600} angle={1.5} speed={260} color="var(--color-pink)" text="“CAN YOU MAKE A QUICK DIAGRAM?” ✦ MEETING THAT SHOULD BE A SKETCH ✦ "></Ticker>
    {s1.on && <div style={{ ...ABS, left: 0, right: 0, top: 240, textAlign: "center", ...DISP, fontSize: 74, color: "var(--color-ink)", transform: s1.style.transform }}>EVERY GREAT PRODUCT<br />STARTS AS A BAD DRAWING.</div>}
    {s2.on && <div style={{ ...ABS, left: 0, right: 0, top: 420, textAlign: "center", ...MONO, fontSize: 26, color: "var(--color-ink-2)", transform: s2.style.transform }}>your tools demand a good one.</div>}
    <svg width="220" height="120" viewBox="0 0 220 120" style={{ ...ABS, left: 900, top: 430 }}>
      <path d="M 10 20 C 80 10, 150 30, 190 90" fill="none" stroke="var(--color-pink)" strokeWidth="5" strokeLinecap="round"
        strokeDasharray="300" strokeDashoffset={300 - 300 * p}></path>
      {p >= 1 && <path d="M 168 78 L 192 92 L 180 64" fill="none" stroke="var(--color-pink)" strokeWidth="5" strokeLinecap="round"></path>}
    </svg>
    <Sticker T={T} at={c + 4.2} x={520} y={520} bg="var(--color-lime)" rot={-5}>TRUST THE SKETCH</Sticker>
  </div>;
}

// ——— the live canvas: one continuous take across three scenes ———
function buildElements(T, CUES) {
  const { MOTION } = K();
  const c2 = CUES.TheCanvas, c3 = CUES.DrawsItself, c4 = CUES.Together;
  const els = [];
  const grow = (at, w, h) => ({ w: Math.max(8, MOTION.slide(T, at, 0.3, 14, w).v), h: Math.max(8, MOTION.slide(T, at, 0.3, 12, h).v) });
  const box = (id, at, x, y, w, h, bg, label, seed) => {
    if (T < at) return;
    const g = grow(at, w, h);
    els.push({ type: "rectangle", id, x: x + (w - g.w) / 2, y: y + (h - g.h) / 2, width: g.w, height: g.h,
      backgroundColor: bg, fillStyle: "solid", strokeColor: C.stroke, strokeWidth: 2, roughness: 1, seed,
      label: T >= at + 0.28 ? { text: label, fontSize: 24 } : undefined });
  };
  const arrow = (id, at, x, y, w, h, seed) => {
    if (T < at) return;
    const p = Math.min(1, (T - at) / 0.3);
    els.push({ type: "arrow", id, x, y, width: w * p, height: h * p, strokeColor: C.stroke, strokeWidth: 2, roughness: 1, seed });
  };
  // S2: the first box; at S3 it slides down to its seat in the diagram
  const helloY = 280 + MOTION.slide(T, c3 + 2.3, 0.5, 0, 105).v;
  box("hello", c2 + 1.7, 500, helloY, 280, 110, C.blue, "your idea", 101);
  // S3: the diagram assembles on the 0.6 grid
  box("users", c3 + 0.0, 150, 150, 210, 90, C.blue, "users", 102);
  arrow("a1", c3 + 0.6, 372, 195, 130, 0, 201);
  box("api", c3 + 0.9, 515, 140, 230, 105, C.green, "api", 103);
  arrow("a2", c3 + 1.5, 758, 192, 130, 0, 202);
  box("db", c3 + 1.8, 900, 150, 200, 90, C.yellow, "database", 104);
  arrow("a3", c3 + 3.0, 622, 260, 0, 112, 203);
  if (T >= c3 + 4.5) els.push({ type: "text", id: "note", x: 850, y: 428, text: "ship this part first", fontSize: 20, strokeColor: "#e64980", seed: 106 });
  arrow("a4", c3 + 4.2, 796, 440, 44, 0, 204);
  // S4: RILEY drags the database box; it recolors on the tap
  const drag = MOTION.slide(T, c4 + 1.4, 0.9, 0, -60);
  const dbEl = els.find((e) => e.id === "db");
  if (dbEl) { dbEl.x += drag.v; dbEl.y += drag.v * -0.6; if (T >= c4 + 3.2) dbEl.backgroundColor = C.green; }
  // SAM circles the magic
  if (T >= c4 + 4.6) {
    const g = grow(c4 + 4.6, 350, 175);
    els.push({ type: "ellipse", id: "shipit", x: 465 + (350 - g.w) / 2, y: 350 + (175 - g.h) / 2, width: g.w, height: g.h,
      backgroundColor: "transparent", strokeColor: "#e64980", strokeWidth: 2, roughness: 2, seed: 107 });
  }
  if (T >= c4 + 5.4) els.push({ type: "text", id: "shiplbl", x: 560, y: 542, text: "SHIP IT", fontSize: 28, strokeColor: "#e64980", seed: 108 });
  return X().convertToExcalidrawElements(els);
}

function LiveCanvas({ T }) {
  const { CUES } = useComposition();
  const [api, setApi] = React.useState(null);
  const els = buildElements(T, CUES);
  React.useLayoutEffect(() => { if (api) api.updateScene({ elements: els }); });
  return <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
    <window.ExcalidrawLib.Excalidraw excalidrawAPI={setApi}
      initialData={{ appState: { viewBackgroundColor: "#fdfcf6", theme: "light", zoom: { value: 1 }, scrollX: 0, scrollY: 0 } }}></window.ExcalidrawLib.Excalidraw>
  </div>;
}

// ——— per-scene overlays on top of the live canvas ———
function S2o({ T, c }) {
  const { ABS, MONO, Sticker, Badge, Cursor, MOTION } = K();
  const cx = MOTION.slide(T, c + 1.0, 0.7, 980, 640).v, cy = MOTION.slide(T, c + 1.0, 0.7, 620, 330).v;
  return <div style={{ ...ABS, inset: 0, zIndex: 20 }}>
    {T < c + 2.6 && <Cursor x={cx} y={cy} press={T >= c + 1.65 && T < c + 1.95}></Cursor>}
    <Sticker T={T} at={c + 3.4} x={880} y={90} bg="var(--color-lime)" rot={3}>REAL APP · NOT A MOCKUP</Sticker>
  </div>;
}
function S3o({ T, c }) {
  const { ABS, Sticker, Flash } = K();
  return <div style={{ ...ABS, inset: 0, zIndex: 20 }}>
    <Flash T={T} hits={[c + 0.0, c + 0.9, c + 1.8, c + 3.0]} color="var(--color-lime)" opacity={0.1}></Flash>
    <Sticker T={T} at={c + 6.2} x={120} y={560} bg="var(--color-orange)" rot={-4}>NO LAYER PANELS. NO SNAPPING FIGHTS.</Sticker>
  </div>;
}
function S4o({ T, c }) {
  const { ABS, MOTION, NamedCursor, Badge, Flash } = K();
  const r = { x: MOTION.slide(T, c + 1.0, 1.4, 1150, 930).v, y: MOTION.slide(T, c + 1.0, 1.4, 640, 210).v };
  const rx = r.x + MOTION.slide(T, c + 1.4, 0.9, 0, -60).v;
  const sx = MOTION.slide(T, c + 3.9, 0.8, 120, 540).v, sy = MOTION.slide(T, c + 3.9, 0.8, 100, 380).v;
  return <div style={{ ...ABS, inset: 0, zIndex: 20 }}>
    <NamedCursor x={rx} y={r.y + (T >= c + 1.4 ? 40 : 0)} name="RILEY" bg="var(--color-blue)" ink="var(--color-blue-ink)" press={T >= c + 1.4 && T < c + 2.5}></NamedCursor>
    {T >= c + 3.6 && <NamedCursor x={sx} y={sy} name="SAM" press={T >= c + 4.5 && T < c + 5.6}></NamedCursor>}
    <Badge T={T} at={c + 0.4} x={1130} y={80} bg="var(--color-pink)" ink="var(--color-pink-ink)">LIVE</Badge>
    <Flash T={T} hits={[c + 3.2]} color="var(--color-lime)" opacity={0.16}></Flash>
  </div>;
}
function S5({ T, c, end }) {
  const { ABS, DISP, MONO, MOTION, Sticker, PaperBG } = K();
  const s = MOTION.stamp(T, c + 0.5, 0.18, 2.1);
  const u = MOTION.stamp(T, c + 3.4, 0.16);
  return <div style={{ ...ABS, inset: 0, zIndex: 10 }}>
    <PaperBG></PaperBG>
    {s.on && <div style={{ ...ABS, left: 0, right: 0, top: 200, textAlign: "center", ...DISP, fontSize: 120, color: "var(--color-ink)", transform: s.style.transform }}>EXCALIDRAW</div>}
    {s.on && <div style={{ ...ABS, left: 0, right: 0, top: 352, textAlign: "center", ...MONO, fontSize: 24, color: "var(--color-ink-2)" }}>the whiteboard that feels like paper</div>}
    <Sticker T={T} at={c + 1.7} x={330} y={470} bg="var(--color-lime)" rot={-6} size={18}>130K STARS ON GITHUB</Sticker>
    <Sticker T={T} at={c + 2.3} x={620} y={455} bg="var(--color-orange)" rot={3} size={18}>FREE FOREVER</Sticker>
    <Sticker T={T} at={c + 2.9} x={840} y={478} bg="var(--color-pink)" ink="var(--color-pink-ink)" rot={-3} size={18}>NO SIGN-UP</Sticker>
    {u.on && <div style={{ ...ABS, left: 0, right: 0, top: 570, display: "flex", justifyContent: "center", transform: u.style.transform }}>
      <div style={{ border: "3px solid var(--color-ink)", borderRadius: 6, background: "var(--color-blue)", color: "var(--color-blue-ink)", padding: "12px 34px", ...DISP, fontSize: 34, boxShadow: u.shadow }}>excalidraw.com</div>
    </div>}
  </div>;
}

function Piece() {
  const { T, CUES, authoredTotal } = useComposition();
  const { ABS, PaperBG, TearWipe, TapeWipe, CaptionStamp } = K();
  const VO = [
    [CUES.ColdOpen, 0.6, 2.4, "EVERY IDEA DESERVES A NAPKIN."],
    [CUES.ColdOpen, 2.7, 5.0, "YOUR TOOLS KEEP HANDING YOU FORMS."],
    [CUES.TheCanvas, 0.7, 2.6, "THIS IS EXCALIDRAW."],
    [CUES.TheCanvas, 2.9, 5.5, "A CANVAS THAT STARTS IN ZERO SECONDS."],
    [CUES.DrawsItself, 0.5, 2.5, "BOXES. ARROWS. HANDWRITING."],
    [CUES.DrawsItself, 2.8, 5.1, "IT LOOKS LIKE YOU DREW IT."],
    [CUES.DrawsItself, 5.4, 8.4, "BECAUSE THAT'S THE POINT."],
    [CUES.Together, 0.5, 2.9, "SHARE A LINK. SKETCH TOGETHER."],
    [CUES.Together, 3.4, 6.9, "NO ACCOUNTS. NOTHING TO INSTALL."],
    [CUES.JustDraw, 0.6, 2.8, "FREE. OPEN SOURCE. YOURS."],
    [CUES.JustDraw, 3.1, 6.4, "STOP DESCRIBING IT. DRAW IT."],
  ].map(([cc, a, u, text]) => ({ at: cc + a, until: cc + u, text }));
  if (typeof window !== "undefined" && window.__SFX_TICK) window.__SFX_TICK(T);
  return <div data-screen-label={`t=${Math.floor(T)}s`} style={{ position: "absolute", inset: 0, overflow: "hidden", color: "var(--color-ink)", fontFamily: "var(--font-body)" }}>
    <PaperBG></PaperBG>
    <Shot from={CUES.TheCanvas} to={CUES.JustDraw + 0.45}><LiveCanvas T={T}></LiveCanvas></Shot>
    <Shot from={CUES.TheCanvas} to={CUES.DrawsItself}><S2o T={T} c={CUES.TheCanvas}></S2o></Shot>
    <Shot from={CUES.DrawsItself} to={CUES.Together}><S3o T={T} c={CUES.DrawsItself}></S3o></Shot>
    <Shot from={CUES.Together} to={CUES.JustDraw}><S4o T={T} c={CUES.Together}></S4o></Shot>
    <Shot from={CUES.JustDraw}><S5 T={T} c={CUES.JustDraw} end={authoredTotal}></S5></Shot>
    <Shot from={CUES.ColdOpen} to={CUES.TheCanvas}><S1 T={T} c={CUES.ColdOpen}></S1></Shot>
    <TearWipe T={T} at={CUES.TheCanvas - 0.45}></TearWipe>
    <TapeWipe T={T} at={CUES.JustDraw - 0.4} bg="var(--color-blue)" ink="var(--color-blue-ink)" angle={2} text="✦ EXCALIDRAW "></TapeWipe>
    <CaptionStamp T={T} items={VO} y={636}></CaptionStamp>
  </div>;
}

function ExcalidrawDemo() {
  const [t, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS || { motionEditor: false });
  return <React.Fragment>
    <window.CompositionStage width={1280} height={720} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="var(--color-paper)">
      <Piece></Piece>
    </window.CompositionStage>
    <window.TweaksPanel>
      <window.TweakSection label="Timeline"></window.TweakSection>
      <window.TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak("motionEditor", v)}></window.TweakToggle>
    </window.TweaksPanel>
  </React.Fragment>;
}
window.ExcalidrawDemo = ExcalidrawDemo;
})();
