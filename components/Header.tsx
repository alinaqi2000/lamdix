"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Icon, IconBox } from "./Icon";
import { nav, site } from "@/lib/site";
import { services } from "@/lib/services";
import { serviceExtras } from "@/lib/serviceExtras";
import { images } from "@/lib/images";

const MEGA_DESC: Record<string, string> = {
  "custom-software-development": "Web, mobile & enterprise platforms",
  "ai-agents-and-chatbots": "Grounded assistants & tool agents",
  "voice-ai-and-calling-agents": "Inbound & outbound voice automation",
  "calling-campaigns": "Consent-first outreach programs",
  "customer-support": "Support ops — humans plus AI",
  "cloud-and-product-engineering": "Cloud, DevOps & product engineering",
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setMega(false); }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const onChange = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mega) setMega(false);
        else if (open) { setOpen(false); toggleRef.current?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, mega]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (open) overlayRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    if (!open || !overlayRef.current) return;
    const el = overlayRef.current;
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [open]);

  const [svcOpen, setSvcOpen] = useState(false);

  return (
    <>
      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <div className="header-pill glass">
          <Link href="/" aria-label="Lamdix — home" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <nav aria-label="Primary">
            <ul className="nav-links">
              {nav.map((item) => (
                <li key={item.href} className="mega-wrap">
                  {"mega" in item && item.mega ? (
                    <div ref={megaRef}
                      onMouseEnter={() => setMega(true)}
                      onMouseLeave={() => setMega(false)}>
                      <button
                        className="mega-trigger"
                        aria-expanded={mega}
                        aria-haspopup="true"
                        onClick={() => setMega((v) => !v)}
                      >
                        {item.label}
                      </button>
                      {mega && (
                        <div className="mega-menu glass" role="menu">
                          <div className="mega-grid">
                            {services.map((s) => (
                              <Link key={s.slug} href={`/services/${s.slug}`} className="mega-item" role="menuitem" onClick={() => setMega(false)}>
                                <IconBox icon={serviceExtras[s.slug].icon} size={18} />
                                <span>
                                  <b>{s.title}</b>
                                  <span>{MEGA_DESC[s.slug] ?? ""}</span>
                                </span>
                              </Link>
                            ))}
                          </div>
                          <Link href="/industries" className="mega-feature p-edge" style={{ minHeight: 260 }} onClick={() => setMega(false)}>
                            <span className="tint-img">
                              <Image src={images.cityNight.file} alt="" fill sizes="300px" />
                            </span>
                            <span className="mf-label">By industry</span>
                            <b>Solutions shaped to your sector</b>
                            <span style={{ marginTop: 12, fontSize: 13, color: "var(--teal)", letterSpacing: "0.1em", textTransform: "uppercase" }}>View industries →</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href={item.href}>{item.label}</Link>
                  )}
                </li>
              ))}
              <li>
                <Link href="/contact" className="nav-cta">Start a project</Link>
              </li>
            </ul>
          </nav>
          <button
            ref={toggleRef}
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-overlay"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon icon={open ? "XmarkSolid" : "MenuHamburger1Solid"} size={20} />
          </button>
        </div>
      </header>
      {open && (
        <div className="mobile-overlay" id="mobile-overlay" ref={overlayRef} role="dialog" aria-modal="true" aria-label="Menu"><div className="aurora" aria-hidden="true" />
          <nav aria-label="Mobile">
            <button className="mo-acc-btn" aria-expanded={svcOpen} onClick={() => setSvcOpen((v) => !v)}>
              <span style={{ display: "flex", gap: 18, alignItems: "center" }}><span className="n">01</span>Services</span>
              <Icon icon="ArrowRightSolid" size={20} className={svcOpen ? "mo-chev open" : "mo-chev"} />
            </button>
            {svcOpen && (
              <div className="mo-svc">
                {services.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} onClick={() => setOpen(false)}>
                    <IconBox icon={serviceExtras[s.slug].icon} size={16} />
                    {s.title}
                  </Link>
                ))}
              </div>
            )}
            {nav.filter((n) => !("mega" in n && n.mega)).map((item, i) => (
              <Link key={item.href} href={item.href} className="mo-link" onClick={() => setOpen(false)}>
                <span className="n">{String(i + 2).padStart(2, "0")}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mo-foot">
            <Link href="/contact" className="btn btn-teal" onClick={() => setOpen(false)}>Start a project</Link>
            <a className="contact-mail" href={`mailto:${site.email}`}>{site.email}</a>
            <div className="mo-legal">
              <Link href="/privacy" onClick={() => setOpen(false)}>Privacy</Link>
              <span>© {new Date().getFullYear()} Lamdix</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
