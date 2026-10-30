import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/lib/site";
import {
  contactSchema,
  readBoundedBody,
  isTrustedOrigin,
  rateLimit,
  clientKey,
  getSmtpConfig,
  getTurnstileConfig,
  verifyTurnstile,
  escapeHtml,
  headerSafe,
} from "@/lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  // Same-origin only. Browsers always send Origin on cross-origin POSTs and on
  // same-origin fetch POSTs; a missing Origin is rejected by design (documented).
  if (!isTrustedOrigin(req, site.url)) {
    return json({ ok: false, message: "Invalid request origin." }, 403);
  }

  if (!rateLimit(clientKey(req))) {
    return json(
      { ok: false, message: "Too many attempts. Please wait a few minutes or email us directly at " + site.email + "." },
      429
    );
  }

  const body = await readBoundedBody(req);
  if (!body.ok) {
    return json(
      { ok: false, message: body.status === 413 ? "Request too large." : "Malformed request." },
      body.status
    );
  }

  let raw: unknown;
  try {
    raw = JSON.parse(body.text);
  } catch {
    return json({ ok: false, message: "Malformed request." }, 400);
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return json(
      { ok: false, message: "Please check the highlighted fields.", errors },
      400
    );
  }

  const data = parsed.data;

  // Honeypot: pretend success, never send.
  if (data.website) {
    return json({ ok: true, message: "Message received." }, 200);
  }

  // Turnstile (only if configured; partial config fails closed).
  const ts = getTurnstileConfig();
  if (ts === "partial") {
    return json(
      { ok: false, message: "Contact form is temporarily unavailable. Email us at " + site.email + "." },
      503
    );
  }
  if (ts) {
    const result = await verifyTurnstile(
      data.turnstileToken ?? "",
      ts.secret,
      new URL(site.url).hostname
    );
    if (!result.ok) {
      return json(
        { ok: false, message: "Verification failed. Please try again or email " + site.email + "." },
        400
      );
    }
  }

  const smtp = getSmtpConfig();
  if (!smtp) {
    return json(
      {
        ok: false,
        message:
          "Our mail service isn't configured yet. Please email us directly at " + site.email + ".",
      },
      503
    );
  }

  const transporter = nodemailer.createTransport(
    {
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      requireTLS: smtp.requireTLS,
      auth: { user: smtp.user, pass: smtp.pass },
      tls: { minVersion: "TLSv1.2" },
      connectionTimeout: 10000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
    },
    { from: smtp.user }
  );

  const subject = headerSafe(`Project inquiry — ${data.service} — ${data.name}`);
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${data.company || "—"}`,
    `Service: ${data.service}`,
    `Budget: ${data.budget || "—"}`,
    "",
    data.message,
  ].join("\n");
  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>`,
    `<p><strong>Company:</strong> ${escapeHtml(data.company || "—")}</p>`,
    `<p><strong>Service:</strong> ${escapeHtml(data.service)}</p>`,
    `<p><strong>Budget:</strong> ${escapeHtml(data.budget || "—")}</p>`,
    `<hr/>`,
    `<p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>`,
  ].join("");

  try {
    const info = await transporter.sendMail({
      from: smtp.user, // authenticated mailbox only — never visitor-controlled
      to: smtp.mailTo, // fixed recipient — never visitor-controlled
      replyTo: headerSafe(data.email),
      subject,
      text,
      html,
    });
    const accepted = (info.accepted ?? []) as unknown[];
    if (!accepted.length) {
      return json(
        {
          ok: false,
          message:
            "The mail server did not accept the message. Please email us directly at " + site.email + ".",
        },
        502
      );
    }
    return json(
      {
        ok: true,
        message:
          "Your message was accepted by our mail server. We read every inquiry and reply from " + site.email + ".",
      },
      200
    );
  } catch {
    return json(
      {
        ok: false,
        message:
          "We could not confirm delivery. Please email " + site.email + " directly before retrying.",
      },
      502
    );
  } finally {
    transporter.close();
  }
}

export function GET() {
  return NextResponse.json(
    { ok: false, message: "Method not allowed." },
    { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } }
  );
}
