import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const OUT = "artifacts";
const results: string[] = [];
const consoleErrors: string[] = [];
const ok = (name: string, cond: boolean, extra = "") =>
  results.push(`${cond ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`);

const ROUTES = [
  "/", "/services",
  "/services/custom-software-development",
  "/services/ai-agents-and-chatbots",
  "/services/voice-ai-and-calling-agents",
  "/services/calling-campaigns",
  "/services/customer-support",
  "/services/cloud-and-product-engineering",
  "/industries",
  "/industries/ecommerce-retail",
  "/industries/healthcare",
  "/industries/fintech",
  "/industries/logistics",
  "/industries/real-estate",
  "/industries/saas-startups",
  "/process",
  "/about",
  "/contact",
  "/insights",
  "/insights/production-ai-agents-checklist",
  "/insights/voice-ai-human-handoff-consent",
  "/insights/custom-software-vs-saas",
  "/insights/connecting-support-to-crm",
  "/privacy",
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

async function newPage(ctxOpts = {}) {
  const page = await browser.newPage(ctxOpts);
  page.on("pageerror", (e) => consoleErrors.push(`pageerror ${page.url()}: ${e.message}`));
  page.on("console", (m) => {
    const t = m.text();
    if (m.type() === "error" && !t.includes("Failed to load resource"))
      consoleErrors.push(`console ${page.url()}: ${t}`);
  });
  return page;
}

// ---------- overflow + h1 at all widths ----------
for (const w of [320, 390, 768, 1440]) {
  for (const r of ROUTES) {
    const page = await newPage({ viewport: { width: w, height: 900 } });
    await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    const h1 = await page.locator("h1").count();
    ok(`no-overflow h1=1 @${w} ${r}`, !overflow && h1 === 1,
      `overflow=${overflow} h1=${h1}`);
    await page.close();
  }
}

// ---------- metadata consistency ----------
{
  const page = await newPage();
  for (const r of ROUTES) {
    await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
    const m = await page.evaluate(() => {
      const q = (s: string) => document.querySelector(s)?.getAttribute("content") ?? "";
      return {
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
        ogUrl: q('meta[property="og:url"]'),
        ogTitle: q('meta[property="og:title"]'),
        ogImg: q('meta[property="og:image"]'),
        twTitle: q('meta[name="twitter:title"]'),
        twImg: q('meta[name="twitter:image"]'),
        h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      };
    });
    const canonOk = m.canonical.replace(/\/$/, "") === `https://lamdix.com${r === "/" ? "" : r}`;
    const ogOk = m.ogUrl === m.canonical && !!m.ogTitle && !!m.ogImg && !!m.twTitle && !!m.twImg;
    ok(`metadata ${r}`, canonOk && ogOk,
      `canon=${m.canonical} ogUrl=${m.ogUrl} ogImg=${!!m.ogImg}`);
  }
  await page.close();
}

// ---------- sitemap ----------
{
  const page = await newPage();
  await page.goto(BASE + "/sitemap.xml");
  const text = await page.evaluate(() => document.body.innerText);
  const urlsOk = ROUTES.every((r) =>
    text.includes(`https://lamdix.com${r === "/" ? "" : r}`));
  ok("sitemap lists all 14 routes", urlsOk);
  ok("sitemap dates 2026", text.includes("2026-"));
  await page.close();
}

// ---------- screenshots (scroll-behavior auto to avoid smooth-scroll races) ----------
{
  const page = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/desktop-hero.png` });
  await page.screenshot({ path: `${OUT}/desktop-full.png`, fullPage: true });
  await page.evaluate(() => document.querySelector("#contact")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/desktop-contact.png` });
  await page.evaluate(() => document.querySelector("#capabilities")?.scrollIntoView());
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/desktop-capabilities.png` });

  const mob = await newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto(BASE, { waitUntil: "networkidle" });
  await mob.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  await mob.waitForTimeout(800);
  await mob.screenshot({ path: `${OUT}/mobile-full.png`, fullPage: true });
  await mob.evaluate(() => document.querySelector("#contact")?.scrollIntoView());
  await mob.waitForTimeout(300);
  await mob.screenshot({ path: `${OUT}/mobile-contact.png` });
  await mob.close();
  await page.close();
}

// ---------- mobile nav ----------
{
  const mob = await newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto(BASE, { waitUntil: "networkidle" });
  await mob.waitForTimeout(700);
  const toggle = mob.locator(".nav-toggle");
  ok("mobile toggle visible", await toggle.isVisible());
  await toggle.click();
  ok("aria-expanded true", (await toggle.getAttribute("aria-expanded")) === "true");
  await mob.screenshot({ path: `${OUT}/mobile-overlay.png` });
  await mob.keyboard.press("Escape");
  ok("Escape closes nav", (await mob.locator(".mobile-overlay").count()) === 0);
  const focused = await mob.evaluate(() => document.activeElement?.className);
  ok("Escape returns focus to toggle", focused === "nav-toggle", `focused=${focused}`);
  await toggle.click();
  await mob.locator(".mobile-overlay a", { hasText: "Insights" }).click();
  await mob.waitForURL("**/insights");
  ok("mobile nav link navigates + closes", mob.url().includes("/insights") &&
    (await mob.locator(".mobile-overlay").count()) === 0);
  await mob.close();
}

// ---------- tabs keyboard ----------
{
  const page = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const tabs = page.locator('[role="tab"]');
  await tabs.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  let heading = await page.locator('[role="tabpanel"]:not([inert]) .system-text h3').textContent();
  ok("ArrowRight selects next tab", heading === "The applied AI layer", `h3="${heading}"`);
  await page.keyboard.press("End");
  heading = await page.locator('[role="tabpanel"]:not([inert]) .system-text h3').textContent();
  ok("End selects last tab", heading === "The customer operations layer", `h3="${heading}"`);
  await page.keyboard.press("Home");
  heading = await page.locator('[role="tabpanel"]:not([inert]) .system-text h3').textContent();
  ok("Home selects first tab", heading === "The product layer", `h3="${heading}"`);
  const panels = await page.locator('[role="tabpanel"]').count();
  const controls = await page.evaluate(() =>
    [...document.querySelectorAll('[role="tab"]')].every((t) =>
      document.getElementById(t.getAttribute("aria-controls") ?? "") !== null));
  ok("3 mounted panels, aria-controls resolve", panels === 3 && controls);
  await page.close();
}

// ---------- form: empty submit does not POST ----------
{
  const page = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  let posted = 0;
  await page.route("**/api/contact", (r) => { posted++; r.continue(); });
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(600);
  ok("empty form does not POST", posted === 0, `posted=${posted}`);
  const errVisible = await page.locator(".field .err").count();
  ok("inline errors shown for empty form", errVisible > 0, `errs=${errVisible}`);
  const active = await page.evaluate(() => (document.activeElement as HTMLElement)?.id);
  ok("focus moved to first invalid field", active === "f-name", `active=${active}`);
  await page.close();
}

// ---------- form: mocked success resets + button disables ----------
{
  const page = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200, contentType: "application/json",
      body: JSON.stringify({ ok: true, message: "Accepted." }),
    }));
  await page.locator("#f-name").fill("Test User");
  await page.locator("#f-email").fill("test@example.com");
  await page.locator("#f-service").selectOption("not-sure");
  await page.locator("#f-message").fill("A sufficiently long test project message.");
  await page.locator("#f-consent").check();
  await page.unroute("**/api/contact");
  await page.route("**/api/contact", async (route) => {
    await new Promise((r) => setTimeout(r, 600));
    route.fulfill({
      status: 200, contentType: "application/json",
      body: JSON.stringify({ ok: true, message: "Accepted." }),
    });
  });
  const btn = page.locator('button[type="submit"]');
  await btn.click();
  const disabledWhileSending = await btn.isDisabled().catch(() => false);
  await page.waitForTimeout(1400);
  const statusText = await page.locator(".form-status .ok").textContent();
  ok("mocked success shows ok", (statusText ?? "").includes("Accepted"), `status="${statusText}"`);
  const nameVal = await page.locator("#f-name").inputValue();
  ok("fields cleared after accepted", nameVal === "", `name="${nameVal}"`);
  ok("submit disabled while sending", disabledWhileSending);
  await page.close();
}

// ---------- form: mocked validation error retains data ----------
{
  const page = await newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 400, contentType: "application/json",
      body: JSON.stringify({ ok: false, message: "Please check the highlighted fields.", errors: { email: "Enter a valid email address" } }),
    }));
  await page.locator("#f-name").fill("Keep Me");
  await page.locator("#f-email").fill("keep@example.com");
  await page.locator("#f-service").selectOption("not-sure");
  await page.locator("#f-message").fill("A sufficiently long test project message.");
  await page.locator("#f-consent").check();
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(800);
  const nameVal = await page.locator("#f-name").inputValue();
  const emailErr = await page.locator("#err-email").textContent();
  ok("server errors retain input + inline field error",
    nameVal === "Keep Me" && (emailErr ?? "").includes("valid email"),
    `name="${nameVal}" err="${emailErr}"`);
  const active = await page.evaluate(() => (document.activeElement as HTMLElement)?.id);
  ok("focus moved to server-flagged field", active === "f-email", `active=${active}`);
  await page.close();
}

// ---------- no-JS ----------
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  const heroText = await page.locator("h1").textContent();
  const emailVisible = await page.locator('a[href="mailto:contact@lamdix.com"]').count();
  const noscript = await page.locator("noscript").count();
  const tabText = await page.locator('[role="tabpanel"]').allTextContents();
  ok("no-JS hero + email reachable",
    (heroText ?? "").includes("Build beyond") && emailVisible >= 1,
    `emailLinks=${emailVisible}`);
  ok("no-JS all tab panels in SSR HTML", tabText.join(" ").includes("applied AI layer") && tabText.length === 3,
    `panels=${tabText.length} noscript=${noscript}`);
  await ctx.close();
}

// ---------- reduced motion ----------
{
  const rm = await newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await rm.goto(BASE, { waitUntil: "networkidle" });
  await rm.waitForTimeout(1200);
  const t1 = await rm.evaluate(() => document.querySelector(".sculpt-frame svg")?.getAttribute("style"));
  await rm.waitForTimeout(1500);
  const t2 = await rm.evaluate(() => document.querySelector(".sculpt-frame svg")?.getAttribute("style"));
  ok("reduced motion stops float", t1 === t2);
  await rm.close();
}

// ---------- 404 ----------
{
  const page = await newPage({ viewport: { width: 1440, height: 900 } });
  const r = await page.goto(BASE + "/nope");
  ok("404 status", r?.status() === 404);
  await page.screenshot({ path: `${OUT}/404.png` });
  await page.close();
}

// ---------- console errors ----------
ok("no console/page errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));

await browser.close();
console.log(results.join("\n"));
const fails = results.filter((r) => r.startsWith("FAIL"));
console.log(`\n${results.length - fails.length} pass, ${fails.length} fail`);
process.exit(fails.length ? 1 : 0);
