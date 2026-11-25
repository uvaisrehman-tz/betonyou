const BD_DEFAULT = [
  ["Learning", "v"], ["Side project", "m"], ["Reading", "o"], ["Fitness", "o"], ["Mindset", "b"], ["Money", "g"],
  ["Music", "p"], ["Study", "o"], ["Habits", "k"], ["Career", "o"], ["Creativity", "r"], ["Languages", "o"],
  ["Coding", "y"], ["Writing", "o"], ["Cooking", "o"], ["Art", "b"], ["Sleep", "o"], ["Meditation", "l"],
  ["Health", "g"], ["Family", "o"], ["Community", "o"], ["Travel", "o"]
];
const BD_TONES = {
  o: { bg: "rgba(255,255,255,.7)", fg: "#25103F", bd: "#25103F" },
  v: { bg: "#7B45F5", fg: "#fff", bd: "#7B45F5" },
  b: { bg: "#4B3BFF", fg: "#fff", bd: "#4B3BFF" },
  m: { bg: "#C25BF6", fg: "#fff", bd: "#C25BF6" },
  l: { bg: "#D6A8FA", fg: "#25103F", bd: "#D6A8FA" },
  p: { bg: "#E0457B", fg: "#fff", bd: "#E0457B" },
  r: { bg: "#F25F3A", fg: "#fff", bd: "#F25F3A" },
  g: { bg: "#5ED39A", fg: "#0E3328", bd: "#5ED39A" },
  y: { bg: "#E4F75A", fg: "#25103F", bd: "#E4F75A" },
  k: { bg: "#25103F", fg: "#fff", bd: "#25103F" }
};
let bdMatterP = null;
function bdLoadMatter() {
  if (window.Matter) return Promise.resolve(window.Matter);
  if (!bdMatterP) bdMatterP = new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"; s.onload = () => res(window.Matter); s.onerror = rej; document.head.appendChild(s); });
  return bdMatterP;
}

