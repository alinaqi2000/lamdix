import Link from "next/link";
import { services } from "@/lib/services";
import { serviceExtras } from "@/lib/serviceExtras";
import { industries } from "@/lib/industries";
import { site } from "@/lib/site";
import { Icon } from "./Icon";
import { Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <Wordmark />
            <p className="footer-tag">{site.description.split(". ")[0]}.</p>
            <a className="footer-mail" href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div className="footer-col footer-svc">
            <h4>Services</h4>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>
                    <Icon icon={serviceExtras[s.slug].icon} size={14} />
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col footer-ind">
            <h4>Industries</h4>
            <ul>
              {industries.map((i) => (
                <li key={i.slug}><Link href={`/industries/${i.slug}`}>{i.title}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-col footer-co">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/process">Process</Link></li>
              <li><Link href="/insights">Insights</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Lamdix — {site.url.replace("https://", "")}</span>
          <span>Independent software &amp; AI agency</span>
        </div>
        <div className="footer-word-wrap" aria-hidden="true">
          <div className="footer-word">
            Lamd<span className="i-teal">i</span><span className="x">x</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
