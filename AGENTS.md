# AGENTS.md — Lamdix site

## Commands (Bun only — never npm/npx/node)

- Install: `bun install --frozen-lockfile`
- Dev: `bun run dev` · Build: `bun run build` · Typecheck: `bun run typecheck` · Tests: `bun test`
- Browser checks: `bun run test:browser` (full smoke, `TEST_BASE_URL` override) · `bun scripts/regression.ts` (focused visual/no-JS regressions); screenshots land in gitignored `artifacts/`
- Note: the shared bun cache has a root-owned corrupt entry; if
  `@swc/helpers` fails to copy, install with
  `BUN_INSTALL_CACHE_DIR=$PWD/.bun-cache bun install`.

## Design system

- Dark ink `#0b1114`, warm white `#f4f1ea`, teal `#26c9bb`; CSS tokens in `app/globals.css`.
- Fonts: Syne (display 600/700) + Manrope (body 400/500/600) via `next/font/google`.
- Server components by default; client islands: `Header`, `LambdaSculpture`,
  `SystemPanel`, `ContactForm`. All meaningful text renders without JS.
- Icons: Lineicons Solid exports only (`@lineiconshq/react-lineicons` +
  `@lineiconshq/free-icons`), named tree-shaken imports. No emoji icons.
- Hero sculpture (`components/LambdaSculpture.tsx`) is a conceptual system
  graphic — it is NOT client work or portfolio evidence.

## Content rules

- No fabricated metrics, testimonials, client logos, or portfolio pieces.
- Articles are original editorial content; service pages state honest scope
  constraints. Keep it that way.

## Contact form security (`app/api/contact/route.ts`, `lib/contact.ts`)

- Same-origin check (request origin must match request URL or `SITE_URL`);
  missing Origin is rejected — browsers always send it on POST.
- 16 KB streamed body cap; Zod validation; honeypot; per-process rate limit
  (5/15 min); optional Turnstile (fail closed on partial config); nodemailer
  server-side only; visitor never controls From/To; secrets from env only.

## Research & reference links (used for design decisions)

- instrument.com — brand/product/marketing narrative structure
- basicagency.com — oversized editorial hierarchy, work-led rhythm
- apple.com/accessibility & developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/ — reduced-motion handling
- fonts.google.com/specimen/Syne, fonts.google.com/specimen/Manrope — type pairing
- lineicons.com/docs/installation, lineicons.com/license — free Solid exports (verified, 361 icons in @lineiconshq/free-icons 1.0.7)
- developers.google.com/search/docs/essentials/spam-policies — no hidden/SEO-spam pages; all insights publicly linked
- developers.google.com/search/docs/fundamentals/creating-helpful-content — article quality bar
- developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls — canonical URLs
- llmstxt.org — llms.txt proposal (not a ranking signal)
- vercel.com/docs/functions/runtimes/bun — Bun on Vercel (`vercel.json bunVersion`)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
