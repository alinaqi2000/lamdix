import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Privacy",
  "How Lamdix handles the personal data you send us through this website.",
  "/privacy"
);

export default function Privacy() {
  return (
    <>
      <header className="page-head wrap">
        <p className="crumb"><Link href="/">Lamdix</Link> / Privacy</p>
        <h1 className="display">Privacy notice.</h1>
      </header>
      <div className="wrap prose" style={{ paddingBottom: 140 }}>
        <p>
          This notice explains what happens to the personal information you send
          us through this website. It is written to be accurate and readable —
          it is not a comprehensive legal document, and it does not create legal
          guarantees beyond what applicable law already provides.
        </p>

        <h2>What we collect</h2>
        <p>
          When you use the contact form, we collect what you type into it: your
          name, email address, company (optional), the service you&apos;re
          interested in, an optional budget range, and your message. Submitting
          the form sends this to us by email at {site.email}.
        </p>

        <h2>How we use it</h2>
        <p>
          We use this information for one purpose: to respond to your inquiry and
          conduct any working relationship that follows. We do not sell it, share
          it with advertisers, or use it to build marketing profiles.
        </p>

        <h2>Technical data</h2>
        <p>
          The site is hosted on Vercel, which processes standard technical data
          (IP address, browser, request logs) to serve pages and keep the site
          secure. Form submissions are delivered to us by email via our mailbox
          provider (Spacemail). If enabled, an optional anti-spam check on the
          contact form is verified by Cloudflare Turnstile, which processes a
          verification token. No analytics or advertising trackers are used on
          this site.
        </p>

        <h2>Retention &amp; your choices</h2>
        <p>
          We keep inquiry emails for as long as they are useful to the
          conversation and a reasonable period after. You may ask us at any time
          to correct or delete the information you have sent us — email{" "}
          <a href={`mailto:${site.email}`} style={{ textDecoration: "underline" }}>{site.email}</a>{" "}
          and we will act on it. Your legal rights over your data depend on the
          jurisdiction that applies to you; this notice does not limit them.
        </p>

        <h2>Changes</h2>
        <p>
          If this notice changes materially we will update this page. Last
          reviewed: October 2026.
        </p>
      </div>
    </>
  );
}
