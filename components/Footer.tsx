import Link from "next/link";
import { services } from "@/lib/services";
import { serviceExtras } from "@/lib/serviceExtras";
import { industries } from "@/lib/industries";
import { articles } from "@/lib/articles";
import { site } from "@/lib/site";
import { Icon } from "./Icon";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-cta-row">
          <div>
            <p className="eyebrow">Get in touch</p>
            <h2 className="h2" style={{ marginTop: 14 }}>Have a system in <em className="serif-em">mind?</em></h2>
          </div>
          <Link href="/contact" className="btn btn-teal">Start a project</Link>
        </div>
        <div className="footer-grid" style={{ marginTop: 56 }}>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              {services.map((s) => (
                <li key={s.slug} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon icon={serviceExtras[s.slug].icon} size={14} />
                  <Link href={`/services/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Industries</h4>
            <ul>
              {industries.map((i) => (
                <li key={i.slug}><Link href={`/industries/${i.slug}`}>{i.title}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/process">Process</Link></li>
              <li><Link href="/insights">Insights</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><Link href="/privacy">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-word wordmark" aria-hidden="true">
          Lamd<span className="i-teal">i</span><span className="x">x</span>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Lamdix — {site.url.replace("https://", "")}</span>
          <span>Independent software &amp; AI agency</span>
        </div>
      </div>
    </footer>
  );
}
