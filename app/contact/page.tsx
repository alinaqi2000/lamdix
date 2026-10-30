import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";
import { IconBox } from "@/components/Icon";

export const metadata: Metadata = pageMetadata(
  "Contact — Start a project",
  "Start a project with Lamdix. Tell us what you're building or fixing — we read every inquiry and reply from contact@lamdix.com.",
  "/contact"
);

const steps = [
  { icon: "FileMultipleSolid", t: "You write", p: "Describe what you're building or fixing — a few honest sentences beat a polished pitch." },
  { icon: "Books2Solid", t: "We read", p: "Every inquiry is read by the people who would do the work — not screened by a form handler." },
  { icon: "ChatBubble2Solid", t: "We reply", p: "We respond from contact@lamdix.com — usually with questions before answers, and honestly when we're not the right fit." },
];

export default function Contact() {
  return (
    <>
      <header className="page-head wrap">
        <p className="crumb"><Link href="/">Lamdix</Link> / Contact</p>
        <h1 className="display">The next move is <em className="serif-em">yours.</em></h1>
      </header>
      <div className="wrap contact-grid" style={{ paddingBottom: 140 }}>
        <div className="contact-left">
          <p className="lede">
            Tell us what you&apos;re building or fixing. We read every inquiry
            ourselves and reply from a real inbox.
          </p>
          <a className="contact-mail" href={`mailto:${site.email}`}>{site.email}</a>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 20 }}>
            {steps.map((s, i) => (
              <div key={s.t} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <IconBox icon={s.icon} />
                <div>
                  <h2 className="h3" style={{ fontSize: 17, marginBottom: 4 }}>
                    <span className="step-num" style={{ marginRight: 8 }}>{String(i + 1).padStart(2, "0")}</span>
                    {s.t}
                  </h2>
                  <p style={{ color: "var(--paper-dim)", fontSize: 14, maxWidth: 420 }}>{s.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="contact-right p-card p-edge">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
