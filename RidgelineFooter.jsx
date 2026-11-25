// Ridgeline Dither Footer: ported to plain JSX (types stripped) for BetOnYou.
const PRESETS = {
  betonyou: { paper: "#FAF8FE", ink: "#25103F", muted: "#6B5F82", line: "#E6DEF4", heart: "#E0457B", tones: ["#FAF8FE", "#EDE6FC", "#D6C7FA", "#B09AF7", "#7B45F5", "#4E25B0", "#25103F"] },
};
const SOCIAL_NAMES = { x: "X", instagram: "Instagram", linkedin: "LinkedIn", github: "GitHub", youtube: "YouTube" };
const SANS_STACK = "'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const MONO_STACK = "'JetBrains Mono', 'SF Mono', ui-monospace, Menlo, Consolas, monospace";

function rdfHex(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rdfPack(rgb) { return ((255 << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0]) >>> 0; }
const RDF_BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21].map((v) => (v + 0.5) / 64);
function rdfDither(tone, n, b) { const t = tone < 0 ? 0 : tone > 1 ? 1 : tone; const v = Math.floor(t * (n - 1) + b); return v > n - 1 ? n - 1 : v; }
function rdfHash(x, y, seed) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function rdfNoise(x, y, seed) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = rdfHash(xi, yi, seed), b = rdfHash(xi + 1, yi, seed), c = rdfHash(xi, yi + 1, seed), d = rdfHash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function rdfFbm(x, y, seed, octaves) {
  let sum = 0, amp = 0.5, norm = 0;
  for (let o = 0; o < octaves; o++) { sum += rdfNoise(x, y, seed + o * 31) * amp; norm += amp; x *= 2.03; y *= 2.03; amp *= 0.5; }
  return norm > 0 ? sum / norm : 0;
}
function rdfElevation(crest, rows, layer, layers) { const up = rows > 0 ? 1 - Math.min(1, Math.max(0, crest / rows)) : 0; return Math.round(420 + up * 2600 + (layers - 1 - layer) * 140); }
function rdfSmooth(e0, e1, x) { const t = e1 === e0 ? (x < e0 ? 0 : 1) : Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }
function rdfEase(t) { const c = t < 0 ? 0 : t > 1 ? 1 : t; return 1 - Math.pow(1 - c, 3); }
function rdfRidgeline(cols, rows, i, layers, seed, margin) {
  const k = layers > 1 ? i / (layers - 1) : 1, n = cols + margin * 2, out = new Float32Array(n);
  const base = rows * (0.38 + 0.66 * Math.pow(k, 1.4)), amp = rows * (0.2 + 0.24 * k), freq = 6 - 3.8 * k;
  const flankL = rows * 0.5 * k * k * k * (0.55 + 0.6 * rdfHash(i, 11, seed));
  const flankR = rows * 0.5 * k * k * k * (0.55 + 0.6 * rdfHash(i, 13, seed));
  const ceil = rows * 0.17, tilt = (rdfHash(i, 7, seed) - 0.5) * rows * 0.34 * (0.4 + k), s = (seed | 0) * 13 + i * 101;
  for (let x = 0; x < n; x++) {
    const u = (x - margin) / cols;
    const r1 = 1 - Math.abs(rdfNoise(u * freq + i * 3.7, 0.5, s) * 2 - 1);
    const r2 = 1 - Math.abs(rdfNoise(u * freq * 2.3, 3.5, s + 1) * 2 - 1);
    const f = rdfFbm(u * freq * 4.1, 9.5, s + 2, 3);
    const h = r1 * r1 * 0.62 + r2 * 0.24 + f * 0.14;
    const e = Math.min(1.2, Math.abs(u * 2 - 1));
    const y = base - h * amp + tilt * (u - 0.5) * 2 - (u < 0.5 ? flankL : flankR) * e * e * Math.sqrt(e);
    out[x] = y < ceil ? ceil - (ceil - y) * 0.25 : y;
  }
  return out;
}

