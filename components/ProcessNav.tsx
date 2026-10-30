"use client";

import { useEffect, useState } from "react";

export function ProcessNav({ phases }: { phases: { id: string; title: string }[] }) {
  const [active, setActive] = useState(phases[0]?.id);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    const els = phases.map((p) => document.getElementById(p.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-30% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProg(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [phases]);

  return (
    <nav className="pnav" aria-label="Phases">
      <div className="pnav-rail">
        <span className="pnav-fill" style={{ height: `${prog}%` }} />
        {phases.map((p) => (
          <a key={p.id} href={`#${p.id}`} className={active === p.id ? "active" : ""}>{p.title}</a>
        ))}
      </div>
    </nav>
  );
}
