import Link from "next/link";

export function CtaBand({ title = <>The next move is <em className="serif-em">yours.</em></>, text = "Tell us what you're building or fixing. We read every inquiry ourselves and reply from a real inbox." }: { title?: React.ReactNode; text?: string }) {
  return (
    <div className="cta-band p-edge">
      <p className="eyebrow">Start a project</p>
      <h2 className="h2" style={{ margin: "18px 0 16px" }}>{title}</h2>
      <p className="lede" style={{ margin: "0 auto 34px", maxWidth: "52ch" }}>{text}</p>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
        <Link href="/contact" className="btn btn-teal">Start a project</Link>
        <a href="mailto:contact@lamdix.com" className="link-arrow">contact@lamdix.com</a>
      </div>
    </div>
  );
}
