// Dune Haul Footer: ported to plain JSX (types stripped), BetOnYou violet palette.
const DHF_W = 1440, DHF_H = 900, DHF_HORIZON = 572, DHF_F = 328;
const P = {
  sky: ["#FAF8FE", "#EFE8FD"], glow: "#E3D6FD",
  far: ["#F1EBFD", "#DFD3FC", "#CDBCFB"], mid: ["#E6DCFC", "#CDBCFB", "#AE92F7"],
  ground: ["#DBCEFB", "#B9A1FA", "#946CF5"], front: ["#CDBCFB", "#A283F6", "#7B45F5"],
  near: ["#BBA4FA", "#8D60F5", "#5A2FD0"], shrub: ["#B9A1FA", "#6A35E8"],
  specks: ["#ffffff", "#F7F3FF", "#FCE4DA", "#FFF0CC"],
  road: "#F6F2FE", roadEdge: "#A283F6", roadShade: "#5A2FD0",
  truck: { trailer: "#F6F2FE", trailerTop: "#ffffff", trailerSide: "#D6C7FA", cab: "#F8B733", cabTop: "#FCD57A", cabSide: "#D99512", glass: "#25103F", wheel: "#1A0B2E", lights: "#FFF7E3" },
  card: "#ffffff", ink: "#25103F", muted: "#6B5F82", line: "#E6DEF4", accent: "#7B45F5", accentInk: "#ffffff",
};

function dhfRng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function dhfDomeY(d, x) { const u = (x - d.cx) / (x < d.cx ? d.wl : d.wr); return d.base - (d.base - d.top) * Math.exp(-u * u * 1.15); }
function dhfDomePath(d) { const x0 = d.cx - d.wl * 2.6, x1 = d.cx + d.wr * 2.6; let s = "M" + x0.toFixed(1) + " " + (DHF_H + 80); for (let i = 0; i <= 48; i++) { const x = x0 + ((x1 - x0) * i) / 48; s += "L" + x.toFixed(1) + " " + dhfDomeY(d, x).toFixed(1); } return s + "L" + x1.toFixed(1) + " " + (DHF_H + 80) + "Z"; }
function dhfCrestPath(d) { const x0 = d.cx - d.wl * 1.7, x1 = d.cx + d.wr * 1.7; let s = ""; for (let i = 0; i <= 32; i++) { const x = x0 + ((x1 - x0) * i) / 32; s += (i ? "L" : "M") + x.toFixed(1) + " " + (dhfDomeY(d, x) + 1).toFixed(1); } return s; }
function dhfProject(X, Z) { const g = DHF_F / Math.max(0.05, Z); return [DHF_W / 2 + X * g, DHF_HORIZON + g]; }
function dhfRoad(pts, perSeg) {
  const out = [], Pt = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let g = 0; g < pts.length - 1; g++) {
    const p0 = Pt(g - 1), p1 = Pt(g), p2 = Pt(g + 1), p3 = Pt(g + 2);
    for (let i = g === 0 ? 0 : 1; i <= perSeg; i++) {
      const t = i / perSeg, t2 = t * t, t3 = t2 * t;
      const cr = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      const X = cr(p0[0], p1[0], p2[0], p3[0]), Z = cr(p0[1], p1[1], p2[1], p3[1]);
      const [x, y] = dhfProject(X, Z);
      out.push({ X, Z, nX: 0, nZ: 0, s: 0, x, y, dx: 0, dy: 1 });
    }
  }
  for (let i = 0; i < out.length; i++) {
    const p = out[Math.max(0, i - 1)], n = out[Math.min(out.length - 1, i + 1)];
    const gl = Math.hypot(n.X - p.X, n.Z - p.Z) || 1, tX = (n.X - p.X) / gl, tZ = (n.Z - p.Z) / gl;
    out[i].nX = tZ; out[i].nZ = -tX;
    const sl = Math.hypot(n.x - p.x, n.y - p.y) || 1; out[i].dx = (n.x - p.x) / sl; out[i].dy = (n.y - p.y) / sl;
    if (i > 0) out[i].s = out[i - 1].s + Math.hypot(out[i].X - out[i - 1].X, out[i].Z - out[i - 1].Z);
  }
  return out;
}
function dhfAt(road, s) {
  const last = road[road.length - 1]; if (s <= 0) return road[0]; if (s >= last.s) return last;
  let lo = 0, hi = road.length - 1; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (road[mid].s <= s) lo = mid; else hi = mid; }
  const a = road[lo], b = road[hi], t = (s - a.s) / (b.s - a.s || 1), L = (u, v) => u + (v - u) * t;
  const dx = L(a.dx, b.dx), dy = L(a.dy, b.dy), dl = Math.hypot(dx, dy) || 1, nX = L(a.nX, b.nX), nZ = L(a.nZ, b.nZ), nl = Math.hypot(nX, nZ) || 1;
  return { X: L(a.X, b.X), Z: L(a.Z, b.Z), nX: nX / nl, nZ: nZ / nl, s, x: L(a.x, b.x), y: L(a.y, b.y), dx: dx / dl, dy: dy / dl };
}
function dhfBand(road, a, b, upto) {
  if (upto <= 0) return ""; const left = [], right = [];
  const push = (p) => { const l = dhfProject(p.X + p.nX * a, p.Z + p.nZ * a), r = dhfProject(p.X + p.nX * b, p.Z + p.nZ * b); left.push(l[0].toFixed(1) + " " + l[1].toFixed(1)); right.push(r[0].toFixed(1) + " " + r[1].toFixed(1)); };
  for (const p of road) { if (p.s > upto) { push(dhfAt(road, upto)); break; } push(p); }
  if (left.length < 2) return ""; return "M" + left.join("L") + "L" + right.reverse().join("L") + "Z";
}
function dhfPace(Z) { return Math.pow(Math.max(0.2, Z), 1.15); }
function dhfTripCost(road) { let t = 0; for (let i = 1; i < road.length; i++) t += (road[i].s - road[i - 1].s) / dhfPace((road[i].Z + road[i - 1].Z) / 2); return t; }
function dhfAtTime(road, f) {
  const goal = dhfTripCost(road) * Math.min(1, Math.max(0, f)); let t = 0;
  for (let i = 1; i < road.length; i++) { const step = (road[i].s - road[i - 1].s) / dhfPace((road[i].Z + road[i - 1].Z) / 2); if (t + step >= goal) return road[i - 1].s + ((goal - t) / (step || 1)) * (road[i].s - road[i - 1].s); t += step; }
  return road[road.length - 1].s;
}
function dhfHull(points) {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]); if (p.length < 3) return p;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = []; for (const q of p) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
  const upper = []; for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
  upper.pop(); lower.pop(); return lower.concat(upper);
}
function dhfPoly(points) { return points.length ? "M" + points.map((q) => q[0].toFixed(2) + " " + q[1].toFixed(2)).join("L") + "Z" : ""; }
function dhfBox(face, back, shrink) {
  const [x0, y0, x1, y1] = face, cx = (x0 + x1) / 2;
  const r = (x, y) => [cx + (x - cx) * shrink + back[0], y1 + (y - y1) * shrink + back[1]];
  const f = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], k = [r(x0, y0), r(x1, y0), r(x1, y1), r(x0, y1)];
  return { hull: dhfHull(f.concat(k)), top: [f[0], f[1], k[1], k[0]], side: back[0] < 0 ? [f[0], k[0], k[3], f[3]] : [f[1], k[1], k[2], f[2]], front: f, rear: k };
}
function dhfTruck(dx, dy) {
  const len = 64 * (0.42 + 0.58 * Math.min(1, Math.abs(dx) * 1.25)), back = [-dx * len, -dy * len - 6];
  const cabBack = [back[0] * 0.3, back[1] * 0.3], tf = [back[0] * 0.34, back[1] * 0.34];
  const cab = dhfBox([-20, -40, 20, -7], cabBack, 0.96);
  const trailer = dhfBox([-23 + tf[0], -62 + tf[1], 23 + tf[0], -13 + tf[1]], [back[0] * 0.66, back[1] * 0.66], 0.9);
  const along = (q, t) => [q[3][0] + (q[2][0] - q[3][0]) * t, q[3][1] + (q[2][1] - q[3][1]) * t + 4.5];
  const bl = Math.hypot(back[0], back[1]) || 1, axis = [(back[0] / bl) * Math.max(0.28, bl / 64), (back[1] / bl) * Math.max(0.28, bl / 64)];
  return { cab, trailer, back, wheels: [along(trailer.side, 0.5), along(trailer.side, 0.84)], cabWheels: [along(cab.side, 0.6)], axis };
}
function dhfWheel(c, axis, r) { let d = ""; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; d += (i ? "L" : "M") + (c[0] + axis[0] * r * Math.cos(a)).toFixed(2) + " " + (c[1] + axis[1] * r * Math.cos(a) + r * Math.sin(a)).toFixed(2); } return d + "Z"; }
function dhfFit(w, h) { const s = Math.max(w / DHF_W, h / DHF_H); return { s, ox: (w - DHF_W * s) / 2, oy: h - DHF_H * s }; }
function dhfEaseOut(t) { const c = Math.min(1, Math.max(0, t)); return 1 - Math.pow(1 - c, 3); }

