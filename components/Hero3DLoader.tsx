"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { LambdaSculpture } from "./LambdaSculpture";

const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => null,
});

export function Hero3DLoader() {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setShow(e.isIntersecting),
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="sculpt-frame" ref={ref} style={{ position: "relative", aspectRatio: "1" }}>
      <span className="sculpt-corner tl">Fig. 01 — λ</span>
      <span className="sculpt-corner tr">Scale 1:1<br />Ref. LMDX</span>
      <span className="sculpt-corner bl">x0 y0</span>
      <span className="sculpt-corner br">Lambda / form study</span>
      {show ? (
        <Hero3D />
      ) : (
        <div style={{ position: "absolute", inset: 0 }}>
          <LambdaSculpture />
        </div>
      )}
    </div>
  );
}
