import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { services } from "@/lib/services";
import { serviceExtras } from "@/lib/serviceExtras";
import { images } from "@/lib/images";
import { Icon, IconBox } from "@/components/Icon";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = pageMetadata(
  "Services",
  "Custom software, AI agents, voice AI, calling campaigns, customer support, and cloud & product engineering — delivered as one connected system.",
  "/services"
);

const models = [
  { icon: "Code1Solid", t: "Project build", p: "A defined scope, delivered in visible increments with written deliverables and a clean handover." },
  { icon: "UserMultiple4Solid", t: "Dedicated squad", p: "A focused engineering unit embedded with your team for a defined period — same standards, your priorities." },
  { icon: "RefreshCircle1ClockwiseSolid", t: "Ongoing partnership", p: "Continuous product engineering and operations with a steady rhythm and explicit response expectations." },
];

export default function ServicesIndex() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Lamdix", href: "/" }, { label: "Services" }]}
        title={<>What we <em className="serif-em">do.</em></>}
        lede="Six disciplines, designed to work as one system — or engaged one at a time where that's what the problem needs."
        image="cityNight"
      />
      <section className="wrap" style={{ paddingBottom: 60 }}>
        {services.map((s, i) => {
          const ex = serviceExtras[s.slug];
          return (
            <Reveal key={s.slug}>
              <div className="p-card p-edge" style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 24, marginBottom: 24, overflow: "hidden" }}>
                <div style={{ gridColumn: i % 2 ? "8/13" : "1/6", gridRow: 1, position: "relative", minHeight: 280 }} className="svc-img">
                  <span className="tint-img"><Image src={images[ex.image].file} alt="" fill sizes="50vw" /></span>
                </div>
                <div style={{ gridColumn: i % 2 ? "1/8" : "6/13", gridRow: 1, padding: "clamp(28px,4vw,56px)" }} className="svc-txt">
                  <IconBox icon={ex.icon} />
                  <h2 className="h3" style={{ margin: "18px 0 12px", fontSize: "clamp(22px,2.6vw,32px)" }}>{s.title}</h2>
                  <p style={{ color: "var(--paper-dim)", fontSize: 15, marginBottom: 20 }}>{s.short}</p>
                  <ul style={{ listStyle: "none", marginBottom: 26 }}>
                    {s.deliverables.slice(0, 3).map((d) => (
                      <li key={d} style={{ display: "flex", gap: 10, alignItems: "baseline", padding: "6px 0", fontSize: 14, color: "var(--paper-dim)" }}>
                        <Icon icon="CheckCircle1Solid" size={15} /><span style={{ minWidth: 0 }}>{d.split(":")[0]}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/services/${s.slug}`} className="link-arrow">Explore {s.title} <Icon icon="ArrowRightSolid" size={14} /></Link>
                </div>
              </div>
            </Reveal>
          );
        })}
        <style>{`@media(max-width:860px){.svc-img,.svc-txt{grid-column:1/-1 !important;}}`}</style>
      </section>
      <section className="wrap" style={{ paddingBottom: 120 }}>
        <div className="section-head" style={{ marginBottom: 40 }}>
          <p className="eyebrow">Engagement models</p>
          <h2 className="h2">Ways to <em className="serif-em">work together.</em></h2>
        </div>
        <div className="prin-grid">
          {models.map((m) => (
            <div key={m.t} className="prin p-card p-edge">
              <IconBox icon={m.icon} />
              <h3 className="h3">{m.t}</h3>
              <p>{m.p}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 64 }}><CtaBand /></div>
      </section>
    </>
  );
}