const RDF_CSS = `
.rdf-root{position:relative;display:grid;width:100%;overflow:hidden;isolation:isolate;background:var(--rdf-paper);color:var(--rdf-ink);font-family:var(--rdf-sans);-webkit-font-smoothing:antialiased;--rdf-pad:clamp(20px,4vw,56px)}
.rdf-frame{position:relative;display:grid;grid-template-rows:auto auto minmax(var(--rdf-scene-min),1fr);width:100%;max-width:var(--rdf-max);margin:0 auto}
.rdf-frame::before,.rdf-frame::after{display:none;content:"";position:absolute;top:0;bottom:0;width:1px;z-index:3;pointer-events:none;background:var(--rdf-line);transform:scaleY(0);transform-origin:50% 0;transition:transform 1.4s cubic-bezier(.2,.7,.1,1)}
.rdf-frame::before{left:0}.rdf-frame::after{right:0;transition-delay:.08s}
.rdf-in .rdf-frame::before,.rdf-in .rdf-frame::after{transform:scaleY(1)}
.rdf-r{opacity:0;transform:translateY(12px);filter:blur(5px);transition:opacity .9s cubic-bezier(.2,.7,.1,1),transform 1s cubic-bezier(.2,.7,.1,1),filter .9s ease;transition-delay:calc(var(--d,0) * 1ms)}
.rdf-in .rdf-r{opacity:1;transform:none;filter:none}
.rdf-top{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1.9fr) repeat(var(--rdf-n),minmax(0,1fr));gap:28px;padding:clamp(44px,6.4vw,80px) var(--rdf-pad) clamp(30px,4vw,52px)}
.rdf-brand{display:flex;flex-direction:column;align-items:flex-start;gap:22px}
.rdf-logo{display:inline-flex;align-items:center;gap:10px;color:var(--rdf-ink);text-decoration:none;font-size:23px;font-weight:600;letter-spacing:-.035em;line-height:1}
.rdf-logo img{width:34px;height:34px;padding:5px 6px;box-sizing:border-box;border-radius:10px;background:#7B45F5;object-fit:contain;display:block}
.rdf-tag{margin:0;max-width:32ch;font-size:14px;line-height:1.55;color:var(--rdf-muted);text-wrap:pretty}
.rdf-social{display:flex;gap:6px;margin:2px 0 0 -7px;padding:0;list-style:none}
.rdf-social a{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;color:var(--rdf-muted);transition:color .3s ease,background-color .3s ease,transform .45s cubic-bezier(.2,.7,.1,1)}
.rdf-social a:hover{color:var(--rdf-accent);background:color-mix(in srgb,var(--rdf-accent) 10%,transparent);transform:translateY(-2px)}
.rdf-social svg{width:15px;height:15px;display:block}
.rdf-col h3{margin:4px 0 18px;font:500 11px/1 var(--rdf-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--rdf-muted)}
.rdf-col ul{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.rdf-link{position:relative;display:inline-flex;align-items:center;gap:8px;color:var(--rdf-ink);text-decoration:none;font-size:15px;line-height:1.35;letter-spacing:-.005em;transition:color .3s ease,transform .5s cubic-bezier(.2,.7,.1,1)}
.rdf-link::before{content:"";position:absolute;left:-12px;top:50%;width:7px;height:1px;background:var(--rdf-accent);transform:scaleX(0);transform-origin:0 50%;transition:transform .45s cubic-bezier(.2,.7,.1,1)}
.rdf-link:hover,.rdf-link:focus-visible{color:#7B45F5}
.rdf-roll{display:flex;overflow:hidden;line-height:1.3;white-space:pre}
.rdf-ch{display:inline-block;white-space:pre;text-shadow:0 1.3em currentColor;transition:transform .6s cubic-bezier(.65,.05,.36,1)}
.rdf-link:hover .rdf-ch,.rdf-link:focus-visible .rdf-ch{transform:translateY(-100%)}
@media (prefers-reduced-motion:reduce){.rdf-ch{transition:none}}
.rdf-badge{font:500 9px/1 var(--rdf-mono);letter-spacing:.1em;text-transform:uppercase;padding:4px 6px 3px;border-radius:99px;color:var(--rdf-accent);background:color-mix(in srgb,var(--rdf-accent) 11%,transparent)}
.rdf-link:focus-visible,.rdf-logo:focus-visible,.rdf-social a:focus-visible{outline:1px solid var(--rdf-accent);outline-offset:4px;border-radius:3px}
.rdf-bar{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:0 var(--rdf-pad);font-size:13px;color:var(--rdf-muted)}
.rdf-bar p{margin:0}
.rdf-scene{position:relative;z-index:1;margin-top:-64px;overflow:hidden}
.rdf-alt{position:absolute;left:0;top:0;z-index:2;pointer-events:none;opacity:0;transition:opacity .35s ease;font:500 11px/1 var(--rdf-mono);letter-spacing:.08em;color:var(--rdf-ink)}
.rdf-alt i{position:absolute;left:-5px;top:-5px;width:10px;height:10px;border-radius:50%;background:var(--rdf-paper);box-shadow:0 0 0 1.5px var(--rdf-ink)}
.rdf-alt b{position:absolute;left:-.5px;bottom:6px;width:1px;height:28px;background:var(--rdf-ink);opacity:.55}
.rdf-alt span{position:absolute;left:0;bottom:36px;transform:translateX(-50%);white-space:nowrap;padding:6px 9px 5px;border-radius:6px;background:color-mix(in srgb,var(--rdf-paper) 88%,transparent);box-shadow:0 0 0 1px var(--rdf-line);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
.rdf-scene canvas{position:absolute;left:0;bottom:0;display:block;max-width:none;image-rendering:pixelated;image-rendering:crisp-edges}
@media (max-width:760px){.rdf-top{grid-template-columns:minmax(0,1fr) minmax(0,1fr);row-gap:36px}.rdf-brand{grid-column:1 / -1}.rdf-bar{flex-direction:column;align-items:flex-start;gap:6px}.rdf-scene{margin-top:-40px}}
@media (prefers-reduced-motion:reduce){.rdf-r,.rdf-frame::before,.rdf-frame::after,.rdf-link,.rdf-link::before,.rdf-social a{transition:none}.rdf-r{filter:none}}
`;

