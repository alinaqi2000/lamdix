import Link from "next/link";

export function CtaBand({ title = <>The next move is <em className="serif-em">yours.</em></>, text = "Tell us what you're building or fixing. We read every inquiry ourselves and reply from a real inbox." }: { title?: React.ReactNode; text?: string }) {
  return (
    <div className="cta-band p-edge">
      <p className="eyebrow">Start a project</p>
      <h2 className="h2">{title}</h2>
      <p className="lede">{text}</p>
      <div className="cta-actions">
        <Link href="/contact" className="btn btn-teal">Start a project</Link>
        <a href="mailto:contact@lamdix.com" className="link-arrow">contact@lamdix.com</a>
      </div>
    </div>
  );
}
