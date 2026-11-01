"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, type PanInfo } from "framer-motion";

const TABS = [
  {
    id: "software",
    num: "01",
    label: "Software",
    heading: "The product layer",
    body: [
      "Custom applications, portals, and APIs form the operational core — where data is created, work is done, and customers interact. This layer owns the system's source of truth.",
      "Everything above it — intelligence, operations — reads from and writes back to this foundation, which is why we design it first.",
    ],
    chips: ["apps", "apis", "data"],
  },
  {
    id: "intelligence",
    num: "02",
    label: "Intelligence",
    heading: "The applied AI layer",
    body: [
      "Agents and retrieval systems sit on top of the product layer: they answer from your knowledge, classify and route work, and act through narrowly scoped tools.",
      "Nothing here is free-floating. Every agent's access is defined, evaluated, and monitored against the same systems your team uses.",
    ],
    chips: ["agents", "retrieval", "tools"],
  },
  {
    id: "operations",
    num: "03",
    label: "Operations",
    heading: "The customer operations layer",
    body: [
      "Support, voice, and outreach are where the system meets people. Conversations flow in from every channel, get handled by the right mix of AI and humans, and write their outcomes back to the record.",
      "The loop is what matters: operations continuously feeds the intelligence layer better data and the product layer better information about what to fix.",
    ],
    chips: ["support", "voice", "outreach"],
  },
] as const;

const CX = 178, HW = 118, HH = 40, SIDE = 10;
const PLATES = [
  { id: "operations", cy: 84 },
  { id: "intelligence", cy: 194 },
  { id: "software", cy: 304 },
];
const LABELS = [
  { id: "operations", code: "L03", name: "OPERATIONS", sub: "support · voice · outreach" },
  { id: "intelligence", code: "L02", name: "INTELLIGENCE", sub: "agents · retrieval · tools" },
  { id: "software", code: "L01", name: "SOFTWARE", sub: "apps · apis · data" },
];
const BEAMS = [CX - 42, CX, CX + 42];

function rhombus(cx: number, cy: number, hw: number, hh: number) {
  return `M ${cx} ${cy - hh} L ${cx + hw} ${cy} L ${cx} ${cy + hh} L ${cx - hw} ${cy} Z`;
}

