import { z } from "zod";

export const MAX_BODY_BYTES = 16 * 1024;
export const RATE_LIMIT = 5;
export const RATE_WINDOW_MS = 15 * 60 * 1000;
export const RATE_MAX_KEYS = 5000;
export const TURNSTILE_TOKEN_MAX = 2048;

export const SERVICE_ENUM = [
  "custom-software-development",
  "ai-agents-and-chatbots",
  "voice-ai-and-calling-agents",
  "calling-campaigns",
  "customer-support",
  "cloud-and-product-engineering",
  "not-sure",
] as const;

export const BUDGET_ENUM = [
  "",
  "under-25k",
  "25k-75k",
  "75k-150k",
  "over-150k",
  "ongoing",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .email("Enter a valid email address"),
  company: z.string().trim().max(160, "Company name is too long").optional().or(z.literal("")),
  service: z.enum(SERVICE_ENUM, { message: "Choose a valid service" }),
  budget: z.enum(BUDGET_ENUM).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(30, "Tell us a little more — at least 30 characters")
    .max(5000, "Message is too long"),
  consent: z.literal("yes", { message: "Consent is required to submit the form" }),
  website: z.string().max(200).optional(), // honeypot
  turnstileToken: z.string().max(TURNSTILE_TOKEN_MAX).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Escape HTML for the (plain-text-first) message body. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip CR/LF so a value can never inject mail headers. */
export function headerSafe(s: string): string {
  return s.replace(/[\r\n]+/g, " ").trim();
}

/** Read a request body with a hard byte cap; never trust Content-Length. */
export async function readBoundedBody(
  req: Request,
  maxBytes = MAX_BODY_BYTES
): Promise<{ ok: true; text: string } | { ok: false; status: 400 | 413 }> {
  if (!req.body) return { ok: true, text: "" };
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > maxBytes) {
          await reader.cancel().catch(() => {});
          return { ok: false, status: 413 };
        }
        chunks.push(value);
      }
    }
  } catch {
    return { ok: false, status: 400 };
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.byteLength;
  }
  return { ok: true, text: new TextDecoder().decode(merged) };
}

/** Same-origin check: request Origin must match request URL or configured site URL. */
export function isTrustedOrigin(req: Request, siteUrl: string): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false; // we document that browsers always send Origin on POST
  try {
    const o = new URL(origin);
    const reqOrigin = new URL(req.url).origin;
    const siteOrigin = new URL(siteUrl).origin;
    return o.origin === reqOrigin || o.origin === siteOrigin;
  } catch {
    return false;
  }
}

/** Best-effort in-process rate limiter. Documented limitation: per-instance
 *  memory on serverless — recommend Vercel WAF rate limiting for production. */
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, now = Date.now()): boolean {
  const k = key.slice(0, 64);
  if (buckets.size >= RATE_MAX_KEYS) {
    for (const [bk, v] of buckets) if (v.reset <= now) buckets.delete(bk);
  }
  const b = buckets.get(k);
  if (!b || b.reset <= now) {
    if (buckets.size >= RATE_MAX_KEYS && !b) return false;
    buckets.set(k, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (b.count >= RATE_LIMIT) return false;
  b.count += 1;
  return true;
}

export function resetRateLimits() {
  buckets.clear();
}

/** Client IP: trust Vercel's forwarded header only when deployed on Vercel. */
export function clientKey(req: Request): string {
  if (process.env.VERCEL) {
    const fwd = req.headers.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0].trim();
    const real = req.headers.get("x-real-ip");
    if (real) return real.trim();
  }
  return "local";
}

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  requireTLS?: boolean;
  user: string;
  pass: string;
  mailTo: string;
};

export function getSmtpConfig(env = process.env): SmtpConfig | null {
  const host = env.SMTP_HOST ?? "mail.spacemail.com";
  const port = Number(env.SMTP_PORT ?? "465");
  const user = env.SMTP_USER ?? "contact@lamdix.com";
  const pass = env.SMTP_PASS ?? "";
  const mailTo = env.MAIL_TO ?? "contact@lamdix.com";
  if (!host || !user || !pass || !mailTo) return null;
  if (!Number.isInteger(port) || (port !== 465 && port !== 587)) return null;
  return {
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    user,
    pass,
    mailTo,
  };
}

export type TurnstileConfig = { siteKey: string; secret: string } | "partial" | null;

/** Fail closed on partial Turnstile configuration. */
export function getTurnstileConfig(env = process.env): TurnstileConfig {
  const site = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const secret = env.TURNSTILE_SECRET_KEY ?? "";
  if (!site && !secret) return null;
  if (!site || !secret) return "partial";
  return { siteKey: site, secret };
}

export async function verifyTurnstile(
  token: string,
  secret: string,
  hostname: string,
  fetchFn: typeof fetch = fetch,
  timeoutMs = 8000
): Promise<{ ok: boolean; reason?: string }> {
  if (!token || token.length > TURNSTILE_TOKEN_MAX) {
    return { ok: false, reason: "token" };
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetchFn(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }).toString(),
        signal: ctrl.signal,
      }
    );
    if (!res.ok) return { ok: false, reason: "unreachable" };
    const data = (await res.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
    };
    if (data.success !== true) return { ok: false, reason: "verification-failed" };
    if (data.hostname !== hostname) return { ok: false, reason: "hostname" };
    if (data.action !== "contact") return { ok: false, reason: "action" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "unreachable" };
  } finally {
    clearTimeout(t);
  }
}
