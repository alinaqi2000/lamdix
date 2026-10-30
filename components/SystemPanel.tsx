"use client";

import { useRef, useState } from "react";

const TABS = [
  {
    id: "software",
    label: "Software",
    heading: "The product layer",
    body: [
      "Custom applications, portals, and APIs form the operational core — where data is created, work is done, and customers interact. This layer owns the system's source of truth.",
      "Everything above it — intelligence, operations — reads from and writes back to this foundation, which is why we design it first.",
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    heading: "The applied AI layer",
    body: [
      "Agents and retrieval systems sit on top of the product layer: they answer from your knowledge, classify and route work, and act through narrowly scoped tools.",
      "Nothing here is free-floating. Every agent's access is defined, evaluated, and monitored against the same systems your team uses.",
    ],
  },
  {
    id: "operations",
    label: "Operations",
    heading: "The customer operations layer",
    body: [
      "Support, voice, and outreach are where the system meets people. Conversations flow in from every channel, get handled by the right mix of AI and humans, and write their outcomes back to the record.",
      "The loop is what matters: operations continuously feeds the intelligence layer better data and the product layer better information about what to fix.",
    ],
  },
] as const;

function Diagram({ variant }: { variant: string }) {
  const layers = [
    { id: "software", label: "SOFTWARE", sub: "apps · apis · data" },
    { id: "intelligence", label: "INTELLIGENCE", sub: "agents · retrieval · tools" },
    { id: "operations", label: "OPERATIONS", sub: "support · voice · outreach" },
  ];
  const active = layers.findIndex((l) => l.id === variant);
  return (
    <svg viewBox="0 0 560 340" style={{ width: "100%", height: "auto" }} aria-hidden="true">
      {layers.map((l, i) => {
        const y = 30 + i * 105;
        const on = i === active;
        return (
          <g key={l.id}>
            <rect
              x="40" y={y} width="380" height="80"
              fill={on ? "rgba(38,201,187,0.08)" : "var(--ink)"}
              stroke={on ? "#26c9bb" : "rgba(244,241,234,0.25)"}
              strokeWidth="1.5"
            />
            <text x="64" y={y + 36} fill={on ? "#26c9bb" : "var(--paper)"}
              fontSize="15" fontWeight="600" letterSpacing="3" fontFamily="var(--font-body)">
              {`0${i + 1} — ${l.label}`}
            </text>
            <text x="64" y={y + 58} fill="rgba(244,241,234,0.55)" fontSize="11.5" letterSpacing="1.5" fontFamily="var(--font-body)">
              {l.sub}
            </text>
            {on && <rect x="40" y={y} width="4" height="80" fill="#26c9bb" />}
            {i < 2 && (
              <g stroke={i === active || i + 1 === active ? "#26c9bb" : "rgba(244,241,234,0.25)"} strokeWidth="1.5">
                <line x1="230" y1={y + 80} x2="230" y2={y + 105} />
                <path d={`M230 ${y + 105} l-5 -8 h10 z`} fill={i === active || i + 1 === active ? "#26c9bb" : "rgba(244,241,234,0.25)"} stroke="none" />
              </g>
            )}
          </g>
        );
      })}
      <g stroke="rgba(38,201,187,0.55)" strokeWidth="1.2" strokeDasharray="4 5" fill="none">
        <path d="M420 270 C 500 270 500 70 420 70" />
        <path d="M420 70 l8 -4 v8 z" fill="rgba(38,201,187,0.55)" stroke="none" />
      </g>
      <text x="478" y="175" fill="rgba(38,201,187,0.8)" fontSize="10" letterSpacing="2" fontFamily="var(--font-body)" transform="rotate(90 478 175)">FEEDBACK</text>
    </svg>
  );
}

export function SystemPanel() {
  const [tab, setTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next >= 0) {
      e.preventDefault();
      setTab(next);
      tabRefs.current[next]?.focus();
    }
  }

  return (
    <div className="system-panel">
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
            onClick={() => setTab(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {TABS.map((t, i) => (
        <div
          key={t.id}
          className="system-body"
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          tabIndex={tab === i ? 0 : -1}
          hidden={tab !== i}
        >
          <div className="system-diagram">
            <Diagram variant={t.id} />
          </div>
          <div className="system-text">
            <h3 className="h3">{t.heading}</h3>
            {t.body.map((p, j) => <p key={j}>{p}</p>)}
          </div>
        </div>
      ))}
      <div className="system-note">
        Illustrative architecture — a conceptual model of how we structure engagements, not a client project or live dashboard.
      </div>
    </div>
  );
}
