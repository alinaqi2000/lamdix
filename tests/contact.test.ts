import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import {
  contactSchema,
  escapeHtml,
  headerSafe,
  readBoundedBody,
  isTrustedOrigin,
  rateLimit,
  resetRateLimits,
  clientKey,
  getSmtpConfig,
  getTurnstileConfig,
  verifyTurnstile,
} from "@/lib/contact";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  service: "custom-software-development",
  budget: "25k-75k",
  message: "We need a custom platform for our logistics operation.",
  consent: "yes",
  website: "",
};

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const ENV_KEYS = [
  "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_TO",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY", "VERCEL", "SITE_URL",
];
const savedEnv = { ...process.env };
afterEach(() => {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
  resetRateLimits();
});

describe("contactSchema", () => {
  test("accepts a valid submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });
  test("rejects missing name / bad email / short message / no consent", () => {
    for (const patch of [
      { name: "" },
      { email: "not-an-email" },
      { email: "" },
      { message: "too short" },
      { consent: undefined },
    ]) {
      expect(contactSchema.safeParse({ ...valid, ...patch }).success).toBe(false);
    }
  });
  test("rejects invalid service enum and oversize fields", () => {
    expect(contactSchema.safeParse({ ...valid, service: "seo" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, name: "x".repeat(101) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(5001) }).success).toBe(false);
  });
});

describe("escaping & header safety", () => {
  test("escapeHtml escapes markup", () => {
    expect(escapeHtml(`<a href="x">&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;"
    );
  });
  test("headerSafe strips CRLF to prevent header injection", () => {
    expect(headerSafe("a\r\nBcc: evil@x.com")).toBe("a Bcc: evil@x.com");
  });
});

describe("readBoundedBody", () => {
  test("reads a normal body", async () => {
    const r = await readBoundedBody(req(valid));
    expect(r.ok).toBe(true);
  });
  test("rejects oversized body with 413 regardless of Content-Length", async () => {
    const big = "x".repeat(17 * 1024);
    const r = await readBoundedBody(req(big), 16 * 1024);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.status).toBe(413);
  });
  test("returns 400 on stream errors instead of throwing", async () => {
    const r = new Request("http://localhost/api/contact", {
      method: "POST",
      body: new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode("{}"));
          c.error(new Error("stream broke"));
        },
      }),
    });
    const res = await readBoundedBody(r);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.status).toBe(400);
  });
});

describe("isTrustedOrigin", () => {
  const env = { SITE_URL: "https://lamdix.com" };
  beforeEach(() => { process.env.SITE_URL = env.SITE_URL; });
  test("accepts same-origin and configured site origin", () => {
    expect(isTrustedOrigin(req(valid, { origin: "http://localhost:3000" }), env.SITE_URL)).toBe(true);
    expect(isTrustedOrigin(req(valid, { origin: "https://lamdix.com" }), env.SITE_URL)).toBe(true);
  });
  test("rejects foreign and missing origin", () => {
    expect(isTrustedOrigin(req(valid, { origin: "https://evil.com" }), env.SITE_URL)).toBe(false);
    expect(isTrustedOrigin(req(valid), env.SITE_URL)).toBe(false);
  });
});

describe("rateLimit", () => {
  beforeEach(() => resetRateLimits());
  test("allows 5 attempts then blocks", () => {
    for (let i = 0; i < 5; i++) expect(rateLimit("1.2.3.4")).toBe(true);
    expect(rateLimit("1.2.3.4")).toBe(false);
  });
  test("resets after the window", () => {
    const now = Date.now();
    for (let i = 0; i < 5; i++) expect(rateLimit("k", now)).toBe(true);
    expect(rateLimit("k", now + 1000)).toBe(false);
    expect(rateLimit("k", now + 16 * 60 * 1000)).toBe(true);
  });
  test("at exact capacity rejects new keys but retains existing buckets; expired cleanup reopens", async () => {
    const { RATE_MAX_KEYS, rateLimit: rl, resetRateLimits: rst } = await import("@/lib/contact");
    rst();
    const now = Date.now();
    rl("keep-me", now);
    for (let i = 0; i < RATE_MAX_KEYS - 1; i++) rl("filler-" + i, now);
    expect(rl("keep-me", now)).toBe(true);
    expect(rl("brand-new-key", now)).toBe(false);
    const later = now + 16 * 60 * 1000;
    expect(rl("fresh-key", later)).toBe(true);
    rst();
  });
});

describe("clientKey", () => {
  test("ignores forwarded-for off Vercel, uses it on Vercel", () => {
    delete process.env.VERCEL;
    const r = req(valid, { "x-forwarded-for": "9.9.9.9" });
    expect(clientKey(r)).toBe("local");
    process.env.VERCEL = "1";
    expect(clientKey(r)).toBe("9.9.9.9");
    delete process.env.VERCEL;
  });
});

describe("getSmtpConfig", () => {
  test("returns null when password missing", () => {
    expect(getSmtpConfig({ ...process.env, SMTP_PASS: "" })).toBeNull();
  });
  test("secure on 465, requireTLS on 587", () => {
    const c465 = getSmtpConfig({ ...process.env, SMTP_PASS: "x", SMTP_PORT: "465" });
    const c587 = getSmtpConfig({ ...process.env, SMTP_PASS: "x", SMTP_PORT: "587" });
    expect(c465?.secure).toBe(true);
    expect(c587?.requireTLS).toBe(true);
  });
  test("rejects unsupported and invalid ports", () => {
    for (const port of ["25", "2525", "abc", "0", "-1"]) {
      expect(
        getSmtpConfig({ ...process.env, SMTP_PASS: "x", SMTP_PORT: port })
      ).toBeNull();
    }
  });
});

describe("turnstile", () => {
  test("fails closed on partial config", () => {
    expect(
      getTurnstileConfig({ ...process.env, NEXT_PUBLIC_TURNSTILE_SITE_KEY: "k", TURNSTILE_SECRET_KEY: "" })
    ).toBe("partial");
    expect(
      getTurnstileConfig({ ...process.env, NEXT_PUBLIC_TURNSTILE_SITE_KEY: "", TURNSTILE_SECRET_KEY: "" })
    ).toBeNull();
  });
  test("verifyTurnstile rejects bad success/hostname/action and oversize token", async () => {
    const okFetch = (async () =>
      new Response(JSON.stringify({ success: true, hostname: "lamdix.com", action: "contact" }))) as unknown as typeof fetch;
    expect((await verifyTurnstile("t", "s", "lamdix.com", okFetch)).ok).toBe(true);
    const badHost = (async () =>
      new Response(JSON.stringify({ success: true, hostname: "evil.com", action: "contact" }))) as unknown as typeof fetch;
    expect((await verifyTurnstile("t", "s", "lamdix.com", badHost)).ok).toBe(false);
    const badAction = (async () =>
      new Response(JSON.stringify({ success: true, hostname: "lamdix.com", action: "login" }))) as unknown as typeof fetch;
    expect((await verifyTurnstile("t", "s", "lamdix.com", badAction)).ok).toBe(false);
    expect((await verifyTurnstile("x".repeat(3000), "s", "lamdix.com", okFetch)).ok).toBe(false);
    const failing = (async () =>
      new Response(JSON.stringify({ success: false }))) as unknown as typeof fetch;
    expect((await verifyTurnstile("t", "s", "lamdix.com", failing)).ok).toBe(false);
  });
  test("verifyTurnstile fails closed on missing hostname/action, non-200, truthy non-true success", async () => {
    const noHost = (async () =>
      new Response(JSON.stringify({ success: true, action: "contact" }))) as unknown as typeof fetch;
    expect((await verifyTurnstile("t", "s", "lamdix.com", noHost)).ok).toBe(false);
    const noAction = (async () =>
      new Response(JSON.stringify({ success: true, hostname: "lamdix.com" }))) as unknown as typeof fetch;
    expect((await verifyTurnstile("t", "s", "lamdix.com", noAction)).ok).toBe(false);
    const not200 = (async () =>
      new Response("{}", { status: 500 })) as unknown as typeof fetch;
    expect((await verifyTurnstile("t", "s", "lamdix.com", not200)).ok).toBe(false);
    const truthy = (async () =>
      new Response(JSON.stringify({ success: 1, hostname: "lamdix.com", action: "contact" }))) as unknown as typeof fetch;
    expect((await verifyTurnstile("t", "s", "lamdix.com", truthy)).ok).toBe(false);
  });
});