function BadgeDrop({ badges = BD_DEFAULT, height = 340, dragHint = true, autoplay = 6000 }) {
  const wrapRef = React.useRef(null);
  const elsRef = React.useRef([]);
  const [hint, setHint] = React.useState(dragHint);
  const [reduced] = React.useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  React.useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current; if (!wrap) return;
    let raf = 0, engine = null, bodies = [], drag = null, started = false, alive = true, idleT = 0, lastInteract = Date.now();
    const start = (M) => {
      if (started || !alive) return; started = true;
      const W = wrap.clientWidth, H = wrap.clientHeight;
      engine = M.Engine.create({ gravity: { y: 1.1 } });
      const t = 200, o = { isStatic: true, restitution: 0.2, friction: 0.6 };
      M.Composite.add(engine.world, [
        M.Bodies.rectangle(W / 2, H + t / 2, W * 3, t, o),
        M.Bodies.rectangle(-t / 2, H / 2 - H, t, H * 4, o),
        M.Bodies.rectangle(W + t / 2, H / 2 - H, t, H * 4, o)
      ]);
      bodies = elsRef.current.map((el, i) => {
        if (!el) return null;
        const w = el.offsetWidth, h = el.offsetHeight;
        const b = M.Bodies.rectangle(w / 2 + Math.random() * Math.max(1, W - w), -h - Math.random() * H * 1.2 - i * 22, w, h, { chamfer: { radius: h / 2 - 0.5 }, restitution: 0.35, friction: 0.35, frictionAir: 0.012, density: 0.0018, angle: (Math.random() - 0.5) * 0.9 });
        b._el = el; b._w = w; b._h = h; el.style.visibility = "visible";
        return b;
      }).filter(Boolean);
      M.Composite.add(engine.world, bodies);
      let last = performance.now();
      const tick = (now) => {
        if (!alive) return;
        const dt = Math.min(32, now - last); last = now;
        M.Engine.update(engine, dt);
        for (const b of bodies) b._el.style.transform = "translate(" + (b.position.x - b._w / 2).toFixed(1) + "px," + (b.position.y - b._h / 2).toFixed(1) + "px) rotate(" + b.angle.toFixed(4) + "rad)";
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      if (autoplay > 0) idleT = setInterval(() => {
        if (document.hidden || drag || Date.now() - lastInteract < autoplay) return;
        const picks = bodies.slice().sort(() => Math.random() - 0.5).slice(0, 3);
        picks.forEach((b) => M.Body.setVelocity(b, { x: (Math.random() - 0.5) * 6, y: -9 - Math.random() * 5 }));
      }, autoplay);
      const local = (e) => { const r = wrap.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
      const down = (e) => {
        const b = bodies.find((x) => x._el === e.currentTarget); if (!b) return;
        e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId);
        const p = local(e);
        drag = M.Constraint.create({ pointA: p, bodyB: b, pointB: { x: p.x - b.position.x, y: p.y - b.position.y }, stiffness: 0.2, damping: 0.1, length: 0 });
        M.Composite.add(engine.world, drag); lastInteract = Date.now(); setHint(false);
        b._el.style.cursor = "grabbing";
      };
      const move = (e) => { if (!drag) return; const p = local(e); drag.pointA.x = p.x; drag.pointA.y = p.y; lastInteract = Date.now(); };
      const up = (e) => { if (!drag) return; drag.bodyB._el.style.cursor = "grab"; M.Composite.remove(engine.world, drag); drag = null; lastInteract = Date.now(); };
      bodies.forEach((b) => { b._el.addEventListener("pointerdown", down); b._el.addEventListener("pointermove", move); b._el.addEventListener("pointerup", up); b._el.addEventListener("pointercancel", up); });
    };
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); bdLoadMatter().then(start).catch(() => {}); } }, { threshold: 0.25 });
    io.observe(wrap);
    return () => { alive = false; io.disconnect(); cancelAnimationFrame(raf); clearInterval(idleT); if (engine && window.Matter) window.Matter.Engine.clear(engine); };
  }, [badges, reduced, autoplay]);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height: reduced ? "auto" : height, overflow: "hidden", display: reduced ? "flex" : "block", flexWrap: "wrap", justifyContent: "center", gap: 10, userSelect: "none" }}>
      {badges.map(([label, tone], i) => {
        const t = BD_TONES[tone] || BD_TONES.w;
        return (
          <span key={label} ref={(el) => (elsRef.current[i] = el)} style={{ position: reduced ? "relative" : "absolute", left: 0, top: 0, visibility: reduced ? "visible" : "hidden", display: "inline-flex", alignItems: "center", padding: "clamp(10px,1.1vw,14px) clamp(18px,2vw,28px)", borderRadius: 100, border: "1.5px solid " + t.bd, background: t.bg, color: t.fg, fontSize: "clamp(15px,1.6vw,22px)", fontWeight: 500, letterSpacing: ".02em", textTransform: "uppercase", whiteSpace: "nowrap", cursor: reduced ? "default" : "grab", touchAction: "none", willChange: "transform", boxShadow: "0 8px 18px -12px rgba(37,16,63,.35)" }}>
            {label}
          </span>
        );
      })}
      {!reduced && dragHint ? (
        <span aria-hidden="true" style={{ position: "absolute", left: "50%", top: 16, transform: "translateX(-50%)", display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 100, background: "rgba(255,255,255,.75)", border: "1px solid #E6DEF4", WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)", fontSize: 16, color: "#3A2B55", whiteSpace: "nowrap", zIndex: 2, opacity: hint ? 1 : 0, transition: "opacity .5s ease", pointerEvents: "none" }}>
          <svg width="20" height="20" viewBox="0 0 16 16"><path d="M6 8V3.5a1.2 1.2 0 0 1 2.4 0V7m0-1a1.2 1.2 0 0 1 2.4 0V8m0-.5a1.2 1.2 0 0 1 2.4 0v2.800A4.700 4.700 0 0 1 8.500 15h-.3a4.700 4.700 0 0 1-3.700-1.800L2.600 10.700a1.200 1.200 0 0 1 1.900-1.500L6 10.700" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          Grab a goal and throw it
        </span>
      ) : null}
    </div>
  );
}
window.BadgeDrop = BadgeDrop;
module.exports = { BadgeDrop };
