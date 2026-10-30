import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { Icon, IconBox } from "@/components/Icon";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { ProcessNav } from "@/components/ProcessNav";
import { phases, together, quality, processFaq } from "@/lib/process";

export const metadata: Metadata = pageMetadata(
  "Process",
  "Discover, Design, Engineer, Evolve — how a Lamdix engagement runs, phase by phase, with honest deliverables.",
  "/process"
);





export default function Process() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: processFaq.map((f) => ({
          "@type": "Question", name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Process", item: `${site.url}/process` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        crumbs={[{ label: "Lamdix", href: "/" }, { label: "Process" }]}
        title={<>Four phases, <em className="serif-em">no mystery.</em></>}
        lede="Every engagement runs the same disciplined arc — scaled to the problem, never padded for the invoice."
        image="dataCenter"
      />
      <div className="wrap" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 48, paddingBottom: 80 }}>
        <ProcessNav phases={phases.map((p) => ({ id: p.id, title: p.t }))} />
        <div style={{ display: "flex", flexDirection: "column", gap: 28, minWidth: 0 }}>
          {phases.map((ph) => (
            <section key={ph.id} id={ph.id} className="phase p-card p-edge" style={{ padding: "clamp(24px,3.5vw,44px)" }}>
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 20 }}>
                <span className="cap-num" style={{ fontSize: 22 }}>{ph.n}</span>
                <div>
                  <IconBox icon={ph.icon} size={22} />
                  <h2 className="h3" style={{ margin: "14px 0 10px" }}>{ph.t}</h2>
                  <p style={{ color: "var(--paper-dim)", fontSize: 14.5, maxWidth: 560 }}>{ph.p}</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="phase-cols">
                <div>
                  <h3 className="eyebrow" style={{ marginBottom: 16 }}>What happens</h3>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                    {ph.happen.map((h) => (
                      <li key={h.t} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <Icon icon={h.i} size={18} className="icn-mini" />
                        <div><b style={{ fontSize: 14 }}>{h.t}</b><p style={{ fontSize: 13, color: "var(--paper-dim)", marginTop: 2 }}>{h.p}</p></div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="eyebrow" style={{ marginBottom: 16 }}>What you get</h3>
                  <ul className="checklist">
                    {ph.get.map((g) => <li key={g}><Icon icon="CheckCircle1Solid" size={14} /> {g}</li>)}
                  </ul>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 24 }} className="phase-cols">
                <div className="p-card" style={{ padding: 20 }}>
                  <h3 className="eyebrow" style={{ marginBottom: 10 }}>Your involvement</h3>
                  <p style={{ fontSize: 13.5, color: "var(--paper-dim)" }}>{ph.involve}</p>
                </div>
                <div className="p-card gate" style={{ padding: 20 }}>
                  <h3 className="eyebrow" style={{ marginBottom: 10, color: "var(--teal)" }}>Decision gate</h3>
                  <p style={{ fontSize: 13.5, color: "var(--paper-dim)" }}>{ph.gate}</p>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:900px){.wrap>div[style*="200px"]{grid-template-columns:1fr !important}.phase-cols{grid-template-columns:1fr !important}}`}</style>

      <section className="wrap" style={{ paddingBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 34 }}>
          <p className="eyebrow">Working with you</p>
          <h2 className="h2">How we <em className="serif-em">collaborate.</em></h2>
        </div>
        <div className="prin-grid">
          {together.map((h) => (
            <div key={h.t} className="prin p-card p-edge" style={{ gridColumn: "span 4" }}>
              <IconBox icon={h.i} />
              <h3 className="h3">{h.t}</h3>
              <p>{h.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 80 }}>
        <div className="cta-band p-edge" style={{ padding: "clamp(36px,5vw,64px)", textAlign: "left" }}>
          <p className="eyebrow">Quality built in</p>
          <div className="chips" style={{ marginTop: 22 }}>
            {quality.map((q) => <span key={q} className="chip" style={{ borderColor: "rgba(38,201,187,0.3)" }}>{q}</span>)}
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 34 }}>
          <p className="eyebrow">After launch</p>
          <h2 className="h2">Handover &amp; <em className="serif-em">beyond.</em></h2>
        </div>
        <div className="prin-grid">
          <div className="prin p-card p-edge" style={{ gridColumn: "span 6" }}>
            <IconBox icon="Books2Solid" />
            <h3 className="h3">Handover package</h3>
            <p>Runbooks, architecture docs, decision records, and a walkthrough — your team operates the system without us.</p>
          </div>
          <div className="prin p-card p-edge" style={{ gridColumn: "span 6" }}>
            <IconBox icon="RefreshCircle1ClockwiseSolid" />
            <h3 className="h3">Ongoing partnership</h3>
            <p>A steady engineering rhythm — maintenance, iteration, and response expectations defined in writing.</p>
          </div>
        </div>
      </section>

      <section className="wrap faq" style={{ paddingBottom: 60 }}>
        <div className="section-head" style={{ marginBottom: 30 }}>
          <p className="eyebrow">Questions</p>
          <h2 className="h2">Asked, <em className="serif-em">answered.</em></h2>
        </div>
        {processFaq.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      </section>

      <div className="wrap" style={{ paddingBottom: 120 }}><CtaBand /></div>
    </>
  );
}
