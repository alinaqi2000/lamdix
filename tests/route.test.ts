import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";
import { resetRateLimits } from "@/lib/contact";

// Mock nodemailer before importing the route.
const sendMail = mock(async (_opts: Record<string, unknown>) => ({ accepted: ["contact@lamdix.com"] }));
mock.module("nodemailer", () => ({
  default: { createTransport: () => ({ sendMail, close: () => {} }) },
}));

const { POST, GET } = await import("@/app/api/contact/route");

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "",
  service: "ai-agents-and-chatbots",
  budget: "",
  message: "We want a support chatbot grounded in our docs.",
  consent: "yes",
  website: "",
};

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const ENV_KEYS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_TO"];
const savedEnv = { ...process.env };
afterEach(() => {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
});

describe("POST /api/contact", () => {
  beforeEach(() => {
    resetRateLimits();
    sendMail.mockClear();
    process.env.SMTP_PASS = "test-pass";
    process.env.SMTP_HOST = "mail.spacemail.com";
    process.env.SMTP_PORT = "465";
    process.env.SMTP_USER = "contact@lamdix.com";
    process.env.MAIL_TO = "contact@lamdix.com";
  });

  test("accepts valid submission and calls sendMail with safe fields", async () => {
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.ok).toBe(true);
    expect(sendMail).toHaveBeenCalledTimes(1);
    const mail = sendMail.mock.calls[0][0] as Record<string, string>;
    expect(mail.to).toBe("contact@lamdix.com");
    expect(mail.from).toBe("contact@lamdix.com");
    expect(mail.replyTo).toBe("ada@example.com");
    expect(mail.subject).not.toMatch(/[\r\n]/);
  });

  test("rejects invalid fields with per-field errors", async () => {
    const res = await POST(req({ ...valid, email: "bad", message: "short" }));
    expect(res.status).toBe(400);
    const j = await res.json();
    expect(j.errors.email).toBeTruthy();
    expect(j.errors.message).toBeTruthy();
    expect(sendMail).not.toHaveBeenCalled();
  });

  test("honeypot returns fake success without sending", async () => {
    const res = await POST(req({ ...valid, website: "spammy.com" }));
    expect(res.status).toBe(200);
    expect(sendMail).not.toHaveBeenCalled();
  });

  test("rejects foreign origin", async () => {
    const res = await POST(req(valid, { origin: "https://evil.example" }));
    expect(res.status).toBe(403);
  });

  test("returns 503 with honest fallback when SMTP unconfigured", async () => {
    process.env.SMTP_PASS = "";
    const res = await POST(req(valid));
    expect(res.status).toBe(503);
    const j = await res.json();
    expect(j.message).toContain("contact@lamdix.com");
    expect(sendMail).not.toHaveBeenCalled();
  });

  test("returns 502 when SMTP rejects all recipients", async () => {
    sendMail.mockImplementationOnce(async () => ({ accepted: [] as string[] }));
    const res = await POST(req(valid));
    expect(res.status).toBe(502);
  });

  test("returns 502 on transport error without leaking details or false claims", async () => {
    sendMail.mockImplementationOnce(async () => {
      throw new Error("535 auth failed password=secret");
    });
    const res = await POST(req(valid));
    expect(res.status).toBe(502);
    const j = await res.json();
    expect(j.message).not.toContain("secret");
    expect(j.message).not.toContain("not sent");
    expect(j.message).toContain("could not confirm delivery");
  });
  test("GET responds 405 with Allow: POST", async () => {
    const res = GET();
    expect(res.status).toBe(405);
    expect(res.headers.get("allow")).toBe("POST");
  });
  test("oversized body returns 413, malformed JSON returns 400", async () => {
    const big = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
      body: "x".repeat(17 * 1024),
    });
    expect((await POST(big)).status).toBe(413);
    const res = await POST(req("not json{"));
    expect(res.status).toBe(400);
  });
  test("responses are no-store", async () => {
    const res = await POST(req(valid));
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  test("rate limits after 5 attempts per key", async () => {
    for (let i = 0; i < 5; i++) {
      const r = await POST(req(valid));
      expect([200, 502]).toContain(r.status);
    }
    const res = await POST(req(valid));
    expect(res.status).toBe(429);
  });
});
