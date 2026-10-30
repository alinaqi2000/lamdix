import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { industries } from "@/lib/industries";
import { images } from "@/lib/images";
import { Icon } from "@/components/Icon";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = pageMetadata(
  "Industries",
  "How Lamdix approaches software, AI, and customer operations across ecommerce, healthcare, fintech, logistics, real estate, and SaaS.",
  "/industries"
);

export default function IndustriesIndex() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Lamdix", href: "/" }, { label: "Industries" }]}
        title={<>Built for <em className="serif-em">your world.</em></>}
        lede="Every sector has its own constraints — data rules, call volumes, legacy systems. Here is how we would approach yours."
        image="cityNight"
      />
      <section className="wrap" style={{ paddingBottom: 140 }}>
        <div className="bento" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
          {industries.map((ind) => (
            <Link key={ind.slug} href={`/industries/${ind.slug}`} className="ind-card p-edge" style={{ minHeight: 380 }}>
              <span className="tint-img"><Image src={images[ind.image].file} alt="" fill sizes="(max-width:860px) 100vw, 50vw" /></span>
              <h2 className="h3" style={{ margin: "10px 0 6px" }}>{ind.title}</h2>
              <p>{ind.short}</p>
              <span className="link-arrow" style={{ marginTop: 14 }}>Explore <Icon icon="ArrowRightSolid" size={14} /></span>
            </Link>
          ))}
        </div>
        <style>{`@media(max-width:820px){.bento{grid-template-columns:1fr !important}}`}</style>
        <div style={{ marginTop: 64 }}><CtaBand /></div>
      </section>
    </>
  );
}
