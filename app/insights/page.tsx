import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { articles } from "@/lib/articles";
import { images } from "@/lib/images";
import { fmtDate } from "@/lib/format";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = pageMetadata(
  "Insights",
  "Practical notes on production AI agents, voice AI consent, build-vs-buy decisions, and connecting support to your CRM — from the Lamdix practice.",
  "/insights"
);

export default function InsightsIndex() {
  const [first, ...rest] = articles;
  return (
    <>
      <header className="page-head wrap">
        <p className="crumb"><Link href="/">Lamdix</Link> / Insights</p>
        <h1 className="display">Notes from <em className="serif-em">the practice.</em></h1>
        <p className="lede" style={{ marginTop: 26 }}>
          Field notes on the engineering decisions that matter — written to be
          useful whether or not you ever work with us.
        </p>
      </header>
      <section className="wrap" style={{ paddingBottom: 140 }}>
        <Link href={`/insights/${first.slug}`} className="p-card p-edge" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", overflow: "hidden", marginBottom: 24 }}>
          <span style={{ position: "relative", minHeight: 320 }}>
            <Image src={images[first.cover].file} alt="" fill sizes="(max-width:860px) 100vw, 60vw" style={{ objectFit: "cover", filter: "saturate(0.6) brightness(0.7)" }} />
          </span>
          <span style={{ padding: "clamp(28px,4vw,52px)", display: "flex", flexDirection: "column", gap: 14, justifyContent: "center" }}>
            <span className="insight-meta"><time dateTime={first.date}>{fmtDate(first.date)}</time> · Featured</span>
            <h2 className="h3" style={{ fontSize: "clamp(22px,2.8vw,32px)" }}>{first.title}</h2>
            <p style={{ color: "var(--paper-dim)", fontSize: 14.5 }}>{first.description}</p>
            <span className="link-arrow">Read <Icon icon="ArrowRightSolid" size={14} /></span>
          </span>
        </Link>
        <div className="insight-grid">
          {rest.map((a) => (
            <Link className="insight-card p-card" key={a.slug} href={`/insights/${a.slug}`} style={{ paddingTop: 0, borderTop: "none" }}>
              <span style={{ position: "relative", aspectRatio: "16/9", display: "block" }}>
                <Image src={images[a.cover].file} alt="" fill sizes="(max-width:900px) 100vw, 33vw" style={{ objectFit: "cover", filter: "saturate(0.6) brightness(0.7)" }} />
              </span>
              <span style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                <span className="insight-meta"><time dateTime={a.date}>{fmtDate(a.date)}</time></span>
                <h2 className="h3">{a.title}</h2>
                <p>{a.description}</p>
                <span className="link-arrow">Read <Icon icon="ArrowRightSolid" size={14} /></span>
              </span>
            </Link>
          ))}
        </div>
        <style>{`@media(max-width:860px){.p-card[style*="1.2fr"]{grid-template-columns:1fr !important}}`}</style>
      </section>
    </>
  );
}
