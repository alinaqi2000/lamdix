import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndustry, industries } from "@/lib/industries";
import { services } from "@/lib/services";
import { serviceExtras } from "@/lib/serviceExtras";
import { images } from "@/lib/images";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { IconBox } from "@/components/Icon";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = getIndustry(slug);
  if (!i) return {};
  return pageMetadata(`${i.title} — Industry Solutions`, i.short, `/industries/${i.slug}`);
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Industries", item: `${site.url}/industries` },
      { "@type": "ListItem", position: 3, name: ind.title, item: `${site.url}/industries/${ind.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        crumbs={[{ label: "Lamdix", href: "/" }, { label: "Industries", href: "/industries" }, { label: ind.title }]}
        title={ind.title}
        lede={ind.short}
        image={ind.image}
      />
      <div className="wrap" style={{ paddingBottom: 80 }}>
        <div className="prose">
          {ind.intro.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="feat-grid" style={{ marginTop: 48 }}>
          {ind.challenges.map((c) => (
            <div key={c.title} className="feat p-card p-edge">
              <IconBox icon={c.icon} />
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
      <section className="wrap" style={{ paddingBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 30 }}>
          <p className="eyebrow">What we would build here</p>
        </div>
        <div className="prin-grid">
          {ind.build.map((b) => (
            <Link key={b.title} href={`/services/${b.service}`} className="prin p-card p-edge" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <IconBox icon={serviceExtras[b.service].icon} />
              <h3 className="h3">{b.title}</h3>
              <p>{b.body}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="wrap prose" style={{ paddingBottom: 60 }}>
        <h2>Considerations</h2>
        <ul className="checklist">
          {ind.considerations.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </section>
      <div className="wrap" style={{ paddingBottom: 120 }}><CtaBand /></div>
    </>
  );
}
