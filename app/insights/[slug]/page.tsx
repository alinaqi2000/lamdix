import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/articles";
import { images } from "@/lib/images";
import { site } from "@/lib/site";
import { fmtDate } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { CtaBand } from "@/components/CtaBand";
import { ReadingProgress } from "@/components/ReadingProgress";
import { Icon } from "@/components/Icon";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return pageMetadata(a.title, a.description, `/insights/${a.slug}`, a.date);
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const cover = images[a.cover];
  const related = articles.filter((x) => x.slug !== a.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: a.title,
        description: a.description,
        datePublished: a.date,
        dateModified: a.date,
        image: `${site.url}${cover.file}`,
        inLanguage: "en",
        author: { "@type": "Organization", name: "Lamdix Editorial", url: site.url },
        publisher: { "@type": "Organization", name: site.name, url: site.url, logo: { "@type": "ImageObject", url: `${site.url}/icon-512.png` } },
        mainEntityOfPage: `${site.url}/insights/${a.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Insights", item: `${site.url}/insights` },
          { "@type": "ListItem", position: 3, name: a.title, item: `${site.url}/insights/${a.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="page-head wrap">
        <p className="crumb"><Link href="/">Lamdix</Link> / <Link href="/insights">Insights</Link> / {a.title}</p>
        <h1 className="display" style={{ maxWidth: 980, fontSize: "clamp(32px,4.8vw,62px)", marginTop: 28 }}>{a.title}</h1>
        <p className="insight-meta" style={{ marginTop: 24 }}>
          <time dateTime={a.date}>{fmtDate(a.date)}</time> · Lamdix Editorial
        </p>
      </header>
      <div className="wrap">
        <div className="article-cover">
          <span className="tint-img"><Image src={cover.file} alt={cover.alt} fill priority sizes="100vw" /></span>
        </div>
      </div>
      <div className="wrap article-layout">
        <aside className="toc" aria-label="Contents">
          <p className="insight-meta" style={{ marginBottom: 14 }}>Contents</p>
          {a.sections.map((s) => (
            <a key={s.heading} href={`#${slugify(s.heading)}`}>{s.heading}</a>
          ))}
        </aside>
        <article className="prose">
          {a.intro.map((p, i) => <p key={i}>{p}</p>)}
          {a.sections.map((sec) => (
            <section key={sec.heading}>
              <h2 id={slugify(sec.heading)}>{sec.heading}</h2>
              {sec.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
              {sec.checklist && (
                <ul className="checklist">
                  {sec.checklist.map((c) => <li key={c}><Icon icon="CheckCircle1Solid" size={14} /> {c}</li>)}
                </ul>
              )}
            </section>
          ))}
          <div className="insight-meta" style={{ margin: "40px 0 20px" }}>Related reading</div>
          <div className="insight-grid" style={{ gridTemplateColumns: "1fr 1fr", display: "grid", gap: 18 }}>
            {related.map((r) => (
              <Link key={r.slug} href={`/insights/${r.slug}`} className="insight-card p-card" style={{ paddingTop: 0, borderTop: "none" }}>
                <span style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <span className="insight-meta"><time dateTime={r.date}>{fmtDate(r.date)}</time></span>
                  <h3 className="h3" style={{ fontSize: 17 }}>{r.title}</h3>
                  <span className="link-arrow">Read <Icon icon="ArrowRightSolid" size={14} /></span>
                </span>
              </Link>
            ))}
          </div>
        </article>
      </div>
      <div className="wrap" style={{ paddingBottom: 120 }}><CtaBand /></div>
    </>
  );
}
