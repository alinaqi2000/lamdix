import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const OUT = "artifacts";
const results: string[] = [];
const ok = (name: string, cond: boolean, extra = "") =>
  results.push(`${cond ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`);

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

// ---------- system tabs: exactly one visible panel per state ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const expected = ["The product layer", "The applied AI layer", "The customer operations layer"];
  for (let i = 0; i < 3; i++) {
    await page.locator('[role="tab"]').nth(i).click();
    await page.waitForTimeout(800);
    const vis = await page.evaluate(() => {
      const vp = document.querySelector(".sys-panels")!.getBoundingClientRect();
      const panels = [...document.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
      return panels.map((p) => {
        const r = p.getBoundingClientRect();
        return {
          inert: p.hasAttribute("inert"),
          ariaHidden: p.getAttribute("aria-hidden") === "true",
          insideVp: r.left >= vp.left - 1 && r.right <= vp.right + 1,
          heading: p.querySelector("h3")?.textContent ?? "",
        };
      });
    });
    const active = vis.filter((p) => !p.inert);
    ok(`tab ${i}: one active panel in viewport, correct heading`,
      active.length === 1 &&
      active[0].insideVp && !active[0].ariaHidden &&
      active[0].heading === expected[i] &&
      vis.filter((p) => p.inert && p.ariaHidden && !p.insideVp).length === 2,
      JSON.stringify(vis));
  }
  await page.screenshot({ path: `${OUT}/desktop-system.png` });
  await page.close();
}

// ---------- h1 accessible text has a space ----------
{
  const page = await browser.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  const text = (await page.locator("h1").textContent())?.replace(/\s+/g, " ").trim();
  ok("h1 reads 'Build beyond the expected.'", text === "Build beyond the expected.", `h1="${text}"`);
  await page.close();
}

// ---------- no-JS: filled form submit does not navigate/expose data ----------
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + "/contact", { waitUntil: "domcontentloaded" });
  const attrs = await page.evaluate(() => {
    const f = document.querySelector("form");
    return {
      method: f?.getAttribute("method"),
      action: f?.getAttribute("action"),
      disabled: document.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled,
      noscript: document.querySelector("noscript") !== null,
    };
  });
  ok("form method=post action=/api/contact, submit disabled pre-hydration",
    attrs.method === "post" && attrs.action === "/api/contact" && attrs.disabled === true,
    JSON.stringify(attrs));
  ok("noscript email fallback present", attrs.noscript);
  // fill fields via DOM (no JS) then attempt to activate disabled button
  await page.locator("#f-name").fill("PII Name");
  await page.locator("#f-email").fill("pii@example.com");
  await page.locator('button[type="submit"]').click({ force: true }).catch(() => {});
  await page.waitForTimeout(500);
  const url = page.url();
  ok("no-JS submit attempt does not navigate or leak query string",
    url === `${BASE}/contact` || url === BASE + "/contact/",
    `url=${url}`);
  await ctx.close();
}

// ---------- refreshed screenshots ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/desktop-full.png`, fullPage: true });
  await page.close();
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mob.goto(BASE, { waitUntil: "networkidle" });
  await mob.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  await mob.waitForTimeout(800);
  await mob.screenshot({ path: `${OUT}/mobile-full.png`, fullPage: true });
  await mob.close();
}

// ---------- SSR HTML: no hidden Reveal markup ----------
{
  const page = await browser.newPage();
  for (const r of ["/", "/about", "/process", "/services", "/industries", "/contact"]) {
    const res = await page.request.get(BASE + r);
    const html = await res.text();
    const count = (html.match(/opacity:\s*0/g) || []).length;
    ok(`SSR no opacity:0 ${r}`, count === 0, `count=${count}`);
  }
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const pj = await ctx.newPage();
  await pj.goto(BASE + "/process", { waitUntil: "domcontentloaded" });
  const vis = await pj.evaluate(() => {
    const el = [...document.querySelectorAll("*")].find((e) => e.textContent?.trim() === "Discover" && /^H[23]$/.test(e.tagName));
    return el ? getComputedStyle(el).opacity : "missing";
  });
  ok("no-JS process steps visible", vis === "1", `opacity=${vis}`);
  await ctx.close();
  await page.close();
}

await browser.close();
console.log(results.join("\n"));
const fails = results.filter((r) => r.startsWith("FAIL"));
console.log(`\n${results.length - fails.length} pass, ${fails.length} fail`);
process.exit(fails.length ? 1 : 0);