function SocialIcon({ icon }) {
  if (icon === "instagram") return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" /></svg>);
  if (icon === "linkedin") return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="9" width="3.6" height="12" /><circle cx="4.8" cy="4.8" r="2.1" /><path d="M10 9h3.4v1.7c.6-1 1.9-2 3.9-2 3.3 0 4.3 2.1 4.3 5.3V21h-3.6v-6.2c0-1.5-.3-2.9-2.1-2.9s-2.3 1.3-2.3 2.8V21H10z" /></svg>);
  if (icon === "youtube") return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.9C18.2 4.9 12 4.9 12 4.9s-6.2 0-7.8.4a2.6 2.6 0 0 0-1.8 1.9C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.9c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.9c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15.1V8.9l5.2 3.1L10 15.1z" /></svg>);
  return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.75 3h3.070l-6.710 7.670L22 21h-6.180l-4.840-6.330L5.440 21H2.370l7.180-8.200L2 3h6.330l4.370 5.780L17.750 3zm-1.080 16.200h1.700L7.400 4.730H5.580L16.670 19.200z" /></svg>);
}

function RidgelineDitherFooter({
  name = "BetOnYou", brandHref = "index.html", logoSrc = "boy-logo-mrey8juw.svg",
  tagline = "Set personal challenges, prove your progress, and find people who believe in you.",
  columns = [], socials = [], copyright, preset = "betonyou", palette, seed = 11, ridges = 6, pixel = 2,
  mist = 0.8, drift = 1, radius = 130, interactive = true, maxWidth = "100%", fontFamily = SANS_STACK,
  monoFamily = MONO_STACK, height = "640px", sceneMinHeight = "260px",
}) {
  const altRef = React.useRef(null), altTextRef = React.useRef(null), rootRef = React.useRef(null), sceneRef = React.useRef(null), canvasRef = React.useRef(null), revealAt = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  const base = PRESETS[preset] || PRESETS.betonyou;
  const colors = { ...base, ...(palette || {}) };
  const tones = colors.tones && colors.tones.length >= 2 ? colors.tones : base.tones;
  const layers = Math.max(2, Math.min(9, Math.round(ridges)));
  const opts = React.useRef({ mist, drift, radius, interactive });
  opts.current = { mist, drift, radius, interactive };
  const key = [seed, layers, pixel, tones.join(",")].join("|");

  React.useEffect(() => {
    const root = rootRef.current; if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      if (revealAt.current === null) revealAt.current = reduced ? -Infinity : performance.now();
      setInView(true); io.disconnect();
    }, { threshold: 0.2 });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    const root = rootRef.current, scene = sceneRef.current, canvas = canvasRef.current;
    if (!root || !scene || !canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pal = new Uint32Array(tones.map((t) => rdfPack(rdfHex(t) || [128, 128, 128])));
    const nTones = pal.length;
    let p = 2, cols = 1, rows = 1, margin = 2, img = null, buf = new Uint32Array(0), tops = [], pools = [];
    let colTop = new Float32Array(0), colSlope = new Float32Array(0), colPool = new Float32Array(0), fog = new Float32Array(0);
    let fw = 1, fh = 1, ceil = 0, fadeTo = 1, raf = 0, visible = true, awake = true, lastDraw = 0, lastTick = performance.now();
    let altShown = false, altLabel = '', tx = 0, ty = 0, ex = 0, ey = 0, inside = false, clear = 0, pt = 0, pe = 0, windV = 0, windX = 0;

    const layout = () => {
      const rect = scene.getBoundingClientRect();
      p = Math.max(1, Math.round(pixel));
      cols = Math.max(8, Math.ceil(rect.width / p)); rows = Math.max(8, Math.ceil(rect.height / p));
      canvas.width = cols; canvas.height = rows; canvas.style.width = cols * p + "px"; canvas.style.height = rows * p + "px";
      img = ctx.createImageData(cols, rows); buf = new Uint32Array(img.data.buffer);
      margin = Math.ceil(cols * 0.045) + 3; ceil = Math.max(rows * 0.17, 92 / p); fadeTo = Math.max(rows * 0.3, 128 / p);
      tops = []; pools = [];
      for (let i = 0; i < layers; i++) {
        const t = rdfRidgeline(cols, rows, i, layers, seed, margin);
        for (let x = 0; x < t.length; x++) if (t[x] < ceil) t[x] = ceil - (ceil - t[x]) * 0.2;
        const pool = new Float32Array(t.length);
        for (let x = 0; x < t.length; x++) pool[x] = 0.45 + 1.1 * rdfFbm(((x - margin) / cols) * 4, i * 5.3, seed + 9, 2);
        tops.push(t); pools.push(pool);
      }
      colTop = new Float32Array(layers * cols); colSlope = new Float32Array(layers * cols); colPool = new Float32Array(layers * cols);
      fw = (cols >> 1) + 2; fh = (rows >> 1) + 2; fog = new Float32Array(fw * fh); awake = true;
    };

    const draw = (now) => {
      if (!img) return;
      const o = opts.current, dt = Math.min(64, now - lastTick); lastTick = now;
      const live = o.interactive && !reduced, age = revealAt.current === null ? -1 : now - revealAt.current;
      const ease = 1 - Math.pow(0.82, dt / 16.7), slow = 1 - Math.pow(0.93, dt / 16.7);
      ex += (tx - ex) * ease; ey += (ty - ey) * ease;
      clear += ((inside && o.interactive ? 1 : 0) - clear) * slow;
      pe += ((live ? pt : 0) - pe) * slow;
      windV *= Math.pow(0.965, dt / 16.7); windX += (windV * dt) / 1000;
      const fogT = (reduced ? 0 : (now / 1000) * 0.045 * Math.max(0, o.drift)) + windX;
      const sx = 9 / cols, sy = 4.4 / rows;
      for (let gy = 0; gy < fh; gy++) {
        const ny = gy * sy;
        for (let gx = 0; gx < fw; gx++) {
          const nx = gx * sx + fogT, warp = rdfNoise(nx * 0.45 - fogT * 0.6, ny * 0.8, 77) * 0.6;
          fog[gy * fw + gx] = rdfSmooth(0.3, 0.74, rdfFbm(nx + warp, ny + warp * 0.4, 31, 3));
        }
      }
      const rev = new Float32Array(layers), k = new Float32Array(layers), toneBase = new Float32Array(layers), fogDepth = new Float32Array(layers);
      for (let i = 0; i < layers; i++) {
        k[i] = i / (layers - 1);
        rev[i] = age < 0 ? 0 : rdfEase((age - 380 - i * 170) / 1300);
        toneBase[i] = 0.16 + 0.76 * Math.pow(k[i], 1.6);
        fogDepth[i] = rows * (0.08 + 0.42 * k[i]);
        const rise = (1 - rev[i]) * rows * 0.09, shift = Math.round(pe * (0.25 + k[i]) * 0.75 * (margin - 3));
        const t = tops[i], last = t.length - 1;
        for (let x = 0; x < cols; x++) {
          const at = x + margin + shift;
          colTop[i * cols + x] = t[at] + rise;
          colSlope[i * cols + x] = t[Math.min(last, at + 2)] - t[Math.max(0, at - 2)];
          colPool[i * cols + x] = fogDepth[i] * pools[i][at];
        }
      }
      const lift = age < 0 ? 1 : 1 - rdfEase((age - 900) / 1800);
      const mistK = Math.max(0, Math.min(1, o.mist)), r = Math.max(1, o.radius / p), r2 = r * r;
      for (let y = 0; y < rows; y++) {
        const fade = rdfSmooth(0, fadeTo, y), frow = (y >> 1) * fw, by = (y & 7) * 8, dyc = (y - ey) * 1.5;
        for (let x = 0; x < cols; x++) {
          let L = -1;
          for (let i = layers - 1; i >= 0; i--) { if (y >= colTop[i * cols + x]) { L = i; break; } }
          let tone = 0, mk = 0.3;
          if (L >= 0) {
            const kk = k[L], d = y - colTop[L * cols + x], depth = colPool[L * cols + x];
            tone = toneBase[L] * (1 - rdfSmooth(0, depth, d) * (0.88 - 0.45 * kk));
            const sl = colSlope[L * cols + x] * 0.06;
            tone += (sl < -0.2 ? -0.2 : sl > 0.2 ? 0.2 : sl) * (1 - rdfSmooth(0, depth * 0.5, d));
            tone += (rdfHash(x + Math.round(colTop[L * cols + x] * 7), d | 0, L) - 0.5) * 0.07 * kk;
            tone *= rev[L]; mk = 0.95 - 0.5 * kk;
          } else tone = 0.05 * rdfSmooth(rows * 0.15, rows * 0.6, y);
          let m = fog[frow + (x >> 1)] * mistK * mk;
          if (clear > 0.01) {
            const dx = x - ex, q = (dx * dx + dyc * dyc) / r2;
            if (q < 4) { const c = clear * Math.exp(-q); m *= 1 - c * 0.92; if (L >= 0) tone += c * 0.16 * rev[L]; }
          }
          if (tone > 0.93) tone = 0.93;
          m += lift * 0.55; if (m > 1) m = 1;
          tone = (tone * (1 - m) + 0.09 * m * (1 - lift)) * fade;
          buf[y * cols + x] = pal[rdfDither(tone, nTones, RDF_BAYER[by + (x & 7)])];
        }
      }
      ctx.putImageData(img, 0, 0);
      const alt = altRef.current, label = altTextRef.current; let show = false;
      if (alt && label && inside && age > 1600) {
        const x = Math.max(0, Math.min(cols - 1, Math.round(ex)));
        for (let i = layers - 1; i >= 0; i--) {
          const crest = colTop[i * cols + x];
          if (ey >= crest - 6) {
            show = true;
            alt.style.transform = 'translate(' + (x * p).toFixed(1) + 'px,' + (crest * p).toFixed(1) + 'px)';
            const text = rdfElevation(crest, rows, i, layers).toLocaleString('en-US') + ' m';
            if (text !== altLabel) { altLabel = text; label.textContent = text; }
            break;
          }
        }
      }
      if (alt && show !== altShown) { altShown = show; alt.style.opacity = show ? '1' : '0'; }
      const settling = Math.abs(tx - ex) + Math.abs(ty - ey) > 0.05 || Math.abs((inside && o.interactive ? 1 : 0) - clear) > 0.005 || Math.abs((live ? pt : 0) - pe) > 0.001 || Math.abs(windV) > 0.002;
      awake = (age >= 0 && age < 3400) || age < 0 || settling || (!reduced && o.drift > 0);
    };
    const busy = () => { const age = revealAt.current === null ? -1 : performance.now() - revealAt.current; return (age >= 0 && age < 3400) || inside || Math.abs(windV) > 0.002 || Math.abs(pt - pe) > 0.001; };
    const loop = (now) => {
      raf = 0; if (!visible) return;
      if (revealAt.current === null) { raf = requestAnimationFrame(loop); return; }
      if (busy() || now - lastDraw > 32) { draw(now); lastDraw = now; }
      if (awake) raf = requestAnimationFrame(loop);
    };
    const wake = () => { awake = true; if (!raf && visible) raf = requestAnimationFrame(loop); };
    const onMove = (e) => {
      const b = root.getBoundingClientRect(); pt = b.width > 0 ? ((e.clientX - b.left) / b.width) * 2 - 1 : 0;
      const s = scene.getBoundingClientRect(), lx = (e.clientX - s.left) / p, ly = (e.clientY - s.top) / p, was = inside;
      inside = lx >= 0 && ly >= 0 && lx < cols && ly < rows; tx = lx; ty = ly;
      if (inside && !was) { ex = tx; ey = ty; }
      wake();
    };
    const onLeave = () => { pt = 0; inside = false; wake(); };
    const onDown = (e) => {
      if (!opts.current.interactive || reduced || !inside) return;
      if (e.target.closest("a,button")) return;
      windV += tx < cols / 2 ? 1.4 : -1.4; wake();
    };
    layout(); draw(performance.now()); wake();
    root.addEventListener("pointermove", onMove); root.addEventListener("pointerleave", onLeave); root.addEventListener("pointerdown", onDown);
    const ro = new ResizeObserver(() => { layout(); draw(performance.now()); wake(); }); ro.observe(scene);
    const io = new IntersectionObserver((entries) => { visible = entries[0] ? entries[0].isIntersecting : true; if (visible) { lastTick = performance.now(); wake(); } });
    io.observe(root);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); root.removeEventListener("pointermove", onMove); root.removeEventListener("pointerleave", onLeave); root.removeEventListener("pointerdown", onDown); };
  }, [key]);

  const line = copyright || "© " + new Date().getFullYear() + " " + name + " Inc. All rights reserved.";
  return (
    <footer ref={rootRef} data-screen-label="Footer" className={"rdf-root" + (inView ? " rdf-in" : "")} style={{ minHeight: height, "--rdf-scene-min": sceneMinHeight, "--rdf-paper": colors.paper, "--rdf-ink": colors.ink, "--rdf-muted": colors.muted, "--rdf-line": colors.line, "--rdf-accent": tones[Math.max(1, tones.length - 3)], "--rdf-n": columns.length, "--rdf-max": maxWidth, "--rdf-sans": fontFamily, "--rdf-mono": monoFamily }}>
      <style>{RDF_CSS}</style>
      <div className="rdf-frame">
        <div className="rdf-top">
          <div className="rdf-brand">
            <a className="rdf-logo rdf-r" style={{ "--d": 140 }} href={brandHref}><img src={logoSrc} alt="" /><span>{name}</span></a>
            {tagline ? <p className="rdf-tag rdf-r" style={{ "--d": 230 }}>{tagline}</p> : null}
            {socials.length ? (
              <ul className="rdf-social">
                {socials.map((s, i) => (
                  <li key={s.icon + i} className="rdf-r" style={{ "--d": 320 + i * 60 }}><a href={s.href || "#"} aria-label={s.label || SOCIAL_NAMES[s.icon]}><SocialIcon icon={s.icon} /></a></li>
                ))}
              </ul>
            ) : null}
          </div>
          {columns.map((col, ci) => (
            <nav className="rdf-col" key={col.title} aria-label={col.title}>
              <h3 className="rdf-r" style={{ "--d": 260 + ci * 110 }}>{col.title}</h3>
              <ul>
                {col.links.map((l, li) => (
                  <li key={l.label} className="rdf-r" style={{ "--d": 330 + ci * 110 + li * 55 }}><a className="rdf-link" href={l.href || "#"} aria-label={l.label}><span className="rdf-roll" aria-hidden="true">{[...l.label].map((ch, k) => <span key={k} className="rdf-ch" style={{ transitionDelay: (k * 0.01).toFixed(2) + "s" }}>{ch}</span>)}</span>{l.badge ? <span className="rdf-badge">{l.badge}</span> : null}</a></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="rdf-bar rdf-r" style={{ "--d": 1250 }}><p>{line}</p></div>
        <div ref={sceneRef} className="rdf-scene"><canvas ref={canvasRef} aria-hidden="true" /><div ref={altRef} className="rdf-alt" aria-hidden="true"><b /><i /><span ref={altTextRef} /></div></div>
      </div>
    </footer>
  );
}

function BetOnYouFooter(props) {
  return (
    <RidgelineDitherFooter
      columns={[
        { title: "Product", links: [{ label: "AI Coach", href: "ai-coach.html" }, { label: "How it works", href: "how-it-works.html" }, { label: "Learn", href: "learn.html" }] },
        { title: "Company", links: [{ label: "About", href: "about.html" }, { label: "Contact", href: "contact.html" }] },
        { title: "Legal", links: [{ label: "Privacy Policy", href: "privacy-policy.html" }, { label: "Terms of Service", href: "terms-of-service.html" }, { label: "Cookie Policy", href: "cookie-policy.html" }] },
      ]}
      socials={[{ icon: "instagram", href: "#" }, { icon: "linkedin", href: "#" }, { icon: "x", href: "#" }]}
      {...props}
    />
  );
}

window.RidgelineDitherFooter = RidgelineDitherFooter;
window.BetOnYouFooter = BetOnYouFooter;
if (typeof module !== "undefined") module.exports = { RidgelineDitherFooter, BetOnYouFooter };
