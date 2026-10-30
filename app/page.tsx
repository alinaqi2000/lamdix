import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Hero3DLoader } from "@/components/Hero3DLoader";
import { SystemPanel } from "@/components/SystemPanel";
import { Reveal, Spotlight } from "@/components/Reveal";
import { IndustriesCarousel } from "@/components/IndustriesCarousel";
import { CtaBand } from "@/components/CtaBand";
import { Icon, IconBox } from "@/components/Icon";
import { services } from "@/lib/services";
import { serviceExtras } from "@/lib/serviceExtras";
import { industries } from "@/lib/industries";
import { articles } from "@/lib/articles";
import { images } from "@/lib/images";
import { site } from "@/lib/site";
import { fmtDate } from "@/lib/format";

export const metadata: Metadata = pageMetadata(
  "Lamdix — Independent Software & AI Agency",
  "Lamdix designs and engineers custom software, applied AI, and the customer operations that connect them — one connected system.",
  "/"
);

const faqs = [
  { q: "What does an engagement with Lamdix look like?", a: "Most engagements start with a scoped discovery: we map the problem, the systems involved, and the risks before writing a line of code. From there we work in visible increments — you review real builds, not status reports." },
  { q: "Do you only build new things, or work with what we have?", a: "Both. We build new products and we take on existing systems — modernization, integrations, and maintenance included. We're candid when an existing tool or a simpler approach beats custom work." },
  { q: "How do you handle AI responsibly — data, accuracy, handoff?", a: "Narrowly scoped tool access, retrieval grounded in your content, evaluation sets built from real inputs, and designed human handoff paths. We don't promise accuracy numbers before evaluating on your data." },
  { q: "What does it cost and how do we start?", a: "Cost depends on scope — we price defined work, not vague retainers. Start with a message through the contact page or an email to contact@lamdix.com, and we'll respond with honest next steps." },
];

const principles = [
  { icon: "Code1Solid", t: "You own the code", p: "Repositories, infrastructure, and documentation are yours from day one. No lock-in by design." },
  { icon: "Shield2CheckSolid", t: "Evaluated before launch", p: "AI features ship only after they are measured on your real data — not on a demo's promise." },
  { icon: "User4Solid", t: "Human handoff by design", p: "Automation knows its limits. Every agent and voice flow has a designed path to a person." },
  { icon: "Locked1Solid", t: "Security by default", p: "Least-privilege access, scoped tools, and honest constraints — stated in writing, not implied." },
];

const marquee = ["Custom Software", "AI Agents", "Voice AI", "Calling Campaigns", "Customer Support", "Cloud Engineering", "APIs & Integrations", "Product Design"];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${site.url}/#org`, name: site.name, url: site.url, email: site.email, description: site.description, logo: `${site.url}/icon-512.png` },
    { "@type": "WebSite", "@id": `${site.url}/#site`, url: site.url, name: site.name, publisher: { "@id": `${site.url}/#org` }, inLanguage: "en" },
  ],
};

const bentoImgs = ["coderDesk", "circuitMacro", "headsetDim", "cableNetwork", "headsetLaptop", "dataCenter"] as const;

