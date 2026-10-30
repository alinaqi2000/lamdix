import Link from "next/link";
import Image from "next/image";
import { images, type ImageKey } from "@/lib/images";
import { IconBox } from "./Icon";

export function PageHero({
  crumbs,
  title,
  lede,
  image,
  icon,
  cta,
}: {
  crumbs: { label: string; href?: string }[];
  title: React.ReactNode;
  lede?: string;
  image?: ImageKey;
  icon?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <header className="p-hero">
      {image && (
        <div className="tint-img">
          <Image src={images[image].file} alt="" fill priority sizes="100vw" />
        </div>
      )}
      {!image && <div className="aurora" aria-hidden="true" />}
      <div className="wrap" style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <p className="crumb">
          {crumbs.map((c, i) => (
            <span key={i}>
              {i > 0 && " / "}
              {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
            </span>
          ))}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 26 }}>
          {icon && <IconBox icon={icon} size={22} />}
          <h1 className="display" style={{ fontSize: "clamp(44px,6.2vw,92px)", maxWidth: 1000 }}>{title}</h1>
        </div>
        {lede && <p className="lede" style={{ marginTop: 24, maxWidth: 720 }}>{lede}</p>}
        {cta && <div style={{ marginTop: 32 }}><Link href={cta.href} className="btn btn-teal">{cta.label}</Link></div>}
      </div>
    </header>
  );
}
