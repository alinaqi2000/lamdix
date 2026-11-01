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
  const [active, setActive] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setShow(true); },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!show) return;
    const el = ref.current;
    if (!el) return;
    let onScreen = false;
    const apply = () => setActive(onScreen && !document.hidden);
    const io = new IntersectionObserver(
      ([e]) => { onScreen = e.isIntersecting; apply(); },
      { rootMargin: "50px" }
    );
    io.observe(el);
    const onVisChange = () => apply();
    document.addEventListener("visibilitychange", onVisChange);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, [show]);

  return (
    <div
      className="sculpt-frame"
      ref={ref}
      style={{ position: "relative", aspectRatio: "1" }}
      data-frameloop={show && active ? "always" : "never"}
    >
      <span className="sculpt-corner tl">Fig. 01 — λ</span>
      <span className="sculpt-corner tr">Scale 1:1<br />Ref. LMDX</span>
      <span className="sculpt-corner bl">x0 y0</span>
      <span className="sculpt-corner br">
        <span className={`sculpt-hint desk${interacted ? " off" : ""}`}>Drag to spin · Click to split</span>
        <span className={`sculpt-hint touch${interacted ? " off" : ""}`}>Tap to split</span>
      </span>
      {show ? (
        <Hero3D running={active} onInteract={() => setInteracted(true)} />
      ) : (
        <div style={{ position: "absolute", inset: 0 }}>
          <LambdaSculpture />
        </div>
      )}
    </div>
  );
}