export default function Home() {
  const featured = articles.slice(0, 3);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hero">
        <div className="aurora" aria-hidden="true" />
        <div className="wrap hero-grid" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-copy">
            <p className="eyebrow">Independent software &amp; AI agency</p>
            <h1 className="display">
              <span className="hero-line">Build beyond</span>{" "}
              <span className="hero-line">the <em className="serif-em">expected.</em></span>
            </h1>
            <p className="lede">
              We engineer the software your business runs on, the AI that makes it
              smarter, and the customer operations that keep it human — as one
              connected system.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-teal">Start a project</Link>
              <Link href="/services" className="link-arrow">Explore capabilities <Icon icon="ArrowRightSolid" size={14} /></Link>
            </div>
            <div className="hero-bottom">
              <span className="scroll-hint">Scroll</span>
            </div>
          </div>
          <div className="hero-art">
            <Hero3DLoader />
          </div>
          <div className="sys-strip">
            <Link href="/services/custom-software-development" className="sys-seg"><IconBox icon="Code1Solid" size={16} /><span><b>Software</b><span>Apps · APIs · data</span></span></Link>
            <Link href="/services/ai-agents-and-chatbots" className="sys-seg"><IconBox icon="Gears3Solid" size={16} /><span><b>Intelligence</b><span>Agents · voice · eval</span></span></Link>
            <Link href="/services/customer-support" className="sys-seg"><IconBox icon="Headphone1Solid" size={16} /><span><b>Operations</b><span>Support · outreach</span></span></Link>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marquee, ...marquee].map((m, i) => (
            <span className="marquee-item" key={i}><IconBox icon={serviceExtras[services[i % 6].slug].icon} size={15} />{m}</span>
          ))}
        </div>
      </div>

      <section className="section" id="capabilities">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Capabilities</p>
            <h2 className="h2">Six disciplines, <em className="serif-em">one system.</em></h2>
          </div>
          <div className="bento">
            {services.map((s, i) => {
              const cls = i < 2 ? (i === 0 ? "bento-big" : "bento-med") : "bento-sm";
              return (
                <Link href={`/services/${s.slug}`} key={s.slug} className={`bento-cell p-card p-edge ${cls}`}>
                  <span className="tint-img">
                    <Image src={images[bentoImgs[i]].file} alt="" fill sizes="(max-width:860px) 100vw, 50vw" />
                  </span>
                  <IconBox icon={serviceExtras[s.slug].icon} />
                  <h3 className="h3">{s.title}</h3>
                  <p>{s.short.split("—")[0]}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">The model</p>
            <h2 className="h2">One connected <em className="serif-em">system.</em></h2>
            <p className="lede" style={{ marginTop: 20 }}>
              Software, intelligence, and operations are usually bought separately
              and never quite connect. We design them as layers of a single system.
            </p>
          </div>
          <SystemPanel />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Industries</p>
            <h2 className="h2">Built for <em className="serif-em">your world.</em></h2>
          </div>
        </div>
        <IndustriesCarousel />
      </section>

      <section className="section" id="approach" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="approach-head">
            <p className="eyebrow">Approach</p>
            <h2 className="h2" style={{ margin: "18px 0 20px" }}>Disciplined, then <em className="serif-em">ambitious.</em></h2>
            <p className="lede" style={{ maxWidth: 640 }}>Four phases, honest deliverables, and a working relationship built on visibility.</p>
            <div style={{ marginTop: 28 }}><Link href="/process" className="link-arrow">See the full process <Icon icon="ArrowRightSolid" size={14} /></Link></div>
          </div>
          <div className="approach-rail">
            <div className="approach-grid">
            {[
              { i: "TargetUserSolid", n: "01", t: "Discover", p: "Map the real problem — users, systems, constraints.", d: ["Plan", "Scope", "Risks"] },
              { i: "Layout9Solid", n: "02", t: "Design", p: "Architecture and flows designed before code.", d: ["Architecture", "Interfaces", "Decisions"] },
              { i: "Code1Solid", n: "03", t: "Engineer", p: "Visible increments with tests on risk paths.", d: ["Builds", "Tests", "Docs"] },
              { i: "RefreshCircle1ClockwiseSolid", n: "04", t: "Evolve", p: "Deployment, monitoring, steady iteration.", d: ["Pipelines", "Runbooks", "Care"] },
            ].map((s, idx) => (
              <Reveal key={s.n} delay={idx * 0.08}>
                <Spotlight className="approach-card">
                  <span className="approach-node" />
                  <span className="approach-num">{s.n}</span>
                  <IconBox icon={s.i} />
                  <h3 className="h3">{s.t}</h3>
                  <p>{s.p}</p>
                  <div className="chips">{s.d.map((c) => <span key={c} className="chip">{c}</span>)}</div>
                </Spotlight>
              </Reveal>
            ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Principles</p>
            <h2 className="h2">How we <em className="serif-em">work.</em></h2>
          </div>
          <div className="prin-grid">
            {principles.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.06} className="prin p-card p-edge">
                <IconBox icon={p.icon} />
                <h3 className="h3">{p.t}</h3>
                <p>{p.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Insights</p>
            <h2 className="h2">Notes from <em className="serif-em">the practice.</em></h2>
          </div>
          <div className="insight-grid">
            {featured.map((a) => (
              <Link className="insight-card p-card" key={a.slug} href={`/insights/${a.slug}`} style={{ paddingTop: 0, borderTop: "none" }}>
                <span style={{ position: "relative", aspectRatio: "16/9", display: "block" }}>
                  <Image src={images[a.cover].file} alt="" fill sizes="(max-width:900px) 100vw, 33vw" style={{ objectFit: "cover", filter: "saturate(0.6) brightness(0.7)" }} />
                </span>
                <span style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <span className="insight-meta"><time dateTime={a.date}>{fmtDate(a.date)}</time></span>
                  <h3 className="h3">{a.title}</h3>
                  <p>{a.description}</p>
                  <span className="link-arrow">Read <Icon icon="ArrowRightSolid" size={14} /></span>
                </span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 48 }}>
            <Link href="/insights" className="link-arrow">All insights <Icon icon="ArrowRightSolid" size={14} /></Link>
          </div>
        </div>
      </section>

      <section className="section faq" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 className="h2">Asked, <em className="serif-em">answered.</em></h2>
          </div>
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap"><CtaBand /></div>
      </section>
    </>
  );
}
