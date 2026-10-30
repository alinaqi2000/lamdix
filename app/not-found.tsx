import Link from "next/link";
import { Wordmark } from "@/components/Logo";

export default function NotFound() {
  return (
    <section className="wrap" style={{ padding: "200px var(--gutter) 160px", textAlign: "center" }}>
      <div style={{ display: "inline-flex", padding: 30, borderRadius: 20, border: "1px solid var(--line)", marginBottom: 40 }}>
        <Wordmark size={64} />
      </div>
      <p className="eyebrow">404 — Not found</p>
      <h1 className="display" style={{ fontSize: "clamp(44px,8vw,104px)", marginTop: 24 }}>
        Nothing <em className="serif-em">here.</em>
      </h1>
      <p className="lede" style={{ margin: "24px auto 0", textAlign: "center" }}>
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div style={{ marginTop: 44, display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn btn-teal">Back to home</Link>
        <Link href="/services" className="link-arrow">Browse services</Link>
      </div>
    </section>
  );
}