const ROAD_PTS = [[12.6, 27], [8, 12], [4.6, 6], [3.25, 3.65], [1.25, 2.3], [-0.2, 1.5], [-0.5, 0.9], [-0.4, 0.55]];
const ROAD_W = 0.86, TRUCK_K = 0.0078, LANE = 0.2;
const LAYERS = [
  { key: "far", depth: 0.12, specks: 26, speckR: 2.6, domes: [{ cx: -60, wl: 260, wr: 300, top: 392, base: 640 }, { cx: 1500, wl: 300, wr: 260, top: 398, base: 640 }, { cx: 610, wl: 250, wr: 230, top: 512, base: 640 }, { cx: 1040, wl: 230, wr: 300, top: 520, base: 640 }] },
  { key: "mid", depth: 0.26, specks: 60, speckR: 3, domes: [{ cx: 300, wl: 420, wr: 330, top: 452, base: 720 }, { cx: 1210, wl: 330, wr: 420, top: 476, base: 720 }] },
  { key: "ground", depth: 0.44, specks: 340, speckR: 3.4, domes: [{ cx: 860, wl: 560, wr: 640, top: 582, base: 800 }] },
  { key: "front", depth: 0.7, specks: 120, speckR: 4, domes: [{ cx: 40, wl: 300, wr: 360, top: 618, base: 960 }, { cx: 1440, wl: 330, wr: 320, top: 600, base: 960 }] },
  { key: "near", depth: 1, specks: 90, speckR: 4.6, domes: [{ cx: 150, wl: 260, wr: 250, top: 790, base: 1040 }, { cx: 1380, wl: 280, wr: 260, top: 770, base: 1040 }] },
];
const SHRUBS = [{ x: 560, y: 524, r: 26 }, { x: 930, y: 550, r: 20 }];
const SHRUB_LOBES = [[0, 0.05, 0.86], [-0.52, 0.22, 0.58], [0.54, 0.2, 0.6], [-0.24, -0.4, 0.56], [0.28, -0.36, 0.54]];
function growSpecks(seed) {
  const rnd = dhfRng(seed);
  return LAYERS.map((L) => L.domes.map((d) => {
    const out = [], x0 = d.cx - d.wl * 2, x1 = d.cx + d.wr * 2, yMax = Math.min(DHF_H + 10, d.base + 120); let guard = 0;
    while (out.length < L.specks && guard++ < L.specks * 30) {
      const x = x0 + rnd() * (x1 - x0), y = d.top + Math.sqrt(rnd()) * (yMax - d.top);
      if (y < dhfDomeY(d, x) + 3) continue;
      const near = Math.min(1, Math.max(0.15, (y - 380) / (DHF_H - 380)));
      out.push([x, y, Math.max(0.5, L.speckR * near * (0.45 + rnd() * 0.75)), Math.floor(rnd() * 4), 0.35 + rnd() * 0.6]);
    }
    return out;
  }));
}
let dhfAudio = null;
function playHorn() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    if (!dhfAudio) dhfAudio = new AC(); const ctx = dhfAudio; if (ctx.state === "suspended") ctx.resume();
    const t0 = ctx.currentTime + 0.01, lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1500; lp.Q.value = 0.8;
    const master = ctx.createGain(); master.gain.value = 0.16; lp.connect(master); master.connect(ctx.destination);
    const blast = (start, dur, level) => {
      const g = ctx.createGain(); g.gain.setValueAtTime(0, start); g.gain.linearRampToValueAtTime(level, start + 0.018); g.gain.setValueAtTime(level * 0.9, start + dur - 0.05); g.gain.linearRampToValueAtTime(0, start + dur); g.connect(lp);
      for (const f of [311, 392, 466]) { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(f * 1.012, start); o.frequency.linearRampToValueAtTime(f, start + 0.06); o.frequency.linearRampToValueAtTime(f * 0.985, start + dur); o.connect(g); o.start(start); o.stop(start + dur + 0.02); }
    };
    blast(t0, 0.34, 0.7); blast(t0 + 0.44, 0.2, 0.5);
  } catch (e) {}
}

