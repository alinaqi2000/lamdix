import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, services } from "@/lib/services";
import { serviceExtras } from "@/lib/serviceExtras";
import { getArticle } from "@/lib/articles";
import { images } from "@/lib/images";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { Icon, IconBox } from "@/components/Icon";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata(s.title, s.short, `/services/${s.slug}`);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const ex = serviceExtras[slug];
  const related = s.related.map((r) => getService(r.slug)!).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: s.title,
        description: s.short,
        provider: { "@type": "Organization", name: site.name, url: site.url },
        url: `${site.url}/services/${s.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
          { "@type": "ListItem", position: 3, name: s.title, item: `${site.url}/services/${s.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: ex.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        crumbs={[{ label: "Lamdix", href: "/" }, { label: "Services", href: "/services" }, { label: s.title }]}
        title={s.title}
        lede={s.short}
        image={ex.image}
        icon={ex.icon}
        cta={{ label: "Start a project", href: "/contact" }}
      />

      <section className="wrap" style={{ paddingBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 40 }}>
          <p className="eyebrow">What we build</p>
        </div>
        <div className="feat-grid">
          {ex.features.map((f) => (
            <div key={f.title} className="feat p-card p-edge">
              <IconBox icon={f.icon} />
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap svc-layout" style={{ paddingBottom: 80 }}>
        <div className="svc-main prose">
          <h2 style={{ marginTop: 0 }}>What you get</h2>
          <ul className="checklist">
            {s.deliverables.map((d) => <li key={d}><Icon icon="CheckCircle1Solid" size={15} /> {d}</li>)}
          </ul>
          <h2>How it runs</h2>
          <div className="step-grid" style={{ gridTemplateColumns: "1fr 1fr", display: "grid", gap: 18 }}>
            {ex.process.map((p, i) => (
              <div key={p.title} className="step p-card" style={{ padding: 20 }}>
                <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3" style={{ margin: "10px 0 8px", fontSize: 18 }}>{p.title}</h3>
                <p style={{ fontSize: 14 }}>{p.body}</p>
              </div>
            ))}
          </div>
          <h2>Scope &amp; constraints</h2>
          <ul className="checklist">
            {s.scope.map((x) => <li key={x}>{x}</li>)}
          </ul>
          <h2>Questions</h2>
          <div className="faq">
            {ex.faq.map((f) => (
              <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </div>
        <aside className="svc-aside">
          <div className="box">
            <h3>Tooling territory</h3>
            <div className="chips">
              {ex.chips.map((c) => <span key={c} className="chip">{c}</span>)}
            </div>
          </div>
          <div className="box">
            <h3>Further reading</h3>
            <ul>
              {s.relatedArticles.map((a) => {
                const art = getArticle(a);
                return art ? <li key={a}><Link href={`/insights/${a}`}>{art.title}</Link></li> : null;
              })}
            </ul>
          </div>
        </aside>
      </section>

      <section className="wrap" style={{ paddingBottom: 60 }}>
        <div className="section-head" style={{ marginBottom: 30 }}>
          <p className="eyebrow">Related services</p>
        </div>
        <div className="prin-grid">
          {related.map((r) => (
            <Link key={r.slug} href={`/services/${r.slug}`} className="prin p-card p-edge" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <IconBox icon={serviceExtras[r.slug].icon} />
              <h3 className="h3">{r.title}</h3>
              <p>{r.short.split("—")[0]}</p>
              <span className="link-arrow">Explore <Icon icon="ArrowRightSolid" size={14} /></span>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 64 }}><CtaBand /></div>
      </section>
    </>
  );
}