function Diagram({ active, onSelect, reduced }: { active: string; onSelect: (id: string) => void; reduced: boolean }) {
  const topCy = PLATES[0].cy, botCy = PLATES[2].cy;
  return (
    <div className="sys-diagram" aria-hidden="true">
      <span className="sys-caption">SYS / LAYER MODEL</span>
      <span className="sys-tick tl" /><span className="sys-tick tr" />
      <span className="sys-tick bl" /><span className="sys-tick br" />
      <svg className="sys-svg" viewBox="0 0 560 380">
        <defs>
          <filter id="sys-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* data-flow beams */}
        {BEAMS.map((x, i) => (
          <g key={x}>
            <line x1={x} y1={topCy - HH} x2={x} y2={botCy + HH + SIDE} className="sys-beam" />
            <circle cx={x} cy={topCy - HH} r="2.4" className="sys-part" style={{ animationDelay: `${i * 1.1}s`, animationDuration: `${3.4 + i * 0.5}s` }} />
          </g>
        ))}
        {/* per-plate beam glow dots */}
        {PLATES.map((p) => (
          <g key={`g-${p.id}`} className={p.id === active ? "sys-xing on" : "sys-xing"}>
            {BEAMS.map((x) => <circle key={x} cx={x} cy={p.cy} r="3" />)}
          </g>
        ))}
        {/* feedback loop */}
        <path
          className="sys-loop"
          d={`M ${CX - HW} ${topCy} C ${CX - HW - 42} ${topCy}, ${CX - HW - 42} ${botCy}, ${CX - HW - 5} ${botCy}`}
        />
        <path className="sys-loop-head" d={`M ${CX - HW - 1} ${botCy} l -11 -4 l 2.5 4.5 l -2.5 4.5 z`} />
        <text
          className="sys-loop-label"
          x={12} y={(topCy + botCy) / 2}
          transform={`rotate(-90 12 ${(topCy + botCy) / 2})`}
        >FEEDBACK</text>
        {/* leader lines to labels */}
        {PLATES.map((p) => (
          <line
            key={`l-${p.id}`}
            x1={CX + HW + 6} y1={p.cy} x2={400} y2={p.cy}
            className={p.id === active ? "sys-leader on" : "sys-leader"}
          />
        ))}
        {/* plates (top rendered first so bottom overlaps correctly) */}
        {PLATES.map((p) => {
          const on = p.id === active;
          return (
            <motion.g
              key={p.id}
              className={`sys-plate${on ? " on" : ""}`}
              onClick={() => onSelect(p.id)}
              animate={{ y: on && !reduced ? -9 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <path
                className="sys-plate-side"
                d={`M ${CX - HW} ${p.cy} L ${CX} ${p.cy + HH} L ${CX + HW} ${p.cy} L ${CX + HW} ${p.cy + SIDE} L ${CX} ${p.cy + HH + SIDE} L ${CX - HW} ${p.cy + SIDE} Z`}
              />
              <path className="sys-plate-top" d={rhombus(CX, p.cy, HW, HH)} />
              <path className="sys-plate-inner" d={rhombus(CX, p.cy, HW * 0.62, HH * 0.62)} />
              <circle cx={CX - HW * 0.45} cy={p.cy + HH * 0.1} r="2.6" className="sys-dot" />
              <circle cx={CX + HW * 0.3} cy={p.cy - HH * 0.18} r="2.6" className="sys-dot" />
              <circle cx={CX + HW * 0.05} cy={p.cy + HH * 0.34} r="2" className="sys-dot" />
            </motion.g>
          );
        })}
      </svg>
      <div className="sys-labels">
        {LABELS.map((l, i) => (
          <div
            key={l.id}
            className={`sys-label${l.id === active ? " on" : ""}`}
            style={{ top: `${(PLATES[i].cy / 380) * 100}%` }}
          >
            <span className="sys-label-code">{l.code}</span>
            <span className="sys-label-name">{l.name}</span>
            <span className="sys-label-sub">{l.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SystemPanel() {
  const [tab, setTabState] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [paused, setPaused] = useState(false);
  const [barKey, setBarKey] = useState(0);
  const prevPaused = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [vpH, setVpH] = useState<number | undefined>(undefined);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const vpRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const wRef = useRef(0);
  const tabRef = useRef(0);
  const dragHoriz = useRef(false);
  const swallowClick = useRef(false);
  const pauseReasons = useRef(new Set<string>());
  const x = useMotionValue(0);
  const reduced = useReducedMotion();
  const reducedEff = !!(reduced && hydrated);

  tabRef.current = tab;

  const setReason = (k: string, on: boolean) => {
    if (on) pauseReasons.current.add(k); else pauseReasons.current.delete(k);
    setPaused(pauseReasons.current.size > 0);
  };

  const select = (i: number, user: boolean) => {
    if (user) setAutoplay(false);
    setTabState(i);
  };

  useEffect(() => setHydrated(true), []);

  // viewport width measurement + keep track parked on resize
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const measure = () => {
      wRef.current = el.clientWidth;
      x.set(-tabRef.current * wRef.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [x]);

  // slide to the active panel on any tab change
  useEffect(() => {
    const w = wRef.current;
    if (!w) return;
    if (reducedEff) x.set(-tab * w);
    else animate(x, -tab * w, { type: "spring", stiffness: 300, damping: 34 });
  }, [tab, reducedEff, x]);

  // animate viewport height to the active panel
  useEffect(() => {
    const el = panelRefs.current[tab];
    if (!el) return;
    const update = () => setVpH(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tab]);

  // restart the progress bar from 0 on each resume (tab change re-keys via ${tab})
  useEffect(() => {
    if (prevPaused.current && !paused) setBarKey((k) => k + 1);
    prevPaused.current = paused;
  }, [paused]);

  // autoplay timer (fresh 5s per tab)
  useEffect(() => {
    if (!autoplay || paused || reducedEff) return;
    const id = setTimeout(() => setTabState((t) => (t + 1) % TABS.length), 5000);
    return () => clearTimeout(id);
  }, [autoplay, paused, reducedEff, tab]);

  // pause: panel mostly out of view / tab hidden / hover / focus inside
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => setReason("view", e.intersectionRatio < 0.35),
      { threshold: [0, 0.35, 1] }
    );
    io.observe(root);
    const onVis = () => setReason("hidden", document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const onPE = (e: PointerEvent) => { if (e.pointerType === "mouse") setReason("hover", true); };
    const onPL = (e: PointerEvent) => { if (e.pointerType === "mouse") setReason("hover", false); };
    root.addEventListener("pointerenter", onPE);
    root.addEventListener("pointerleave", onPL);
    const onFI = () => setReason("focus", true);
    const onFO = (e: FocusEvent) => {
      if (!root.contains(e.relatedTarget as Node)) setReason("focus", false);
    };
    root.addEventListener("focusin", onFI);
    root.addEventListener("focusout", onFO);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      root.removeEventListener("pointerenter", onPE);
      root.removeEventListener("pointerleave", onPL);
      root.removeEventListener("focusin", onFI);
      root.removeEventListener("focusout", onFO);
    };
  }, []);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next >= 0) {
      e.preventDefault();
      select(next, true);
      tabRefs.current[next]?.focus();
    }
  }

  function onPan(_: unknown, info: PanInfo) {
    if (!dragHoriz.current) {
      if (Math.abs(info.offset.y) > Math.abs(info.offset.x)) return;
      dragHoriz.current = true;
      setAutoplay(false);
      setDragging(true);
    }
    const w = wRef.current;
    if (!w) return;
    const t = tabRef.current;
    let off = info.offset.x;
    if ((t === 0 && off > 0) || (t === TABS.length - 1 && off < 0)) off *= 0.3;
    x.set(-t * w + off);
    if (Math.abs(info.offset.x) > 6) swallowClick.current = true;
  }

  function onPanEnd(_: unknown, info: PanInfo) {
    const wasHoriz = dragHoriz.current;
    dragHoriz.current = false;
    setDragging(false);
    if (!wasHoriz) return;
    const w = wRef.current;
    const t = tabRef.current;
    let next = t;
    if (w && (Math.abs(info.offset.x) > 0.2 * w || Math.abs(info.velocity.x) > 500)) {
      next = Math.min(TABS.length - 1, Math.max(0, t + (info.offset.x < 0 ? 1 : -1)));
    }
    setTabState(next);
  }

  return (
    <div className="system-panel p-edge" ref={rootRef}>
      <div className="system-tabs" role="tablist" aria-label="System layers">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === i}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === i ? 0 : -1}
            onClick={() => select(i, true)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {tab === i && <motion.span layoutId="sys-tab-pill" className="sys-tab-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            {tab === i && autoplay && !reducedEff && (
              <span key={`${tab}:${barKey}`} className={`sys-progress${paused ? " paused" : ""}`} aria-hidden="true" />
            )}
            <span className="sys-tab-num">{t.num}</span>
            <span className="sys-tab-label">{t.label}</span>
          </button>
        ))}
      </div>
      <motion.div
        className={`system-main${dragging ? " dragging" : ""}`}
        onPanStart={() => { dragHoriz.current = false; swallowClick.current = false; }}
        onPan={onPan}
        onPanEnd={onPanEnd}
        onClickCapture={(e) => {
          if (swallowClick.current) {
            e.preventDefault();
            e.stopPropagation();
            swallowClick.current = false;
          }
        }}
      >
        <Diagram active={TABS[tab].id} onSelect={(id) => select(TABS.findIndex((t) => t.id === id), true)} reduced={reducedEff} />
        <div className="sys-panels" ref={vpRef} style={vpH ? { height: vpH } : undefined}>
          <motion.div className="sys-track" style={{ x }}>
            {TABS.map((t, i) => (
              <div
                key={t.id}
                ref={(el) => { panelRefs.current[i] = el; }}
                className="system-body"
                role="tabpanel"
                id={`panel-${t.id}`}
                aria-labelledby={`tab-${t.id}`}
                aria-hidden={tab !== i ? "true" : undefined}
                inert={tab !== i}
                tabIndex={tab === i ? 0 : -1}
              >
                <div className="system-text">
                  <p className="sys-kicker">Layer {t.num} / 03</p>
                  <h3 className="h3">{t.heading}</h3>
                  {t.body.map((p, j) => <p key={j}>{p}</p>)}
                  <div className="chips sys-chips">{t.chips.map((c) => <span key={c} className="chip">{c}</span>)}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      <div className="system-note">
        <span className="sys-note-dot" aria-hidden="true" />
        Illustrative architecture — a conceptual model of how we structure engagements, not a client project or live dashboard.
      </div>
    </div>
  );
}