function TruckFace({ colors }) {
  return (
    <g>
      <rect x="-19" y="-8" width="9" height="10" rx="3" fill={colors.wheel} />
      <rect x="10" y="-8" width="9" height="10" rx="3" fill={colors.wheel} />
      <rect x="-20" y="-40" width="40" height="33" rx="5" fill={colors.cab} />
      <path d="M-16 -36 H16 Q17.5 -36 17.2 -34.4 L15.6 -26 Q15.3 -24.6 13.8 -24.6 H-13.8 Q-15.3 -24.6 -15.6 -26 L-17.2 -34.4 Q-17.5 -36 -16 -36 Z" fill={colors.glass} />
      <path d="M-12 -35 L-6 -35 L-11 -25.6 L-14 -25.6 Z" fill="#fff" opacity="0.22" />
      <rect x="-8" y="-21" width="16" height="9" rx="1.6" fill={colors.cabSide} />
      <path d="M-6 -19 H6 M-6 -16.5 H6 M-6 -14 H6" stroke={colors.cab} strokeWidth="1" />
      <rect x="-17" y="-19" width="7" height="5" rx="2" fill={colors.lights} />
      <rect x="10" y="-19" width="7" height="5" rx="2" fill={colors.lights} />
      <rect x="-21" y="-10" width="42" height="4.5" rx="2" fill={colors.cabSide} />
    </g>
  );
}
function SocialIcon({ icon }) {
  const p = { viewBox: "0 0 24 24", width: 18, height: 18, "aria-hidden": true, fill: "currentColor" };
  if (icon === "facebook") return (<svg {...p}><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" /></svg>);
  if (icon === "x") return (<svg {...p}><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" /></svg>);
  if (icon === "instagram") return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={2}><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" /></svg>);
  return (<svg {...p}><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>);
}

const DHF_CSS = `
.dhf-root{position:relative;display:grid;grid-template-rows:auto minmax(var(--dhf-scene-min),1fr);width:100%;overflow:hidden;isolation:isolate;color:var(--dhf-ink);font-family:var(--dhf-sans);-webkit-font-smoothing:antialiased}
.dhf-scene{position:absolute;inset:0;z-index:0;pointer-events:none}
.dhf-glow{position:absolute;left:50%;top:30%;width:120%;height:46%;transform:translateX(-50%);opacity:0;transition:opacity 2.4s ease}
.dhf-in .dhf-glow{opacity:.9}
.dhf-layer{position:absolute;inset:0;opacity:0;transform:translate3d(0,calc(90px + var(--dhf-i) * 40px),0);transition:opacity .9s ease calc(var(--dhf-i) * 110ms),transform 1.6s cubic-bezier(.16,1,.3,1) calc(var(--dhf-i) * 110ms)}
.dhf-in .dhf-layer{opacity:1;transform:none}
.dhf-layer-near{filter:drop-shadow(0 -8px 22px rgba(60,20,140,.16))}
.dhf-layer-front{filter:drop-shadow(0 -6px 18px rgba(60,20,140,.12))}
.dhf-drift{position:absolute;inset:0;will-change:transform}
.dhf-drift svg,.dhf-grain{position:absolute;inset:0;display:block;width:100%;height:100%;max-width:none;overflow:visible}
.dhf-grain{opacity:.06;mix-blend-mode:multiply;overflow:hidden}
.dhf-shrub{transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform .9s cubic-bezier(.34,1.56,.64,1) calc(700ms + var(--dhf-sd) * 160ms)}
.dhf-in .dhf-shrub{transform:none}
.dhf-wrap{position:relative;z-index:2;padding:clamp(28px,6vw,76px) clamp(16px,4vw,56px) 0}
.dhf-card{position:relative;width:100%;max-width:var(--dhf-max);margin:0 auto;background:var(--dhf-card);border-radius:24px;padding:clamp(22px,3vw,34px) clamp(20px,3vw,34px) clamp(18px,2.4vw,24px);box-shadow:0 0 0 1px rgba(60,20,140,.06),0 30px 60px -32px rgba(60,20,140,.38),0 12px 24px -18px rgba(60,20,140,.2);opacity:0;transform:translateY(28px) scale(.985);transition:opacity .9s ease .2s,transform 1.2s cubic-bezier(.16,1,.3,1) .2s}
.dhf-in .dhf-card{opacity:1;transform:none}
.dhf-r{opacity:0;transform:translateY(10px);filter:blur(4px);transition:opacity .7s ease,transform .9s cubic-bezier(.16,1,.3,1),filter .7s ease;transition-delay:calc(450ms + var(--d) * 70ms)}
.dhf-in .dhf-r{opacity:1;transform:none;filter:none}
.dhf-top{display:flex;justify-content:space-between;gap:32px 48px;flex-wrap:wrap}
.dhf-brandcol{display:flex;flex-direction:column;gap:14px;max-width:320px}
.dhf-brand{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;color:var(--dhf-ink);text-decoration:none;font-weight:600;font-size:22px;letter-spacing:-.02em;border-radius:8px;outline:none}
.dhf-brand img{width:34px;height:34px;padding:5px 6px;box-sizing:border-box;border-radius:10px;background:#7B45F5;object-fit:contain;flex:none;transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
.dhf-brand:hover img{transform:rotate(-10deg) scale(1.06)}
.dhf-tag{margin:0;font-size:14px;line-height:1.55;color:var(--dhf-muted);text-wrap:pretty}
.dhf-cols{display:grid;grid-template-columns:repeat(3,auto);gap:24px clamp(28px,5vw,64px)}
.dhf-col h3{margin:0 0 10px;font-size:14px;font-weight:600;letter-spacing:-.005em;color:var(--dhf-ink)}
.dhf-col ul{margin:0;padding:0;list-style:none;display:grid;gap:6px}
.dhf-link{position:relative;display:inline-flex;padding:2px 0;font-size:14px;line-height:1.45;font-weight:500;color:var(--dhf-muted);text-decoration:none;border-radius:4px;outline:none;transition:color .3s}
.dhf-link::after{content:"";position:absolute;left:0;right:0;bottom:1px;height:1.5px;border-radius:2px;background:var(--dhf-accent);transform:scaleX(0);transform-origin:100% 50%;transition:transform .4s cubic-bezier(.16,1,.3,1)}
.dhf-link:hover,.dhf-link:focus-visible{color:var(--dhf-accent)}
.dhf-roll{display:flex;overflow:hidden;line-height:1.3;white-space:pre}
.dhf-ch{display:inline-block;white-space:pre;text-shadow:0 1.3em currentColor;transition:transform .6s cubic-bezier(.65,.05,.36,1)}
.dhf-link:hover .dhf-ch,.dhf-link:focus-visible .dhf-ch,.dhf-cta:hover .dhf-ch,.dhf-cta:focus-visible .dhf-ch{transform:translateY(-100%)}
@media (prefers-reduced-motion:reduce){.dhf-ch{transition:none}}

.dhf-rule{height:1px;margin:clamp(24px,3.4vw,34px) 0 clamp(16px,2vw,18px);background:var(--dhf-line);transform:scaleX(0);transform-origin:0 50%;transition:transform 1.2s cubic-bezier(.16,1,.3,1) .7s}
.dhf-in .dhf-rule{transform:none}
.dhf-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.dhf-bar p{margin:0;font-size:13px;color:var(--dhf-muted)}
.dhf-social{display:flex;gap:10px;margin:0;padding:0;list-style:none}
.dhf-social a{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;color:var(--dhf-ink);border:1px solid var(--dhf-line);background:var(--dhf-card);outline:none;transition:background .3s ease,color .3s ease,border-color .3s ease,transform .45s cubic-bezier(.34,1.56,.64,1),box-shadow .3s ease}
.dhf-social a:hover{background:var(--dhf-accent);color:var(--dhf-accent-ink);border-color:var(--dhf-accent);transform:translateY(-3px);box-shadow:0 10px 18px -8px var(--dhf-accent)}
.dhf-link:focus-visible,.dhf-brand:focus-visible,.dhf-social a:focus-visible,.dhf-hit:focus-visible{outline:2px solid var(--dhf-accent);outline-offset:3px}
.dhf-hero{position:absolute;left:50%;bottom:-2%;height:min(78%,620px);aspect-ratio:496 / 864;transform:translateX(-50%);opacity:0;transition:opacity 1.4s ease 1.2s;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 58%,#000 62%,transparent 100%);mask-image:radial-gradient(ellipse 50% 50% at 50% 58%,#000 62%,transparent 100%)}
.dhf-in .dhf-hero{opacity:1}
.dhf-hero video{display:block;width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply}
.dhf-chip{position:absolute;left:0;top:0;z-index:4;pointer-events:none;opacity:0;display:flex;align-items:center;gap:8px;padding:7px 12px 7px 7px;border-radius:12px;background:#fff;color:#25103F;font-weight:600;font-size:13px;line-height:1.1;white-space:nowrap;box-shadow:0 0 0 1px rgba(60,20,140,.06),0 10px 24px -10px rgba(60,20,140,.4);transform-origin:50% 100%;transition:opacity .45s ease,transform .5s cubic-bezier(.34,1.56,.64,1)}
.dhf-chip-ic{width:22px;height:22px;border-radius:7px;background:#7B45F5;display:grid;place-items:center}
.dhf-chip-l{padding:7px 12px 7px 9px;transform-origin:100% 100%}
.dhf-spacer{position:relative;z-index:1;pointer-events:none}
.dhf-hit{position:absolute;left:0;top:0;z-index:3;padding:0;margin:0;border:0;border-radius:14px;background:transparent;cursor:pointer;visibility:hidden;-webkit-tap-highlight-color:transparent}
.dhf-bubble{position:absolute;left:0;top:0;z-index:4;pointer-events:none;opacity:0;transform:translate(-50%,0);padding:6px 12px 7px;border-radius:999px;background:var(--dhf-card);color:var(--dhf-accent);font-weight:600;font-size:13px;letter-spacing:.02em;box-shadow:0 0 0 1px rgba(60,20,140,.06),0 10px 22px -10px rgba(60,20,140,.45);white-space:nowrap}
.dhf-bubble::after{content:"";position:absolute;left:50%;bottom:-5px;width:10px;height:10px;margin-left:-5px;background:var(--dhf-card);transform:rotate(45deg);border-radius:0 0 3px 0}
.dhf-cta{position:relative;isolation:isolate;display:inline-flex!important;align-self:flex-start;width:max-content;align-items:center;justify-content:center;margin-top:20px;height:44px;padding:0 20px;border-radius:14px;color:#fff;font-size:15px;font-weight:600;letter-spacing:-.01em;text-decoration:none;outline:none}
.dhf-cta-bg{position:absolute;inset:0;z-index:-1;border-radius:14px;border:0 solid transparent;background-color:#7B45F5;box-shadow:0 8px 24px rgba(37,16,63,.16),inset 0 0 .5rem rgba(255,255,255,.4);transition:inset .6s cubic-bezier(.65,.05,.36,1),background-color .6s cubic-bezier(.65,.05,.36,1),border-color .6s cubic-bezier(.65,.05,.36,1),border-width .6s cubic-bezier(.65,.05,.36,1)}
.dhf-cta:hover .dhf-cta-bg,.dhf-cta:focus-visible .dhf-cta-bg{inset:2px;border-width:2px;border-color:rgba(250,248,254,.3);background-color:#9569F7}
.dhf-cta:focus-visible{box-shadow:0 0 0 3px rgba(123,69,245,.35);border-radius:14px}
.dhf-cta,.dhf-cta:hover,.dhf-cta:focus-visible,.dhf-cta:visited{color:#fff!important}
.dhf-cta .dhf-ch{color:#fff;transition:transform .6s cubic-bezier(.65,.05,.36,1)}
@media (max-width:760px){.dhf-top{flex-direction:column}.dhf-cols{grid-template-columns:repeat(2,minmax(0,1fr));width:100%}.dhf-bar{flex-direction:column-reverse;align-items:flex-start}}
@media (pointer:coarse),(max-width:1280px){.dhf-link{padding:12px 0!important;min-height:44px;align-items:center}.dhf-col ul{gap:0!important}.dhf-brand{min-height:44px}.dhf-social a{width:44px!important;height:44px!important}.dhf-social{gap:8px}}
@media (prefers-reduced-motion:reduce){.dhf-layer,.dhf-card,.dhf-r,.dhf-rule,.dhf-shrub,.dhf-glow,.dhf-link,.dhf-link::after,.dhf-social a{transition:none!important}}
`;

function DuneHaulFooter({
  name = "BetOnYou", brandHref = "BetOnYou Landing V2.dc.html", logoSrc = "boy-logo-mrey8juw.svg",
  tagline = "Set personal challenges, prove your progress, and find people who believe in you.",
  ctaLabel = "Get the app", onGetApp,
  columns = [
    { title: "Explore", links: [{ label: "AI Coach", href: "BetOnYou AI Coach V2.dc.html" }, { label: "How it works", href: "BetOnYou How It Works V2 Stage.dc.html" }, { label: "Learn", href: "BetOnYou Learn V2.dc.html" }] },
    { title: "Company", links: [{ label: "About", href: "BetOnYou About V2.dc.html" }, { label: "Contact", href: "BetOnYou Contact V2.dc.html" }] },
    { title: "Legal", links: [{ label: "Privacy Policy", href: "Privacy Policy V2.dc.html" }, { label: "Terms of Service", href: "Terms of Service V2.dc.html" }, { label: "Cookie Policy", href: "Cookie Policy V2.dc.html" }] },
  ],
  socials = [{ icon: "instagram", href: "#" }, { icon: "linkedin", href: "#" }, { icon: "x", href: "#" }, { icon: "facebook", href: "#" }],
  copyright, heroVideo = "", seed = 11, tripSeconds = 11, honk = "Let's go!", greet = true, sound = true, parallax = true,
  maxWidth = "1320px", fontFamily = "'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", height = "780px", sceneMinHeight = "300px",
}) {
  const c = P;
  const rootRef = React.useRef(null), sceneRef = React.useRef(null), layerRefs = React.useRef([]), roadRefs = React.useRef([]);
  const truckRef = React.useRef(null), partRefs = React.useRef({}), puffRefs = React.useRef([]), hitRef = React.useRef(null), bubbleRef = React.useRef(null);
  const runRef = React.useRef(null), runBodyRef = React.useRef(null), rLegL = React.useRef(null), rLegR = React.useRef(null), rArmL = React.useRef(null), rArmR = React.useRef(null), mascRef = React.useRef(null), mBodyRef = React.useRef(null), mArmL = React.useRef(null), mArmR = React.useRef(null), sparkRef = React.useRef(null), chipKeepRef = React.useRef(null), chipStreakRef = React.useRef(null);
  const heroVidRef = React.useRef(null), honkAt = React.useRef(-Infinity), boostAt = React.useRef(-Infinity), revealAt = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  const uid = "dhf" + React.useId().replace(/[^A-Za-z0-9_-]/g, "");
  const specks = React.useMemo(() => growSpecks(seed), [seed]);
  const road = React.useMemo(() => dhfRoad(ROAD_PTS, 36), []);
  const opts = React.useRef({ tripSeconds, greet, sound, parallax, video: !!heroVideo });
  opts.current = { tripSeconds, greet, sound, parallax, video: !!heroVideo };

  React.useEffect(() => {
    const root = rootRef.current; if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      if (revealAt.current === null) revealAt.current = reduced ? -Infinity : performance.now();
      setInView(true); io.disconnect();
      const hv = heroVidRef.current; if (hv) { hv.muted = true; hv.play().catch(() => {}); }
    }, { threshold: 0.16 });
    io.observe(root); return () => io.disconnect();
  }, []);

  const honkNow = React.useCallback((withSound) => {
    const now = performance.now(); if (now - honkAt.current < 450) return;
    honkAt.current = now; boostAt.current = now;
    if (withSound && opts.current.sound) playHorn();
    const b = bubbleRef.current;
    if (b && b.animate) {
      b.getAnimations().forEach((a) => a.cancel());
      b.animate([
        { opacity: 0, transform: "translate(-50%, 6px) scale(.4) rotate(-12deg)" },
        { opacity: 1, transform: "translate(-50%, -4px) scale(1.12) rotate(4deg)", offset: 0.14 },
        { opacity: 1, transform: "translate(-50%, 0) scale(1) rotate(-2deg)", offset: 0.26 },
        { opacity: 1, transform: "translate(-50%, -2px) scale(1) rotate(0deg)", offset: 0.8 },
        { opacity: 0, transform: "translate(-50%, -14px) scale(.9) rotate(0deg)" },
      ], { duration: 1300, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
  }, []);

  React.useEffect(() => {
    const root = rootRef.current, scene = sceneRef.current, truck = truckRef.current; if (!root || !scene || !truck) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = road[road.length - 1].s, cost = dhfTripCost(road), parts = partRefs.current;
    let w = scene.clientWidth, h = scene.clientHeight, fit = dhfFit(w, h), raf = 0, visible = false, last = performance.now();
    let s = reduced ? dhfAtTime(road, 0.62) : -1, waitUntil = 0, greeted = false, paved = -1, px = 0, py = 0, tx = 0, ty = 0, scrollE = 1;
    const offs = LAYERS.map(() => [0, 0]);
    const puffs = Array.from({ length: 10 }, () => ({ x: 0, y: 0, r: 0, born: -1e9, life: 900 }));
    let puffNext = 0, puffI = 0, this_prevD = -99, sparkAt = -1e9;
    const pave = (upto) => {
      if (Math.abs(upto - paved) < 0.5) return; paved = upto; const hw = ROAD_W / 2;
      [[-hw * 1.1, hw * 1.1], [-hw, hw], [-hw * 0.9, -hw * 0.86], [hw * 0.86, hw * 0.9], [-hw, -hw * 0.95]].forEach((b, i) => { const el = roadRefs.current[i]; if (el) el.setAttribute("d", dhfBand(road, b[0], b[1], upto)); });
    };
    const set = (k, d) => { const el = parts[k]; if (el) el.setAttribute("d", d); };
    const frame = () => {
      raf = 0; const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
      const o = opts.current, t0 = revealAt.current, since = t0 === null ? -1 : now - t0;
      if (t0 === null) pave(0); else if (t0 === -Infinity) pave(total + 1); else pave(since > 2400 ? total + 1 : dhfAtTime(road, dhfEaseOut((since - 800) / 1600)));
      const go = t0 !== null && (t0 === -Infinity || since > 1900);
      if (go && !reduced) {
        if (s < 0) { if (now >= waitUntil) s = 0; }
        else { const p = dhfAt(road, s), boost = 1 + 0.9 * Math.exp(-(now - boostAt.current) / 900); const dM = s - dhfAtTime(road, 0.6), slow = 0.22 + 0.78 * Math.min(1, Math.abs(dM) / 1.1); s += (cost / o.tripSeconds) * dhfPace(p.Z) * boost * slow * dt; if (s > total) { s = -1; waitUntil = now + 1800; } }
      }
      let truckVisible = false;
      if (false) {
        const p = dhfAt(road, s), [lx, ly] = dhfProject(p.X + p.nX * LANE, p.Z + p.nZ * LANE), sc = (DHF_F / p.Z) * TRUCK_K;
        const since2 = now - honkAt.current, bounce = reduced ? 0 : Math.sin(Math.min(1, since2 / 380) * Math.PI) * 3.5, idle = reduced ? 0 : Math.sin(now / 55) * 0.25, fade = Math.min(1, s / 2.5);
        truck.setAttribute("transform", "translate(" + lx.toFixed(2) + " " + ly.toFixed(2) + ") scale(" + sc.toFixed(4) + ")"); truck.style.opacity = String(fade);
        const geo = dhfTruck(p.dx, p.dy), lift = -bounce + idle, lifted = (q) => q.map((v) => [v[0], v[1] + lift]);
        set("tHull", dhfPoly(lifted(geo.trailer.hull))); set("tTop", dhfPoly(lifted(geo.trailer.top))); set("tFront", dhfPoly(lifted(geo.trailer.front))); set("tSide", dhfPoly(lifted(geo.trailer.side)));
        set("cHull", dhfPoly(lifted(geo.cab.hull))); set("cTop", dhfPoly(lifted(geo.cab.top))); set("cSide", dhfPoly(lifted(geo.cab.side)));
        const rr = geo.trailer.rear;
        set("shadow", dhfPoly(dhfHull([[-24, 2], [24, 2], [rr[2][0] + 2, rr[2][1] + 15], [rr[3][0] - 2, rr[3][1] + 15]])));
        const ring = (list, r) => list.map((q) => dhfWheel([q[0], q[1] + lift], geo.axis, r)).join("");
        set("wheels", ring(geo.wheels, 6.5)); set("hubs", ring(geo.wheels, 2.6)); set("cWheels", ring(geo.cabWheels, 6.5)); set("cHubs", ring(geo.cabWheels, 2.6));
        if (parts.face) parts.face.setAttribute("transform", "translate(0 " + lift.toFixed(2) + ")");
        const flash = Math.exp(-since2 / 260);
        if (parts.beams) parts.beams.style.opacity = String(flash * 0.9);
        if (parts.flare) parts.flare.style.opacity = String(flash);
        if (false) { puffNext = now + 140; const pf = puffs[puffI++ % puffs.length], side = puffI % 2 ? rr[3] : rr[2]; pf.x = lx + side[0] * sc; pf.y = ly + (side[1] + 10) * sc; pf.r = 3.2 * sc; pf.born = now; }
        if (o.greet && !greeted && !reduced && p.Z < 3.4) { greeted = true; honkNow(false); }
        const L = offs[2], cx = fit.ox + lx * fit.s + L[0], cy = fit.oy + ly * fit.s + L[1], size = Math.max(40, 64 * sc * fit.s), hit = hitRef.current;
        if (hit) { hit.style.transform = "translate(" + (cx - size / 2).toFixed(1) + "px," + (cy - size * 0.95).toFixed(1) + "px)"; hit.style.width = size.toFixed(1) + "px"; hit.style.height = size.toFixed(1) + "px"; hit.style.visibility = fade > 0.5 && cy < h + 10 ? "visible" : "hidden"; }
        const bub = bubbleRef.current; if (bub) { bub.style.left = cx.toFixed(1) + "px"; bub.style.top = (cy - 74 * sc * fit.s - 10).toFixed(1) + "px"; }
        truckVisible = true;
      }
      if (!truckVisible) { truck.style.opacity = "0"; if (hitRef.current) hitRef.current.style.visibility = "hidden"; }
      {
        const run = runRef.current, masc = mascRef.current, sm = (v) => { v = Math.min(1, Math.max(0, v)); return v * v * (3 - 2 * v); };
        if (run && masc) {
          const sM = dhfAtTime(road, 0.6), pm = dhfAt(road, sM), [rmx, rmy] = dhfProject(pm.X + pm.nX * LANE, pm.Z + pm.nZ * LANE), msc = (DHF_F / pm.Z) * TRUCK_K * 0.92, mx0 = rmx + 72 * msc, my0 = rmy;
          const t2 = now / 1000, bobM = reduced ? 0 : Math.sin(t2 * 3.2) * 1.2;
          masc.setAttribute("transform", "translate(" + mx0.toFixed(2) + " " + my0.toFixed(2) + ") scale(" + msc.toFixed(4) + ")");
          masc.style.opacity = String(sm((since - 1200) / 600));
          if (mBodyRef.current) mBodyRef.current.setAttribute("transform", "translate(0 " + bobM.toFixed(2) + ")");
          const d = s >= 0 ? s - sM : -99, hf = reduced ? 1 : 1 - sm(Math.abs(d) / 0.9);
          if (s >= 0 && this_prevD < -0.02 && d >= -0.02) sparkAt = now;
          this_prevD = d;
          if (mArmR.current) mArmR.current.setAttribute("transform", "rotate(" + (-18 + Math.sin(t2 * 3.2) * 6).toFixed(1) + " 17 -44)");
          if (mArmL.current) mArmL.current.setAttribute("transform", "rotate(" + (18 + 112 * hf + Math.sin(t2 * 6) * 6 * (1 - hf)).toFixed(1) + " -19 -44)");
          let rvis = false;
          if (s >= 0) {
            const p = dhfAt(road, s), [lx, ly] = dhfProject(p.X + p.nX * LANE, p.Z + p.nZ * LANE), sc = (DHF_F / p.Z) * TRUCK_K;
            const ph = reduced ? 0 : now / 95, sw = Math.sin(ph) * (1 - hf);
            run.setAttribute("transform", "translate(" + lx.toFixed(2) + " " + ly.toFixed(2) + ") scale(" + sc.toFixed(4) + ")");
            run.style.opacity = String(Math.min(1, s / 2.5));
            if (runBodyRef.current) runBodyRef.current.setAttribute("transform", "translate(0 " + (-Math.abs(Math.cos(ph)) * 2.4 * (1 - hf)).toFixed(2) + ")");
            if (rLegL.current) rLegL.current.setAttribute("transform", "rotate(" + (sw * 26).toFixed(1) + " -5 -28)");
            if (rLegR.current) rLegR.current.setAttribute("transform", "rotate(" + (-sw * 26).toFixed(1) + " 5 -28)");
            if (rArmL.current) rArmL.current.setAttribute("transform", "rotate(" + (-sw * 34).toFixed(1) + " -11 -50)");
            if (rArmR.current) rArmR.current.setAttribute("transform", "rotate(" + (sw * 34 - 130 * hf).toFixed(1) + " 11 -50)");
            rvis = true;
            const L = offs[2], rx = fit.ox + lx * fit.s + L[0], ry = fit.oy + ly * fit.s + L[1];
            const st = chipStreakRef.current;
            if (st) { const on = d > 0.15; st.style.opacity = on ? "1" : "0"; st.style.transform = "translate(-100%,0) translate(" + (rx - 18 * sc * fit.s).toFixed(1) + "px," + (ry - 86 * sc * fit.s).toFixed(1) + "px) scale(" + (on ? 1 : 0.8) + ")"; }
          }
          if (!rvis) { run.style.opacity = "0"; if (chipStreakRef.current) chipStreakRef.current.style.opacity = "0"; }
          const L = offs[2], mxs = fit.ox + mx0 * fit.s + L[0], mys = fit.oy + my0 * fit.s + L[1];
          const kg = chipKeepRef.current;
          if (kg) { const on = reduced || (d > -1.8 && d < 1.4); kg.style.opacity = on ? "1" : "0"; kg.style.transform = "translate(-50%,0) translate(" + (mxs + 4 * msc * fit.s).toFixed(1) + "px," + (mys - 128 * msc * fit.s).toFixed(1) + "px) scale(" + (on ? 1 : 0.8) + ")"; }
          const sp = sparkRef.current;
          if (sp) { const a = (now - sparkAt) / 700; sp.style.opacity = a >= 0 && a < 1 ? String(1 - a) : "0"; sp.setAttribute("transform", "translate(" + (rmx + 31 * msc).toFixed(1) + " " + (rmy - 72 * msc).toFixed(1) + ") scale(" + (msc * (0.8 + Math.max(0, Math.min(1, a)) * 0.6)).toFixed(3) + ")"); }
        }
      }
      puffs.forEach((pf, i) => {
        const el = puffRefs.current[i]; if (!el) return; const a = (now - pf.born) / pf.life;
        if (a < 0 || a > 1) { el.style.opacity = "0"; return; }
        el.setAttribute("cx", (pf.x + a * pf.r * 1.5).toFixed(1)); el.setAttribute("cy", (pf.y - a * pf.r * 2).toFixed(1)); el.setAttribute("r", (pf.r * (0.6 + a * 1.8)).toFixed(2)); el.style.opacity = ((1 - a) * 0.4).toFixed(3);
      });
      if (o.parallax && !reduced) { const r = root.getBoundingClientRect(), vh = window.innerHeight || 1; scrollE = Math.min(1, Math.max(0, (vh - r.top) / Math.max(1, r.height))); tx += (px - tx) * Math.min(1, dt * 4); ty += (py - ty) * Math.min(1, dt * 4); }
      else { scrollE = 1; tx = 0; ty = 0; }
      LAYERS.forEach((Ly, i) => { const el = layerRefs.current[i]; if (!el) return; const ox = -tx * Ly.depth * 22, oy = (1 - scrollE) * Ly.depth * 140 - ty * Ly.depth * 8; offs[i][0] = ox; offs[i][1] = oy; el.style.transform = "translate3d(" + ox.toFixed(2) + "px," + oy.toFixed(2) + "px,0)"; });
      if (visible) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const onMove = (e) => { const r = scene.getBoundingClientRect(); px = ((e.clientX - r.left) / Math.max(1, r.width)) * 2 - 1; py = ((e.clientY - r.top) / Math.max(1, r.height)) * 2 - 1; };
    const onLeave = () => { px = 0; py = 0; };
    root.addEventListener("pointermove", onMove); root.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(() => { w = scene.clientWidth; h = scene.clientHeight; fit = dhfFit(w, h); kick(); }); ro.observe(scene);
    const io = new IntersectionObserver((entries) => { visible = entries.some((e) => e.isIntersecting); if (visible) kick(); }); io.observe(root);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); root.removeEventListener("pointermove", onMove); root.removeEventListener("pointerleave", onLeave); };
  }, [road, honkNow]);

  const line = copyright || "© " + new Date().getFullYear() + " " + name + " Inc. All rights reserved.";
  const g = (k) => uid + "-" + k;
  const layerColors = [c.far, c.mid, c.ground, c.front, c.near];

  return (
    <footer ref={rootRef} data-screen-label="Footer" className={"dhf-root" + (inView ? " dhf-in" : "")} style={{ minHeight: height, "--dhf-card": c.card, "--dhf-ink": c.ink, "--dhf-muted": c.muted, "--dhf-line": c.line, "--dhf-accent": c.accent, "--dhf-accent-ink": c.accentInk, "--dhf-max": maxWidth, "--dhf-scene-min": sceneMinHeight, "--dhf-sans": fontFamily, background: "linear-gradient(180deg, " + c.sky[0] + " 0%, " + c.sky[0] + " 22%, " + c.sky[1] + " 62%)" }}>
      <style>{DHF_CSS}</style>
      <div ref={sceneRef} className="dhf-scene" aria-hidden="true">
        <div className="dhf-glow" style={{ background: "radial-gradient(closest-side, " + c.glow + ", transparent)" }} />
        {LAYERS.map((L, li) => {
          const col = layerColors[li];
          return (
            <div key={L.key} className={"dhf-layer dhf-layer-" + L.key} style={{ "--dhf-i": li }}>
              <div ref={(el) => { layerRefs.current[li] = el; }} className="dhf-drift">
                <svg viewBox={"0 0 " + DHF_W + " " + DHF_H} preserveAspectRatio="xMidYMax slice">
                  <defs>
                    <radialGradient id={g("d" + li)} cx="0.4" cy="0.08" r="0.8" fx="0.36" fy="0.04"><stop offset="0" stopColor={col[0]} /><stop offset="0.42" stopColor={col[1]} /><stop offset="1" stopColor={col[2]} /></radialGradient>
                    {li === 1 ? (<linearGradient id={g("haze")} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.sky[1]} stopOpacity="0" /><stop offset="0.55" stopColor={c.sky[1]} stopOpacity="0.6" /><stop offset="1" stopColor={c.sky[1]} stopOpacity="0" /></linearGradient>) : null}
                  </defs>
                  {li === 1 ? <rect x="-300" y="430" width={DHF_W + 600} height="230" fill={"url(#" + g("haze") + ")"} /> : null}
                  {li === 0 ? SHRUBS.map((b, bi) => (
                    <g key={bi} className="dhf-shrub" style={{ "--dhf-sd": bi }}>
                      <defs><radialGradient id={g("s" + bi)} gradientUnits="userSpaceOnUse" cx={b.x - b.r * 0.35} cy={b.y - b.r * 0.55} r={b.r * 1.5}><stop offset="0" stopColor={c.shrub[0]} /><stop offset="1" stopColor={c.shrub[1]} /></radialGradient></defs>
                      {SHRUB_LOBES.map((l, i) => <circle key={i} cx={b.x + l[0] * b.r} cy={b.y + l[1] * b.r} r={l[2] * b.r} fill={"url(#" + g("s" + bi) + ")"} />)}
                      {SHRUB_LOBES.map((l, i) => <circle key={"f" + i} cx={b.x + (l[0] * 0.8 + 0.12) * b.r} cy={b.y + (l[1] * 0.7 - 0.1) * b.r} r={b.r * 0.06} fill={c.specks[i % c.specks.length]} opacity="0.7" />)}
                    </g>
                  )) : null}
                  {L.domes.map((d, di) => (
                    <g key={di}>
                      <path d={dhfDomePath(d)} fill={"url(#" + g("d" + li) + ")"} />
                      <path d={dhfCrestPath(d)} fill="none" stroke={col[0]} strokeWidth={1.5 + li * 0.5} strokeLinecap="round" opacity="0.7" />
                      {specks[li][di].map((p, pi) => <circle key={pi} cx={p[0].toFixed(1)} cy={p[1].toFixed(1)} r={p[2].toFixed(2)} fill={c.specks[p[3] % c.specks.length]} opacity={p[4].toFixed(2)} />)}
                    </g>
                  ))}
                  {li === 2 ? (
                    <g>
                      <defs>
                        <linearGradient id={g("fade")} gradientUnits="userSpaceOnUse" x1="0" y1="586" x2="0" y2="640"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="1" /></linearGradient>
                        <mask id={g("mask")} maskUnits="userSpaceOnUse" x="-300" y="0" width={DHF_W + 600} height={DHF_H + 200}><rect x="-300" y="560" width={DHF_W + 600} height={DHF_H} fill={"url(#" + g("fade") + ")"} /></mask>
                        <linearGradient id={g("road")} gradientUnits="userSpaceOnUse" x1="0" y1="586" x2="0" y2="900"><stop offset="0" stopColor={c.road} stopOpacity="0.85" /><stop offset="1" stopColor={c.road} /></linearGradient>
                        <linearGradient id={g("beam")} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.truck.lights} stopOpacity="0.85" /><stop offset="1" stopColor={c.truck.lights} stopOpacity="0" /></linearGradient>
                        <filter id={g("soft")} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
                      </defs>
                      <g mask={"url(#" + g("mask") + ")"}>
                        <path ref={(el) => { roadRefs.current[0] = el; }} fill={c.roadShade} opacity="0.32" />
                        <path ref={(el) => { roadRefs.current[1] = el; }} fill={"url(#" + g("road") + ")"} />
                        <path ref={(el) => { roadRefs.current[2] = el; }} fill={c.roadEdge} opacity="0.75" />
                        <path ref={(el) => { roadRefs.current[3] = el; }} fill={c.roadEdge} opacity="0.75" />
                        <path ref={(el) => { roadRefs.current[4] = el; }} fill="#fff" opacity="0.35" />
                      </g>
                      {Array.from({ length: 10 }, (_, i) => <circle key={i} ref={(el) => { puffRefs.current[i] = el; }} fill={c.road} filter={"url(#" + g("soft") + ")"} style={{ opacity: 0 }} />)}
                      <g ref={truckRef} style={{ opacity: 0 }}>
                        <path ref={(el) => { partRefs.current.shadow = el; }} fill={c.roadShade} opacity="0.32" filter={"url(#" + g("soft") + ")"} />
                        <path ref={(el) => { partRefs.current.beams = el; }} d="M-16 -16 L-60 70 L60 70 L16 -16 Z" fill={"url(#" + g("beam") + ")"} style={{ opacity: 0, mixBlendMode: "screen" }} />
                        <path ref={(el) => { partRefs.current.wheels = el; }} fill={c.truck.wheel} />
                        <path ref={(el) => { partRefs.current.hubs = el; }} fill={c.truck.cabSide} />
                        <path ref={(el) => { partRefs.current.tHull = el; }} fill={c.truck.trailerSide} />
                        <path ref={(el) => { partRefs.current.tSide = el; }} fill={c.truck.trailerSide} />
                        <path ref={(el) => { partRefs.current.tFront = el; }} fill={c.truck.trailer} />
                        <path ref={(el) => { partRefs.current.tTop = el; }} fill={c.truck.trailerTop} />
                        <path ref={(el) => { partRefs.current.cWheels = el; }} fill={c.truck.wheel} />
                        <path ref={(el) => { partRefs.current.cHubs = el; }} fill={c.truck.cabSide} />
                        <path ref={(el) => { partRefs.current.cHull = el; }} fill={c.truck.cabSide} />
                        <path ref={(el) => { partRefs.current.cSide = el; }} fill={c.truck.cabSide} />
                        <path ref={(el) => { partRefs.current.cTop = el; }} fill={c.truck.cabTop} />
                        <g ref={(el) => { partRefs.current.face = el; }}>
                          <TruckFace colors={c.truck} />
                          <path ref={(el) => { partRefs.current.flare = el; }} d="M-19 -15 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M9 -15 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0" fill={c.truck.lights} filter={"url(#" + g("soft") + ")"} style={{ opacity: 0 }} />
                        </g>
                      </g>
                      <g ref={mascRef} style={{ opacity: 0 }}>
                        <ellipse cx="0" cy="1" rx="22" ry="4.5" fill={c.roadShade} opacity="0.22" />
                        <g ref={mBodyRef}>
                          <rect x="-12" y="-16" width="7" height="15" rx="3.5" fill="#1A0B2E" /><rect x="4" y="-16" width="7" height="15" rx="3.5" fill="#1A0B2E" />
                          <rect x="-15" y="-4" width="12" height="6" rx="3" fill="#7B45F5" /><rect x="2" y="-4" width="12" height="6" rx="3" fill="#7B45F5" /><rect x="-15" y="0" width="12" height="2.2" rx="1.1" fill="#fff" /><rect x="2" y="0" width="12" height="2.2" rx="1.1" fill="#fff" />
                          <g ref={mArmL}><rect x="-22" y="-46" width="6" height="20" rx="3" fill="#1A0B2E" /><circle cx="-19" cy="-25" r="5" fill="#fff" stroke="#E6DEF4" strokeWidth="1" /></g>
                          <path d="M-16 -54 H8 L12 -48 L2 -30 V-20 H-12 V-30 Q-17 -38 -17 -48 Z" fill="#fff" />
                          <g transform="translate(-31 -89) scale(2.6)" fill="#7B45F5" stroke="#5A2FD0" strokeWidth="0.35" strokeLinejoin="round">
                            <path d="M17.9584 8.45681C18.1602 8.38365 18.3851 8.47227 18.4824 8.66359L21.1847 13.9826C21.2528 14.1165 21.245 14.2764 21.1642 14.4031L16.5205 21.6913C16.4743 21.7639 16.4512 21.8489 16.4544 21.9349L16.6886 28.4146C16.6973 28.6549 16.5048 28.8546 16.2641 28.8547H6.37713C6.14241 28.8547 5.95203 28.6644 5.95203 28.4298V22.5522C5.95203 22.4523 5.91669 22.356 5.85372 22.2784C4.92331 21.1325 3.28926 18.6061 3.15413 16.3953C3.1401 16.1658 3.33012 15.9828 3.56012 15.9828H5.26966C5.4695 15.9828 5.6414 16.1219 5.69337 16.3147C6.01768 17.5182 6.89707 19.7483 8.45528 21.293C8.53834 21.3753 8.58707 21.4866 8.5871 21.6035V26.3058C8.58712 26.5403 8.77727 26.7306 9.01192 26.7307H13.4601C13.7004 26.7307 13.8931 26.5323 13.8852 26.2922C13.8404 24.9289 13.7722 22.7628 13.7722 22.3974C13.7722 21.8877 13.8147 21.0806 14.3247 20.2735C14.7167 19.6531 16.9964 16.1081 18.2176 14.2107C18.3063 14.0729 18.3072 13.8973 18.2209 13.7581L17.0924 11.9372C16.986 11.7655 16.7732 11.6925 16.5837 11.7625L12.855 13.1419C12.1161 13.4152 11.296 13.0321 11.0319 12.2901L10.7566 11.5164C10.6784 11.2964 10.7926 11.0543 11.0122 10.9747L17.9584 8.45681Z" />
                            <path d="M5.44025 9.37888C5.67496 9.37888 5.86532 9.56892 5.86535 9.80351V14.4764C5.86535 14.711 5.67497 14.9013 5.44025 14.9013H3.57036C3.33564 14.9013 3.14526 14.711 3.14526 14.4764V9.80351C3.14529 9.56892 3.33566 9.37888 3.57036 9.37888H5.44025Z" />
                            <path d="M9.01081 6.745C9.24553 6.745 9.4359 6.9353 9.43591 7.16991V13.2451C9.43591 13.4798 9.24554 13.6701 9.01081 13.6701H7.14093C6.9062 13.6701 6.71583 13.4798 6.71583 13.2451V7.16991C6.71585 6.9353 6.90622 6.745 7.14093 6.745H9.01081Z" />
                            <path d="M12.5817 4.89256C12.8163 4.89261 13.0065 5.08288 13.0065 5.31747V9.00767C13.0065 9.1874 12.8934 9.34771 12.724 9.40795L10.8538 10.0726C10.5772 10.1708 10.2868 9.96571 10.2867 9.67231V5.31747C10.2867 5.08286 10.4768 4.89258 10.7115 4.89256H12.5817Z" />
                            <path d="M16.1522 3.14531C16.3869 3.14534 16.577 3.33562 16.577 3.57022V7.71468C16.577 7.89377 16.4648 8.05369 16.2962 8.1144L14.4261 8.78761C14.1491 8.88728 13.8573 8.68236 13.8572 8.38816V3.57022C13.8572 3.33562 14.0474 3.14535 14.2821 3.14531H16.1522Z" />
                          </g>
                          <path d="M-11 -47.2 Q-8.2 -49.6 -5.2 -47.6" fill="none" stroke="#1A0B2E" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M0.2 -47.6 Q3.2 -49.6 6 -47.2" fill="none" stroke="#1A0B2E" strokeWidth="1.5" strokeLinecap="round" />
                          <ellipse cx="-8" cy="-41.2" rx="2.1" ry="2.9" fill="#1A0B2E" />
                          <ellipse cx="-8" cy="-39.8" rx="1.2" ry="0.9" fill="#8A56F7" />
                          <circle cx="-8.7" cy="-42.6" r="0.6" fill="#fff" />
                          <path d="M0.6 -40.6 Q3.1 -43.4 5.6 -40.6" fill="none" stroke="#1A0B2E" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M-8 -35.6 Q-3 -35 2 -35.6 Q1.4 -29.6 -3 -29.4 Q-7.4 -29.6 -8 -35.6 Z" fill="#1A0B2E" />
                          <path d="M-5.2 -32.2 Q-3 -33.6 -0.8 -32.2 Q-0.9 -29.4 -3 -29.4 Q-5.1 -29.4 -5.2 -32.2 Z" fill="#E05AD0" />
                          <g ref={mArmR}><rect x="14" y="-46" width="6" height="20" rx="3" fill="#1A0B2E" /><circle cx="17" cy="-25" r="5" fill="#fff" stroke="#E6DEF4" strokeWidth="1" /></g>
                        </g>
                      </g>
                      <g ref={runRef} style={{ opacity: 0 }}>
                        <ellipse cx="0" cy="1" rx="15" ry="3.5" fill={c.roadShade} opacity="0.22" />
                        <g ref={runBodyRef}>
                          <g ref={rLegL}><rect x="-8" y="-28" width="6" height="24" rx="3" fill="#E9B48A" /><rect x="-10" y="-7" width="11" height="6" rx="3" fill="#7B45F5" /><rect x="-10" y="-2.5" width="11" height="2" rx="1" fill="#fff" /></g>
                          <g ref={rLegR}><rect x="2" y="-28" width="6" height="24" rx="3" fill="#E9B48A" /><rect x="1" y="-7" width="11" height="6" rx="3" fill="#7B45F5" /><rect x="1" y="-2.5" width="11" height="2" rx="1" fill="#fff" /></g>
                          <rect x="-10" y="-35" width="20" height="12" rx="3" fill="#1A0B2E" />
                          <g ref={rArmR}><rect x="8" y="-51" width="6" height="19" rx="3" fill="#6A35E8" /><circle cx="11" cy="-31" r="3.4" fill="#E9B48A" /></g>
                          <rect x="-12" y="-55" width="24" height="24" rx="8" fill="#8A56F7" />
                          <rect x="-6" y="-42" width="12" height="6" rx="2.5" fill="#6A35E8" />
                          <path d="M-3 -54 v6 M3 -54 v6" stroke="#E4DAFC" strokeWidth="1" strokeLinecap="round" />
                          <g ref={rArmL}><rect x="-14" y="-51" width="6" height="19" rx="3" fill="#7B45F5" /><circle cx="-11" cy="-31" r="3.4" fill="#E9B48A" /></g>
                          <rect x="-2.5" y="-58" width="5" height="5" fill="#D9A07A" />
                          <circle cx="0" cy="-64" r="9" fill="#E9B48A" />
                          <path d="M-9.5 -65 Q-10.5 -76 0 -76 Q10.5 -76 9.5 -65 Q7 -71 1 -70 Q-5 -72 -9.5 -65 Z" fill="#1A0B2E" />
                          <circle cx="-3.2" cy="-63" r="1.2" fill="#25103F" /><circle cx="3.2" cy="-63" r="1.2" fill="#25103F" />
                          <path d="M-3 -59.5 Q0 -57.3 3 -59.5" fill="none" stroke="#25103F" strokeWidth="1.1" strokeLinecap="round" />
                        </g>
                      </g>
                      <g ref={sparkRef} style={{ opacity: 0 }} stroke="#7B45F5" strokeWidth="2.4" strokeLinecap="round"><path d="M0 -14 V-22 M-10 -9 L-16 -14 M10 -9 L16 -14 M-13 2 H-20 M13 2 H20" /></g>
                    </g>
                  ) : null}
                </svg>
              </div>
            </div>
          );
        })}
        {heroVideo ? (
          <div className="dhf-hero" ref={(el) => { layerRefs.current[5] = el; }}>
            <video ref={(el) => { heroVidRef.current = el; if (el) { el.muted = true; el.setAttribute("muted", ""); el.play().catch(() => {}); } }} src={heroVideo} muted autoPlay loop playsInline preload="auto" aria-hidden="true" />
          </div>
        ) : null}
        <svg className="dhf-grain" aria-hidden="true">
          <filter id={g("grain")}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" /></filter>
          <rect width="100%" height="100%" filter={"url(#" + g("grain") + ")"} />
        </svg>
      </div>
      <div className="dhf-wrap">
        <div className="dhf-card">
          <div className="dhf-top">
            <div className="dhf-brandcol">
              <a className="dhf-brand dhf-r" style={{ "--d": 0 }} href={brandHref}><img src={logoSrc} alt="" /><span>{name}</span></a>
              {tagline ? <p className="dhf-tag dhf-r" style={{ "--d": 0.6 }}>{tagline}</p> : null}
              {ctaLabel ? <a className="dhf-cta dhf-r" style={{ "--d": 0.9 }} href="#get-app" onClick={(e) => { if (onGetApp) { e.preventDefault(); onGetApp(e); } }} aria-label={ctaLabel}><span className="dhf-cta-bg" aria-hidden="true"></span><span className="dhf-roll" aria-hidden="true">{[...ctaLabel].map((ch, k) => <span key={k} className="dhf-ch" style={{ transitionDelay: (k * 0.01).toFixed(2) + "s" }}>{ch === " " ? "\u00a0" : ch}</span>)}</span></a> : null}
            </div>
            <div className="dhf-cols">
              {columns.map((col, ci) => (
                <nav className="dhf-col" key={col.title} aria-label={col.title}>
                  <h3 className="dhf-r" style={{ "--d": 1 + ci }}>{col.title}</h3>
                  <ul>{col.links.map((l, li) => <li key={l.label} className="dhf-r" style={{ "--d": 1.6 + ci + li * 0.45 }}><a className="dhf-link" href={l.href || "#"} aria-label={l.label}><span className="dhf-roll" aria-hidden="true">{[...l.label].map((ch, k) => <span key={k} className="dhf-ch" style={{ transitionDelay: (k * 0.01).toFixed(2) + "s" }}>{ch}</span>)}</span></a></li>)}</ul>
                </nav>
              ))}
            </div>
          </div>
          <div className="dhf-rule" />
          <div className="dhf-bar">
            <p className="dhf-r" style={{ "--d": 4.5 }}>{line}</p>
            <ul className="dhf-social">{socials.map((s, i) => <li key={s.icon + i} className="dhf-r" style={{ "--d": 4.6 + i * 0.4 }}><a href={s.href || "#"} aria-label={s.icon}><SocialIcon icon={s.icon} /></a></li>)}</ul>
          </div>
        </div>
      </div>
      <div className="dhf-spacer" />
      <button ref={hitRef} type="button" className="dhf-hit" aria-label="Honk the truck's horn" onClick={() => honkNow(true)} />
      <div ref={bubbleRef} className="dhf-bubble" aria-hidden="true">{honk}</div>
      <div ref={chipKeepRef} className="dhf-chip" aria-hidden="true"><span className="dhf-chip-ic"><svg viewBox="0 0 16 16" width="12" height="12"><path d="M8 13.5S2 9.8 2 5.8C2 4 3.4 2.6 5.1 2.6c1.2 0 2.2.6 2.9 1.6.7-1 1.7-1.6 2.9-1.6C12.6 2.6 14 4 14 5.8c0 4-6 7.7-6 7.7z" fill="#fff" /></svg></span>Keep going!</div>
      <div ref={chipStreakRef} className="dhf-chip dhf-chip-l" aria-hidden="true"><svg viewBox="0 0 16 16" width="16" height="16"><path d="M8.6 1.5c.4 2.2-1.3 3.3-2.3 4.6C5.3 7.4 4.5 8.6 4.5 10.2 4.5 12.6 6.1 14.5 8 14.5s3.5-1.6 3.5-4c0-1.6-.7-2.6-1.3-3.4-.1 1-.6 1.7-1.3 2 .5-2.3-.1-5.2-.3-7.6z" fill="#F25F3A" /><path d="M8 14.5c-1.2 0-2-1-2-2.2 0-1.3 1-2 1.6-2.9.2.9.9 1.4 1.4 1.6.6.3 1 .8 1 1.4 0 1.2-.9 2.1-2 2.1z" fill="#F8B733" /></svg><span>3 day<br />streak</span></div>
    </footer>
  );
}

window.DuneHaulFooter = DuneHaulFooter;
if (typeof module !== "undefined") module.exports = { DuneHaulFooter };
