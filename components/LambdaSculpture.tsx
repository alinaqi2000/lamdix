"use client";

import { motion, useReducedMotion } from "framer-motion";

const WHITE_LAMBDA =
  "M29 0H80C109 0 126 15 138 42L157 96L54 272H0L110 96L96 59Q92 29 70 29H29Z";
const TEAL_RIBBON =
  "M165 114L211 234C222 259 245 240 242 223C240 211 234 204 224 202C256 195 282 223 277 249C273 278 238 289 210 278C190 273 181 256 175 240L139 167Z";

export function LambdaSculpture() {
  const reduced = useReducedMotion() ?? false;
  return (
    <div className="sculpt-frame">
      <span className="sculpt-corner tl">Fig. 01 — λ</span>
      <span className="sculpt-corner tr">Scale 1:1<br />Ref. LMDX</span>
      <span className="sculpt-corner bl">x0 y0</span>
      <span className="sculpt-corner br">Lambda / form study</span>
      <motion.svg
        viewBox="0 0 520 520"
        style={{ width: "100%", height: "100%" }}
        animate={reduced ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        role="img"
        aria-label="Dimensional sculptural lambda figure in white and teal"
      >
        <defs>
          <linearGradient id="lam-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#e8e6de" />
            <stop offset="0.8" stopColor="#a9aea7" />
            <stop offset="1" stopColor="#8b908a" />
          </linearGradient>
          <linearGradient id="lam-teal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5fe6d8" />
            <stop offset="0.5" stopColor="#26c9bb" />
            <stop offset="1" stopColor="#0d7f76" />
          </linearGradient>
          <clipPath id="lam-clip"><path d={WHITE_LAMBDA} /></clipPath>
          <clipPath id="rib-clip"><path d={TEAL_RIBBON} /></clipPath>
        </defs>

        <g stroke="rgba(244,241,234,0.12)" strokeWidth="1">
          <line x1="60" y1="260" x2="460" y2="260" strokeDasharray="2 6" />
          <line x1="260" y1="40" x2="260" y2="480" strokeDasharray="2 6" />
          <circle cx="260" cy="260" r="195" fill="none" strokeDasharray="3 7" />
        </g>
        <g stroke="rgba(244,241,234,0.35)" strokeWidth="1">
          <line x1="70" y1="70" x2="98" y2="70" />
          <line x1="70" y1="70" x2="70" y2="98" />
          <line x1="450" y1="450" x2="422" y2="450" />
          <line x1="450" y1="450" x2="450" y2="422" />
        </g>

        <g transform="translate(118 92) scale(1.05)">
          <g transform="translate(16 14)" fill="#05090b" opacity="0.85">
            <path d={WHITE_LAMBDA} />
            <path d={TEAL_RIBBON} />
          </g>
          <path d={TEAL_RIBBON} fill="url(#lam-teal)" />
          <g clipPath="url(#rib-clip)">
            <polygon points="139,167 200,290 160,290 120,190" fill="#0a6c64" opacity="0.85" />
            <polygon points="211,234 280,240 280,290 215,278" fill="#43d9cb" opacity="0.5" />
          </g>
          <path d={WHITE_LAMBDA} fill="url(#lam-metal)" />
          <g clipPath="url(#lam-clip)">
            <polygon points="0,0 110,0 60,290 -20,290" fill="#ffffff" opacity="0.35" />
            <polygon points="110,96 157,96 90,290 40,290" fill="#767b75" opacity="0.55" />
            <polygon points="29,0 80,0 138,42 100,60" fill="#ffffff" opacity="0.5" />
          </g>
          <path
            d={WHITE_LAMBDA}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
          />
        </g>

        <g stroke="rgba(38,201,187,0.7)" strokeWidth="1">
          <line x1="206" y1="80" x2="206" y2="58" />
          <line x1="206" y1="58" x2="330" y2="58" />
        </g>
        <text className="sculpt-note" x="336" y="61" fill="#26c9bb" fontSize="11" fontFamily="var(--font-body)" letterSpacing="2">APEX λ</text>
        <g stroke="rgba(244,241,234,0.4)" strokeWidth="1">
          <line x1="392" y1="352" x2="392" y2="392" />
          <line x1="392" y1="392" x2="312" y2="392" />
        </g>
        <text className="sculpt-note" x="306" y="395" fill="rgba(244,241,234,0.6)" fontSize="11" fontFamily="var(--font-body)" letterSpacing="2" textAnchor="end">RIBBON 02</text>
        <circle cx="260" cy="260" r="3" fill="#26c9bb" />
        <text x="272" y="252" fill="rgba(244,241,234,0.55)" fontSize="10" fontFamily="var(--font-body)" letterSpacing="2">C.01</text>
      </motion.svg>
    </div>
  );
}
