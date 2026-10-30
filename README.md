# Lamdix website

Marketing site for Lamdix — independent software & AI agency.
Next.js (App Router, TypeScript) + CSS design tokens + framer-motion islands.
**Bun only** — no npm/npx/node.

## Develop

```sh
bun install --frozen-lockfile
bun run dev        # http://localhost:3000
```

## Verify

```sh
bun run typecheck  # tsc --noEmit
bun test           # unit + API route tests (no email is sent in tests)
bun run build      # production build via `bun --bun next build`
```

## Environment

Copy `.env.example` → `.env.local` and fill values. Never commit a real password.

| Var | Purpose |
| --- | --- |
| `SMTP_HOST` / `SMTP_PORT` | Mail server (default `mail.spacemail.com` / `465` secure; `587` uses requireTLS) |
| `SMTP_USER` | Authenticated mailbox — also the From address (`contact@lamdix.com`) |
| `SMTP_PASS` | Mailbox password. **Server-side only; never logged or sent to the client.** |
| `MAIL_TO` | Fixed recipient (`contact@lamdix.com`) |
| `SITE_URL` | Canonical origin (`https://lamdix.com`) — used for origin checks & SEO |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Optional Turnstile; both or neither — partial config fails closed |

If SMTP is unconfigured the API returns a clear 503 with the direct-email
fallback — it never fakes success.

## Vercel

- **Root Directory must be `web`** (the app lives in a subdirectory of the
  repo, alongside the source logo). Deployment will not work if the project
  targets the repository root.
- `vercel.json` sets `framework: "nextjs"`, `"bunVersion": "1.x"`,
  `installCommand: "bun install --frozen-lockfile"`,
  `buildCommand: "bun run build"`.
- Set the env vars above in the project settings. Rotate `SMTP_PASS` if it is
  ever exposed, and confirm mailbox deliverability (SPF/DKIM/DMARC) with the
  provider before relying on the form. Do a live send test only after deploy,
  with the user's approval.
- Preview deployments are `noindex` (`VERCEL_ENV === "preview"` adds an
  `X-Robots-Tag` header and disables indexing in metadata).
- Rate limiting in `app/api/contact/route.ts` is best-effort per process
  (serverless memory is not shared) — enable Vercel WAF rate limiting for
  production-grade protection.

## Structure

- `app/` — routes: `/`, `/services`, `/services/[slug]`, `/insights`, `/insights/[slug]`, `/privacy`, `/api/contact`, sitemap/robots/manifest, 404
- `components/` — header/footer, lambda sculpture, system tabs, contact form
- `lib/` — site config, service & article content, contact validation/security
- `public/` — favicons, manifest icons, `og.png`, `llms.txt`
- `tests/` — Bun tests for contact validation and the API route
- `AGENTS.md` — persistent project notes & design research links

## After deploy — search & AI discovery

- Add `lamdix.com` in Google Search Console and Bing Webmaster Tools (Bing powers ChatGPT/Copilot search).
- Set `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` env vars in Vercel.
- Submit `/sitemap.xml` in both consoles.
- Redirect `www.lamdix.com` → `lamdix.com` in Vercel Domains.
- Verify `/llms.txt`, `/llms-full.txt`, and `/insights/feed.xml` return correctly.
