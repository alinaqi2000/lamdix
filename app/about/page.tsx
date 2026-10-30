import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { images } from "@/lib/images";
import { IconBox } from "@/components/Icon";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = pageMetadata(
  "About",
  "Lamdix is an independent software & AI agency — engineering custom software, applied AI, and the customer operations that connect them.",
  "/about"
);

const diffs = [
  { icon: "Share1Solid", t: "One connected system", p: "Most agencies sell one layer and leave the seams to you. We design software, AI, and operations as a single system — the integrations are the product." },
  { icon: "Code1Solid", t: "Engineering-first", p: "We are builders before advisors. Every recommendation ends in something that ships — measured on your data, in your infrastructure." },
  { icon: "Shield2CheckSolid", t: "Honest constraints", p: "Scope limits, evaluation results, and the cases where we're the wrong fit — stated plainly before you sign anything." },
];

export default function About() {
  return (
    <>
      <header className="page-head wrap">
        <p className="crumb"><Link href="/">Lamdix</Link> / About</p>
        <h1 className="display">An agency built like a <em className="serif-em">system.</em></h1>
      </header>
      <div className="wrap" style={{ paddingBottom: 80 }}>
        <div className="prose" style={{ maxWidth: 760 }}>
          <p>
            Lamdix is an independent software &amp; AI agency. We exist because the
            three things modern businesses need — custom software, applied AI,
            and the customer operations that connect them — are usually bought
            from three different vendors and never quite meet.
          </p>
          <p>
            We engineer all three as one system. The software layer creates and
            owns your data. The intelligence layer answers from it and acts
            through scoped tools. The operations layer — support, voice, outreach —
            is where that system meets people. Each layer makes the others better.
          </p>
          <p>
            Independence matters: we don't resell platforms, take referral fees,
            or inherit anyone's sales quota. When a SaaS tool or a simpler approach
            beats custom work, that is what we recommend — the assessment is part
            of the job.
          </p>
        </div>
        <div className="bento" style={{ marginTop: 64 }}>
          <div className="bento-cell bento-big p-card p-edge">
            <span className="tint-img"><Image src={images.facadeNight.file} alt={images.facadeNight.alt} fill sizes="(max-width:860px) 100vw, 58vw" /></span>
            <h3 className="h3">Structure before scale</h3>
          </div>
          <div className="bento-cell bento-med p-card p-edge">
            <span className="tint-img"><Image src={images.dataCenter.file} alt={images.dataCenter.alt} fill sizes="(max-width:860px) 100vw, 42vw" /></span>
            <h3 className="h3">Depth over dazzle</h3>
          </div>
        </div>
        <div className="prin-grid" style={{ marginTop: 64 }}>
          {diffs.map((d) => (
            <div key={d.t} className="prin p-card p-edge">
              <IconBox icon={d.icon} />
              <h3 className="h3">{d.t}</h3>
              <p>{d.p}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 64 }}><CtaBand /></div>
      </div>
    </>
  );
}
