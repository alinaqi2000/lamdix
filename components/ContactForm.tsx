"use client";

import { useEffect, useRef, useState } from "react";
import { services } from "@/lib/services";

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

type FieldErrors = Record<string, string>;

const BUDGETS = [
  { value: "", label: "Select a range (optional)" },
  { value: "under-25k", label: "Under $25k" },
  { value: "25k-75k", label: "$25k – $75k" },
  { value: "75k-150k", label: "$75k – $150k" },
  { value: "over-150k", label: "Over $150k" },
  { value: "ongoing", label: "Ongoing / retainer" },
];

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove?: (id?: string) => void;
    };
  }
}

function validateForm(form: HTMLFormElement): FieldErrors {
  const errors: FieldErrors = {};
  const fields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    "input[name], select[name], textarea[name]"
  );
  fields.forEach((f) => {
    if (f.name === "website" || f.disabled) return;
    if (f.validity.valueMissing) {
      errors[f.name] = f.type === "checkbox" ? "Consent is required to submit the form" : "This field is required";
    } else if (f.validity.typeMismatch && f.type === "email") {
      errors[f.name] = "Enter a valid email address";
    } else if (f.validity.tooShort) {
      const min = f instanceof HTMLTextAreaElement || f instanceof HTMLInputElement ? f.minLength : 0;
      errors[f.name] = `Tell us a little more — at least ${min} characters`;
    } else if (f.validity.tooLong) {
      errors[f.name] = "This field is too long";
    }
  });
  if (!errors.email) {
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    if (email && email.length > 254) errors.email = "Email is too long";
  }
  if (!errors.service) {
    const svc = (form.elements.namedItem("service") as HTMLSelectElement)?.value;
    const allowed = new Set([...services.map((s) => s.slug), "not-sure"]);
    if (svc && !allowed.has(svc)) errors.service = "Choose a valid service";
  }
  return errors;
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [turnstileProblem, setTurnstileProblem] = useState(false);
  const [ready, setReady] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!TURNSTILE_KEY || !widgetRef.current) return;
    let disposed = false;
    const render = () => {
      if (disposed) return;
      if (window.turnstile && widgetRef.current && widgetId.current === undefined) {
        widgetId.current = window.turnstile.render(widgetRef.current, {
          sitekey: TURNSTILE_KEY,
          action: "contact",
          "response-field-name": "turnstileToken",
          callback: () => setTurnstileProblem(false),
          "expired-callback": () => setTurnstileProblem(true),
          "error-callback": () => setTurnstileProblem(true),
        });
      }
    };
    if (window.turnstile) {
      render();
    } else {
      const existing = document.querySelector('script[data-turnstile]');
      if (!existing) {
        const s = document.createElement("script");
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.dataset.turnstile = "true";
        s.onload = render;
        s.onerror = () => setTurnstileProblem(true);
        document.head.appendChild(s);
      } else {
        existing.addEventListener("load", render);
        return () => {
          disposed = true;
          existing.removeEventListener("load", render);
          if (window.turnstile?.remove && widgetId.current !== undefined) {
            window.turnstile.remove(widgetId.current);
            widgetId.current = undefined;
          }
        };
      }
    }
    return () => {
      disposed = true;
      if (window.turnstile?.remove && widgetId.current !== undefined) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = undefined;
      }
    };
  }, []);

  useEffect(() => {
    setReady(true);
  }, []);

  function focusFirstInvalid(errs: FieldErrors) {
    const first = Object.keys(errs)[0];
    if (!first) return;
    const el = formRef.current?.elements.namedItem(first) as HTMLElement | null;
    el?.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready || status === "sending") return;
    const form = e.currentTarget;
    const clientErrors = validateForm(form);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setStatus("err");
      setMessage("Please check the highlighted fields.");
      focusFirstInvalid(clientErrors);
      return;
    }
    const payload = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setMessage("");
    setErrors({});
    setTurnstileProblem(false);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        errors?: FieldErrors;
      };
      if (res.ok && json.ok) {
        setStatus("ok");
        setMessage(json.message ?? "Your message was accepted by our mail server. We'll be in touch.");
        form.reset();
      } else {
        setStatus("err");
        setMessage(json.message ?? "Something went wrong. Please try again or email us directly.");
        if (json.errors) {
          setErrors(json.errors);
          focusFirstInvalid(json.errors);
        }
      }
    } catch (err) {
      setStatus("err");
      setMessage(
        (err as Error).name === "AbortError"
          ? "The request timed out — we can't confirm whether your message reached us. Please email contact@lamdix.com directly to be sure."
          : "Network error — we can't confirm whether your message reached us. Please email contact@lamdix.com directly or try again."
      );
    } finally {
      clearTimeout(timer);
      if (window.turnstile && widgetId.current !== undefined) {
        window.turnstile.reset(widgetId.current);
      }
    }
  }

  const err = (name: string) =>
    errors[name] ? <span className="err" id={`err-${name}`}>{errors[name]}</span> : null;
  const describedBy = (name: string) => (errors[name] ? `err-${name}` : undefined);

  return (
    <>
      <noscript>
        <p className="noscript-note">
          This form needs JavaScript. You can reach us directly at{" "}
          <a href="mailto:contact@lamdix.com">contact@lamdix.com</a>.
        </p>
      </noscript>
      <form ref={formRef} onSubmit={onSubmit} noValidate method="post" action="/api/contact">
        <div className="form-grid">
          <div className="field half">
            <label htmlFor="f-name">Name <span className="req" aria-hidden="true">*</span></label>
            <input id="f-name" name="name" type="text" required maxLength={100}
              autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
            {err("name")}
          </div>
          <div className="field half">
            <label htmlFor="f-email">Email <span className="req" aria-hidden="true">*</span></label>
            <input id="f-email" name="email" type="email" required maxLength={254}
              autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy("email")} />
            {err("email")}
          </div>
          <div className="field half">
            <label htmlFor="f-company">Company</label>
            <input id="f-company" name="company" type="text" maxLength={160}
              autoComplete="organization" aria-invalid={!!errors.company} aria-describedby={describedBy("company")} />
            {err("company")}
          </div>
          <div className="field half">
            <label htmlFor="f-budget">Budget</label>
            <select id="f-budget" name="budget" aria-invalid={!!errors.budget} aria-describedby={describedBy("budget")}>
              {BUDGETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
            {err("budget")}
          </div>
          <div className="field">
            <label htmlFor="f-service">What do you need? <span className="req" aria-hidden="true">*</span></label>
            <select id="f-service" name="service" required defaultValue=""
              aria-invalid={!!errors.service} aria-describedby={describedBy("service")}>
              <option value="" disabled>Select a service</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>{s.title}</option>
              ))}
              <option value="not-sure">Not sure yet</option>
            </select>
            {err("service")}
          </div>
          <div className="field">
            <label htmlFor="f-message">Project details <span className="req" aria-hidden="true">*</span></label>
            <textarea id="f-message" name="message" required minLength={30} maxLength={5000}
              aria-invalid={!!errors.message} aria-describedby={describedBy("message")}
              placeholder="What are you building, what problem does it solve, and what does success look like?" />
            {err("message")}
          </div>
          <div className="hp-field" aria-hidden="true">
            <label htmlFor="f-website">Website</label>
            <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="field consent">
            <input id="f-consent" name="consent" type="checkbox" value="yes" required
              aria-invalid={!!errors.consent} aria-describedby={describedBy("consent")} />
            <label htmlFor="f-consent">
              I agree to Lamdix storing and processing the details I submit so the team can respond to my inquiry. See the{" "}
              <a href="/privacy">privacy notice</a>.
            </label>
          </div>
          {err("consent")}
          {TURNSTILE_KEY && (
            <div className="field">
              <div ref={widgetRef} aria-label="Spam protection check" />
              {turnstileProblem && (
                <span className="err">
                  The spam check needs attention — please try again, or email us directly.
                </span>
              )}
            </div>
          )}
          <div className="field">
            <button className="btn btn-teal" type="submit" disabled={!ready || status === "sending"}>
              {status === "sending" ? "Sending…" : "Send inquiry"}
            </button>
            <div className="form-status" aria-live="polite">
              {status === "ok" && <span className="ok">{message}</span>}
              {status === "err" && <span className="bad">{message}</span>}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
