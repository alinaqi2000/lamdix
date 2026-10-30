import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { Icon, IconBox } from "@/components/Icon";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { ProcessNav } from "@/components/ProcessNav";

export const metadata: Metadata = pageMetadata(
  "Process",
  "Discover, Design, Engineer, Evolve — how a Lamdix engagement runs, phase by phase, with honest deliverables.",
  "/process"
);

const phases = [
  {
    id: "discover", n: "01", icon: "TargetUserSolid", t: "Discover",
    p: "We map the real problem before proposing anything — users, systems, constraints, data, and what success measurably looks like.",
    happen: [
      { i: "UserMultiple4Solid", t: "Stakeholder sessions", p: "Interviews with the people who own and use the system." },
      { i: "Share1Solid", t: "Systems audit", p: "Existing tools, integrations, data quality, and constraints." },
      { i: "BarChart4Solid", t: "Success criteria", p: "Measurable outcomes agreed before scope is set." },
    ],
    get: ["Written technical plan", "Scope & risk assessment", "Build-vs-buy recommendation", "Success criteria"],
    involve: "A few focused conversations and access to the systems and people who know the problem.",
    gate: "The plan is worth building — and you agree it is. If custom work isn't the answer, we say so here.",
  },
  {
    id: "design", n: "02", icon: "Layout9Solid", t: "Design",
    p: "Architecture, interfaces, and flows designed before implementation — reviewed with you, not presented after.",
    happen: [
      { i: "Share1Solid", t: "System architecture", p: "How the pieces connect: data model, services, integrations." },
      { i: "Layout9Solid", t: "Interface design", p: "Screens and flows designed for the people who'll use them." },
      { i: "Notebook1Solid", t: "Decision records", p: "Why each choice was made — documented, not tribal." },
    ],
    get: ["System architecture", "Interface design", "Data & integration model", "Decision records"],
    involve: "Reviewing designs and flows — your feedback lands before a line of production code.",
    gate: "You sign off on architecture and interfaces. Changes here are cheap; later they aren't.",
  },
  {
    id: "engineer", n: "03", icon: "Code1Solid", t: "Engineer",
    p: "Software built in visible increments — you review working builds, not status decks.",
    happen: [
      { i: "RefreshCircle1ClockwiseSolid", t: "Weekly increments", p: "Working software to try and review on a fixed rhythm." },
      { i: "Shield2CheckSolid", t: "Risk-path testing", p: "Automated tests weighted toward the paths that carry business risk." },
      { i: "Locked1Solid", t: "Your repositories", p: "Code lands in repos and infrastructure you own from day one." },
    ],
    get: ["Working builds to review", "Automated test coverage", "Your repos & infrastructure", "Honest progress reporting"],
    involve: "A weekly review where you see real progress and decide what happens next.",
    gate: "The increment does what was promised, tested, and you're satisfied with the direction.",
  },
  {
    id: "evolve", n: "04", icon: "RefreshCircle1ClockwiseSolid", t: "Evolve",
    p: "Deployment, monitoring, and the steady iteration that keeps software healthy after launch.",
    happen: [
      { i: "Cloud2Solid", t: "Deployment", p: "Pipelines, environments, rollback paths — releases that are boring." },
      { i: "BarChart4Solid", t: "Observability", p: "Monitoring, logging, and evaluation sampling for AI features." },
      { i: "Books2Solid", t: "Handover", p: "Runbooks and documentation so the system outlives the engagement." },
    ],
    get: ["Deployment pipelines", "Runbooks & handover docs", "Monitoring setup", "Optional maintenance rhythm"],
    involve: "Deciding what launches and when — we handle the plumbing.",
    gate: "The system is live, monitored, documented, and your team can operate it.",
  },
];

const together = [
  { i: "AgendaSolid", t: "Weekly demos", p: "Real builds reviewed on a fixed cadence." },
  { i: "Notebook1Solid", t: "Written updates", p: "Async progress and decisions in writing." },
  { i: "Books2Solid", t: "Shared backlog", p: "One prioritized list we both maintain." },
  { i: "User4Solid", t: "Direct access", p: "You talk to the engineers, not a relay." },
  { i: "Locked1Solid", t: "Your accounts", p: "Repos, cloud, and tooling under your ownership." },
  { i: "FileMultipleSolid", t: "Documented decisions", p: "The reasoning survives the project." },
];

const quality = ["Automated tests on risk paths", "Code review before merge", "Security baseline & dependency hygiene", "Evaluation sets for AI features", "Observability & alerting"];

const faqs = [
  { q: "How long does an engagement take?", a: "It depends entirely on scope — we price and plan defined work, not vague retainers. Discovery produces a concrete plan with honest estimates." },
  { q: "Can you start mid-project?", a: "Yes — taking over an existing build starts with an honest assessment of what's there before we commit to a direction." },
  { q: "Who owns the work?", a: "You do — repositories, infrastructure, and documentation are yours throughout, not handed over at the end." },
  { q: "What if we need changes later?", a: "We offer a maintenance and partnership rhythm, or a clean handover — either way the documentation means you're never locked in." },
];

export default function Process() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
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
        {faqs.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      </section>

      <div className="wrap" style={{ paddingBottom: 120 }}><CtaBand /></div>
    </>
  );
}
