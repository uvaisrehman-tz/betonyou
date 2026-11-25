// Works Wheel: plain-JSX port (no Tailwind/TS) with video cards, BetOnYou palette.
const WW = { CARD_H: 0.38, CARD_MAX_W: 0.34, CARD_RATIO: 1.45, STEP: 40, DRUM: 2.22, LENS: 2.7, RING_R: 1.14, BOW: 1.82, TITLE: 0.124, INDEX: 0.045, CULL: 1.6, WHEEL_UNITS: 900, DRAG_UNITS: 420, SETTLE: 140, EASE: 0.12 };
const wwClamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const wwRad = (d) => (d * Math.PI) / 180;
function wwPlace(ringDeg, drumDeg, ringR, drumR, bow, m) {
  return "translateX(" + m * (-bow * (1 - Math.cos(wwRad(drumDeg)))) + "px) rotateZ(" + (1 - m) * ringDeg + "deg) translateY(" + -(1 - m) * ringR + "px) rotateX(" + m * drumDeg + "deg) translateZ(" + m * drumR + "px)";
}

function WorksWheel({ items = [], label = "Every check-in tells a story", eyebrow = "", scrollDriven = false }) {
  const stageRef = React.useRef(null), wheelRef = React.useRef(null), cardRefs = React.useRef([]), labelRef = React.useRef(null), titleRef = React.useRef(null);
  const turn = React.useRef(0), target = React.useRef(0), drag = React.useRef(null), settling = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState({ w: 0, h: 0 });
  const [reduced] = React.useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const compact = stage.w > 0 && stage.w < 720, count = items.length, last = Math.max(count - 1, 0);

  React.useEffect(() => {
    const el = stageRef.current; if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect();
  }, []);

  const mt = React.useMemo(() => {
    const { w, h } = stage, cardW = Math.min(h * WW.CARD_H * WW.CARD_RATIO, w * (w < 720 ? 0.64 : WW.CARD_MAX_W)), cardH = cardW / WW.CARD_RATIO, ringR = cardH * WW.RING_R;
    let ringScale = count ? wwClamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1) : 1;
    const ringFit = Math.min(1, (h * 0.4) / (ringR + (cardW * ringScale) / 2 || 1));
    const holeW = 2 * (ringR * ringFit - (cardW * ringScale * ringFit) / 2) * 0.85;
    return { compact: w < 720, cardW, cardH, ringR: ringR * ringFit, ringScale: ringScale * ringFit, holeW, drumR: cardH * WW.DRUM, bow: cardH * WW.BOW, depth: cardH * WW.LENS, title: cardH * WW.TITLE, index: Math.max(13, cardH * WW.INDEX) };
  }, [stage, count]);

  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0, vis = true;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !frame) frame = requestAnimationFrame(draw); }, { rootMargin: "100px" });
    io.observe(stageRef.current);
    const draw = () => {
      frame = vis ? requestAnimationFrame(draw) : 0;
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current; else turn.current += gap * (reduced ? 1 : WW.EASE);
      const t = turn.current, m = wwClamp(t, 0, 1), pos = Math.max(0, t - 1);
      if (wheelRef.current) wheelRef.current.style.transform = "translateZ(" + -m * mt.drumR + "px)";
      for (let i = 0; i < count; i++) {
        const d = i - pos, card = cardRefs.current[i]; if (!card) continue;
        card.style.transform = wwPlace(d * (360 / count), d * (mt.compact ? 30 : WW.STEP), mt.ringR, mt.drumR, mt.bow, m);
        const hide = m > 0.5 && Math.abs(d) > WW.CULL;
        card.style.opacity = hide ? "0" : "1";
        card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        const face = card.firstElementChild; if (face) face.style.transform = "scale(" + (mt.ringScale + (1 - mt.ringScale) * m) + ")";
        const v = card.querySelector("video");
        if (v) { const want = !hide && (m < 0.5 || Math.abs(d) < 1.2); if (want && v.paused) { v.play().catch(() => {}); } else if (!want && !v.paused) v.pause(); }
      }
      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);
      const cta = stageRef.current && stageRef.current.closest("[data-ww-track]") && stageRef.current.closest("[data-ww-track]").querySelector("[data-ww-cta]");
      if (cta) { const o = wwClamp((m - 0.6) / 0.4, 0, 1); cta.style.opacity = String(o); cta.style.pointerEvents = o > 0.5 ? "auto" : "none"; }
      const near = wwClamp(Math.round(pos), 0, last);
      setActive((p) => (p === near ? p : near));
    };
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); io.disconnect(); };
  }, [mt, stage.h, count, last, reduced]);

  const to = React.useCallback((n) => { target.current = wwClamp(n, 0, last + 1); }, [last]);

  React.useEffect(() => {
    const el = stageRef.current; if (!el) return;
    if (scrollDriven) {
      const track = el.closest("[data-ww-track]");
      const onScroll = () => { if (!track) return; const rc = track.getBoundingClientRect(), span = Math.max(1, rc.height - window.innerHeight); const p = wwClamp(-rc.top / span, 0, 1); target.current = p * (last + 1); };
      onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll);
      return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
    }
    const onWheel = (e) => {
      const next = target.current + e.deltaY / WW.WHEEL_UNITS;
      if (next > 0 && next < last + 1) e.preventDefault();
      to(next);
      clearTimeout(settling.current);
      settling.current = setTimeout(() => to(Math.round(target.current)), WW.SETTLE);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); clearTimeout(settling.current); };
  }, [to, last, scrollDriven]);

  return (
    <section aria-label={label} style={{ position: "relative", width: "100%", height: "100%", minHeight: "24rem", overflow: "hidden", userSelect: "none", color: "#25103F", fontFamily: "'Bricolage Grotesque', sans-serif" }}>
      <div ref={stageRef} tabIndex={0} role="listbox" aria-label={label} aria-activedescendant={"ww-" + active}
        style={{ position: "absolute", inset: 0, cursor: scrollDriven ? "default" : "grab", touchAction: scrollDriven ? "auto" : "pan-x", outline: "none", perspective: mt.depth + "px" }}
        onPointerDown={(e) => { if (scrollDriven) return; drag.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => { if (drag.current === null) return; to(target.current + (drag.current - e.clientY) / WW.DRAG_UNITS); drag.current = e.clientY; }}
        onPointerUp={() => { drag.current = null; if (target.current > 1) to(Math.round(target.current)); }}
        onKeyDown={(e) => { if (e.key === "ArrowDown") to(Math.round(target.current) + 1); else if (e.key === "ArrowUp") to(Math.round(target.current) - 1); else return; e.preventDefault(); }}>
        <div ref={wheelRef} style={{ position: "absolute", top: "50%", left: "50%", transformStyle: "preserve-3d" }}>
          {items.map((it, i) => (
            <div key={i} id={"ww-" + i} role="option" aria-selected={i === active} ref={(n) => { cardRefs.current[i] = n; }}
              style={{ position: "absolute", backfaceVisibility: "hidden", width: mt.cardW, height: mt.cardH, marginLeft: -mt.cardW / 2, marginTop: -mt.cardH / 2 }}>
              <span style={{ position: "relative", display: "block", width: "100%", height: "100%", overflow: "hidden", borderRadius: 14, background: "#0B0614", boxShadow: "0 18px 40px -18px rgba(37,16,63,.35)" }}>
                <video src={it.video} poster={it.poster} muted loop playsInline preload="none" aria-label={it.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
                <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0) 55%,rgba(18,8,32,.55))" }}></span>
                <span style={{ position: "absolute", left: 14, bottom: 12, fontSize: Math.max(11, mt.cardH * 0.075), fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", color: "#fff" }}>{it.title}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div ref={labelRef} style={{ pointerEvents: "none", position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, textAlign: "center", padding: 0 }}>{eyebrow ? <span style={{ display: "inline-flex", fontSize: 13, fontWeight: 600, letterSpacing: ".16em", color: "#7B45F5", textTransform: "uppercase" }}>{eyebrow}</span> : null}<span style={{ maxWidth: Math.max(160, mt.holeW), fontSize: Math.max(18, Math.min(44, mt.holeW / 9)), fontWeight: 500, letterSpacing: "-.04em", lineHeight: 1.08, color: "#25103F", textWrap: "balance" }}>{label}</span></div>
      <div ref={titleRef} style={compact ? { pointerEvents: "none", position: "absolute", top: 20, left: 20, right: 20, zIndex: 130, opacity: 0, display: "flex", flexDirection: "column", gap: 6 } : { pointerEvents: "none", position: "absolute", top: "50%", left: "5%", maxWidth: "22%", transform: "translateY(-50%)", opacity: 0, display: "flex", flexDirection: "column", gap: 12 }}>{eyebrow ? <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "#7B45F5" }}>{eyebrow}</span> : null}<span style={{ fontSize: Math.min(44, Math.max(22, mt.title * 0.55)), fontWeight: 500, letterSpacing: "-.04em", lineHeight: 1.05, color: "#7B45F5" }}>{items[active] && items[active].title}</span><span style={{ fontSize: 14, color: "#6B5F82" }}>{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span></div>
      <ol style={{ display: compact ? "none" : "block", position: "absolute", top: "50%", transform: "translateY(-50%)", right: "4%", margin: 0, padding: 0, listStyle: "none", textAlign: "right", lineHeight: 1.75, fontSize: mt.index, color: "#6B5F82" }}>
        {items.map((it, i) => (
          <li key={i}><button type="button" onClick={() => to(i + 1)} style={{ background: "none", border: 0, padding: 0, font: "inherit", cursor: "pointer", color: i === active ? "#25103F" : "inherit", fontWeight: i === active ? 600 : 400, transition: "color .3s" }}>{it.title}</button></li>
        ))}
      </ol>
    </section>
  );
}
window.WorksWheel = WorksWheel;
if (typeof module !== "undefined") module.exports = { WorksWheel };
