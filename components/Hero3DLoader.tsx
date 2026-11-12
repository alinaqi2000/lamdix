"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Hero3D = dynamic(() => import("./Hero3D").then((m) => m.Hero3D), { ssr: false });
const LambdaMark3D = dynamic(() => import("./LambdaMark3D").then((m) => m.LambdaMark3D), { ssr: false });

type Frameloop = "always" | "never";

export function Hero3DLoader() {
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [fl, setFl] = useState<Frameloop>("never");
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    // Absurdly tall viewports only occur in full-page screenshot compositing;
    // pause the canvas there so the giant framebuffer doesn't stall capture.
    const huge = window.matchMedia("(min-height: 2600px)");
    const apply = () => setFl(onScreen.current && !document.hidden && !huge.matches ? "always" : "never");
    const io = new IntersectionObserver(([e]) => {
      onScreen.current = e.isIntersecting;
      if (e.isIntersecting) setActive(true);
      apply();
    }, { rootMargin: "100px" });
    io.observe(el);
    const onVis = () => apply();
    document.addEventListener("visibilitychange", onVis);
    huge.addEventListener("change", apply);
    const t = setTimeout(() => setReady(true), 1400);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      huge.removeEventListener("change", apply);
      clearTimeout(t);
    };
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 760;
  const poster = isMobile ? "/images/hero-poster-mobile.webp" : "/images/hero-poster.webp";
  const frameloop: Frameloop = reduced ? "never" : fl;

  return (
    <div className="hero-bg" ref={ref} aria-hidden="true" data-frameloop={frameloop}>
      <img src={poster} alt="" className="hero-poster" />
      {!reduced && active && <div className={ready ? "hero-canvas on" : "hero-canvas"}><Hero3D frameloop={frameloop} /><LambdaMark3D /></div>}
    </div>
  );
}
