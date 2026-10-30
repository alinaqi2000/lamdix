"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { industries } from "@/lib/industries";
import { images } from "@/lib/images";
import { Icon } from "./Icon";

export function IndustriesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true })]
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => { reduced.matches ? emblaApi.plugins().autoplay?.stop() : emblaApi.plugins().autoplay?.play(); };
    apply();
    reduced.addEventListener("change", apply);
    return () => { emblaApi.off("select", onSelect); reduced.removeEventListener("change", apply); };
  }, [emblaApi]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div>
      <div className="embla-viewport" ref={emblaRef}>
        <div className="embla-track">
          {industries.map((ind) => (
            <div className="embla-slide" key={ind.slug}>
              <Link href={`/industries/${ind.slug}`} className="ind-card p-edge" style={{ height: "100%" }}>
                <span className="tint-img"><Image src={images[ind.image].file} alt="" fill sizes="(max-width:900px) 86vw, 30vw" /></span>
                <h3 className="h3">{ind.title}</h3>
                <p>{ind.short}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="embla-nav">
        <button className="embla-btn" onClick={prev} aria-label="Previous industries"><Icon icon="ArrowLeftSolid" size={18} /></button>
        <button className="embla-btn" onClick={next} aria-label="Next industries"><Icon icon="ArrowRightSolid" size={18} /></button>
        <div className="embla-dots" role="tablist" aria-label="Industry slides">
          {industries.map((_, i) => (
            <button key={i} className={`embla-dot${i === selected ? " active" : ""}`} onClick={() => emblaApi?.scrollTo(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
