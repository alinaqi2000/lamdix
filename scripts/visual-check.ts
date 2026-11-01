import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const OUT = "artifacts/review";
const results: string[] = [];
const ok = (name: string, cond: boolean, extra = "") =>
  results.push(`${cond ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`);

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const _newPage = browser.newPage.bind(browser);
(browser as any).newPage = async (a?: any) => { const p = await _newPage(a); p.setDefaultTimeout(120000); return p; };
const _newContext = browser.newContext.bind(browser);
(browser as any).newContext = async (a?: any) => {
  const c = await _newContext(a);
  const _np = c.newPage.bind(c);
  (c as any).newPage = async () => { const p = await _np(); p.setDefaultTimeout(120000); return p; };
  return c;
};
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
await page.addStyleTag({ content: ".sculpt-frame canvas{visibility:hidden!important}" });
await page.waitForTimeout(1500);

// ---------- header shots ----------
await page.screenshot({ path: `${OUT}/header-top-1440.png`, clip: { x: 0, y: 0, width: 1440, height: 120 } });
await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/header-scrolled-1440.png`, clip: { x: 0, y: 0, width: 1440, height: 120 } });
await page.evaluate(() => window.scrollTo(0, 0));

// ---------- mega menu: open, screenshots, hover persistence, alignment ----------
const trigger = page.locator(".mega-trigger");
const tbox = (await trigger.boundingBox())!;
await page.mouse.move(tbox.x + tbox.width / 2, tbox.y + tbox.height / 2);
const opened = await page.locator(".mega-hover").waitFor({ state: "attached", timeout: 3000 }).then(() => true).catch(() => false);
ok("mega opens on hover", opened);
await page.waitForTimeout(350);
await page.screenshot({ path: `${OUT}/mega-open-1440.png`, clip: { x: 0, y: 0, width: 1440, height: 640 } });

// move from trigger to 6th mega item in ~10 steps
const item6 = page.locator(".mega-item").nth(5);
const ibox = (await item6.boundingBox())!;
const steps = 10;
for (let i = 1; i <= steps; i++) {
  await page.mouse.move(
    tbox.x + tbox.width / 2 + ((ibox.x + 30 - (tbox.x + tbox.width / 2)) * i) / steps,
    tbox.y + tbox.height / 2 + ((ibox.y + ibox.height / 2 - (tbox.y + tbox.height / 2)) * i) / steps
  );
  await page.waitForTimeout(30);
}
await page.waitForTimeout(250);
ok("pointer path trigger→item6 keeps panel open", await page.locator(".mega-hover").isVisible());

// alignment: all 6 items equal heights; icon left-x equal per column
const metrics = await page.evaluate(() => {
  const items = [...document.querySelectorAll<HTMLElement>(".mega-item")];
  return items.map((el) => {
    const r = el.getBoundingClientRect();
    const icn = el.querySelector(".icn")!.getBoundingClientRect();
    const title = el.querySelector("b")!.getBoundingClientRect();
    return { x: r.x, y: r.y, h: r.height, iconX: icn.x, titleX: title.x };
  });
});
const heights = new Set(metrics.map((m) => Math.round(m.h)));
const cols = [...new Set(metrics.map((m) => Math.round(m.x)))];
const perColOk = cols.every((cx) =>
  new Set(metrics.filter((m) => Math.round(m.x) === cx).map((m) => Math.round(m.iconX))).size === 1 &&
  new Set(metrics.filter((m) => Math.round(m.x) === cx).map((m) => Math.round(m.titleX))).size === 1);
ok("6 mega items equal height", heights.size === 1, `heights=${[...heights].join(",")}`);
ok("icon/title x aligned per column", perColOk, `cols=${cols.length}`);

// no truncation: title/description not clipped
const trunc = await page.evaluate(() =>
  [...document.querySelectorAll<HTMLElement>(".mega-item b, .mega-item .mi-txt > span")]
    .filter((el) => el.scrollWidth > el.clientWidth + 1).length);
ok("no mega title/desc truncation", trunc === 0, `truncated=${trunc}`);

// leaving closes after delay
await page.mouse.move(ibox.x + ibox.width / 2, 10);
await page.waitForTimeout(80);
ok("mega still open during grace", await page.locator(".mega-hover").isVisible());
const closed = await page.locator(".mega-hover").waitFor({ state: "detached", timeout: 2000 }).then(() => true).catch(() => false);
ok("mega closes after hover-out delay", closed);

// mega at 1024
await page.setViewportSize({ width: 1024, height: 800 });
await page.waitForTimeout(400);
const tb2 = (await trigger.boundingBox())!;
await page.mouse.move(tb2.x + tb2.width / 2, tb2.y + tb2.height / 2);
await page.locator(".mega-hover").waitFor({ state: "attached", timeout: 3000 }).catch(() => {});
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/mega-open-1024.png`, clip: { x: 0, y: 0, width: 1024, height: 640 } });
await page.mouse.move(10, 700);
await page.waitForTimeout(500);

// ---------- system panel tabs ----------
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(400);
await page.evaluate(() => document.querySelector(".system-panel")?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(700);
const tabIds = ["software", "intelligence", "operations"];
for (let i = 0; i < 3; i++) {
  await page.locator('[role="tab"]').nth(i).click();
  await page.waitForTimeout(600);
  const r = await page.locator(".system-panel").boundingBox();
  await page.screenshot({ path: `${OUT}/model-tab-${tabIds[i]}-1440.png`, clip: { x: Math.max(0, r!.x), y: Math.max(0, r!.y), width: Math.min(1440, r!.width), height: Math.min(900, r!.height) } });
}
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
await page.evaluate(() => document.querySelector(".system-panel")?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(600);
await page.locator(".system-panel").screenshot({ path: `${OUT}/model-tab-390.png` });
await page.setViewportSize({ width: 360, height: 780 });
await page.waitForTimeout(500);
await page.locator(".system-panel").screenshot({ path: `${OUT}/model-tab-360.png` });

// tabs must not overflow their track at narrow widths
for (const w of [360, 390]) {
  await page.setViewportSize({ width: w, height: 800 });
  await page.waitForTimeout(400);
  const tf = await page.evaluate(() => {
    const track = document.querySelector(".system-tabs")!.getBoundingClientRect();
    const over = [...document.querySelectorAll<HTMLElement>('[role="tab"]')].map((t) => {
      const r = t.getBoundingClientRect();
      return r.right - track.right;
    });
    const trackClip = (document.querySelector(".system-tabs") as HTMLElement).scrollWidth - track.width;
    return { maxOver: Math.max(...over), trackClip };
  });
  ok(`tabs fit track @${w}`, tf.maxOver <= 1 && tf.trackClip <= 1, JSON.stringify(tf));
}

// ---------- cta band ----------
await page.setViewportSize({ width: 1440, height: 900 });
await page.evaluate(() => document.querySelector(".cta-band")?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(600);
await page.locator(".cta-band").screenshot({ path: `${OUT}/cta-band-1440.png` });

// ---------- footer word fit + footer shots ----------
async function footerCheck(width: number, height: number) {
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelector(".footer-word-wrap")?.scrollIntoView({ block: "end" }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/footer-${width}.png` });
  const fit = await page.evaluate(() => {
    const wrap = document.querySelector<HTMLElement>(".footer-word-wrap")!;
    const word = document.querySelector<HTMLElement>(".footer-word")!;
    const wr = wrap.getBoundingClientRect();
    const fs = parseFloat(getComputedStyle(word).fontSize);
    const lsEm = parseFloat(getComputedStyle(word).letterSpacing) / fs;
    const c = document.createElement("canvas");
    c.width = Math.ceil(fs * 4); c.height = Math.ceil(fs * 1.5);
    const x = c.getContext("2d")!;
    x.font = `700 ${fs}px Outfit, "Outfit Fallback", sans-serif`;
    x.letterSpacing = `${lsEm * fs}px`;
    x.fillStyle = "#fff";
    x.fillText("Lamdix", 0, fs);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let minX = 1e9, maxX = -1;
    for (let yy = 0; yy < c.height; yy++)
      for (let xx = 0; xx < c.width; xx++)
        if (d[(yy * c.width + xx) * 4 + 3] > 30) { if (xx < minX) minX = xx; if (xx > maxX) maxX = xx; }
    const wordRect = word.getBoundingClientRect();
    const inkLeft = wordRect.left + minX;
    const inkRight = wordRect.left + maxX + 1;
    return {
      wrapL: wr.left, wrapR: wr.right, wrapW: wr.width,
      inkLeft, inkRight, inkW: inkRight - inkLeft,
      fs, ratio: (maxX + 1 - minX) / fs,
      docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  ok(`footer word ink vs wrap @${width}`,
    Math.abs(fit.inkLeft - fit.wrapL) <= 0.01 * fit.wrapW &&
    Math.abs(fit.inkRight - fit.wrapR) <= 0.015 * fit.wrapW,
    `inkW=${fit.inkW.toFixed(1)} wrapW=${fit.wrapW.toFixed(1)} dL=${(fit.inkLeft - fit.wrapL).toFixed(1)} dR=${(fit.inkRight - fit.wrapR).toFixed(1)} R=${fit.ratio.toFixed(4)}`);
  ok(`no horizontal overflow @${width}`, fit.docOverflow <= 0, `overflow=${fit.docOverflow}`);
}
await footerCheck(1440, 900);
await footerCheck(1024, 800);
await footerCheck(390, 844);
await footerCheck(768, 900);
await footerCheck(360, 780);

// ---------- header ::before backdrop-filter ----------
await page.setViewportSize({ width: 1440, height: 900 });
const bf = await page.evaluate(() => {
  const el = document.querySelector(".header-pill")!;
  const s = getComputedStyle(el, "::before");
  return { bf: s.backdropFilter, webkit: (s as any).webkitBackdropFilter };
});
ok("header pill ::before backdrop-filter", (bf.bf && bf.bf !== "none") || (bf.webkit && bf.webkit !== "none"), JSON.stringify(bf));

// ---------- mobile header ----------
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/header-top-390.png`, clip: { x: 0, y: 0, width: 390, height: 110 } });

// ---------- full page ----------
await page.setViewportSize({ width: 1440, height: 900 });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/home-full-1440.png`, fullPage: true, timeout: 120000 });

// ---------- logo zoom ----------
await page.evaluate(() => document.querySelector(".site-header")?.scrollIntoView());
await page.locator(".header-pill .wordmark-wrap").screenshot({ path: `${OUT}/logo-zoom.png` });

// ---------- system panel: autoplay / pause / stop / swipe ----------
const activeIdx = (p: import("playwright").Page) =>
  p.evaluate(() => [...document.querySelectorAll('[role="tab"]')]
    .findIndex((t) => t.getAttribute("aria-selected") === "true"));
const scrollToPanel = async (p: import("playwright").Page) => {
  await p.evaluate(() => document.querySelector(".system-panel")?.scrollIntoView({ block: "center" }));
  await p.waitForTimeout(1400);
};

{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE, { waitUntil: "networkidle" });
  await scrollToPanel(p);
  const a0 = await activeIdx(p);
  await p.waitForTimeout(5600);
  const a1 = await activeIdx(p);
  await p.waitForTimeout(5600);
  const a2 = await activeIdx(p);
  ok("autoplay advances 01→02→03 every ~5s", a0 === 0 && a1 === 1 && a2 === 2, `${a0}→${a1}→${a2}`);
  await p.close();
}
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE, { waitUntil: "networkidle" });
  await scrollToPanel(p);
  const box = (await p.locator(".system-panel").boundingBox())!;
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const t0 = await activeIdx(p);
  await p.waitForTimeout(7000);
  const t1 = await activeIdx(p);
  await p.mouse.move(box.x + box.width / 2, 60);
  await p.waitForTimeout(5800);
  const t2 = await activeIdx(p);
  ok("hover pauses autoplay, leave resumes", t1 === t0 && t2 === (t0 + 1) % 3, `${t0},${t1},${t2}`);
  await p.close();
}
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE, { waitUntil: "networkidle" });
  await scrollToPanel(p);
  await p.locator('[role="tab"]').nth(1).click();
  await p.waitForTimeout(7000);
  const idx = await activeIdx(p);
  const bar = await p.locator(".sys-progress").count();
  ok("user click stops autoplay + removes progress bar", idx === 1 && bar === 0, `idx=${idx} bar=${bar}`);
  await p.close();
}
{
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const p = await mctx.newPage();
  const cdp = await mctx.newCDPSession(p);
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.addStyleTag({ content: ".sculpt-frame canvas{visibility:hidden!important}" });
  await scrollToPanel(p);
  const box = (await p.locator(".system-main").boundingBox())!;
  const sx = box.x + box.width * 0.75, sy = box.y + box.height * 0.55;
  const touch = async (type: "touchStart" | "touchMove" | "touchEnd", pts: { x: number; y: number }[]) =>
    cdp.send("Input.dispatchTouchEvent", { type, touchPoints: pts });
  const swipe = async (dxFrac: number, midShot = false) => {
    await touch("touchStart", [{ x: sx, y: sy }]);
    for (let i = 1; i <= 10; i++) {
      await touch("touchMove", [{ x: sx + dxFrac * box.width * (i / 10), y: sy }]);
      await p.waitForTimeout(16);
      if (midShot && i === 5) {
        const bothVisible = await p.evaluate(() => {
          const vp = document.querySelector(".sys-panels")!.getBoundingClientRect();
          return [...document.querySelectorAll<HTMLElement>('[role="tabpanel"]')]
            .filter((el) => { const r = el.getBoundingClientRect(); return r.right > vp.left + 10 && r.left < vp.right - 10; }).length;
        });
        await p.screenshot({ path: `${OUT}/model-swipe-mid-390.png`, clip: { x: 0, y: Math.max(0, box.y - 40), width: 390, height: Math.min(844, box.height + 80) } });
        ok("mid-drag: two panels visible in viewport (slides)", bothVisible === 2, `visible=${bothVisible}`);
      }
    }
    await touch("touchEnd", []);
    await p.waitForTimeout(800);
  };
  await swipe(-0.6);
  const s1 = await activeIdx(p);
  ok("touch left swipe 60% → next tab", s1 === 1, `idx=${s1}`);
  await swipe(0.6);
  const s2 = await activeIdx(p);
  ok("touch right swipe 60% → previous tab", s2 === 0, `idx=${s2}`);
  await swipe(-0.1, true);
  const s3 = await activeIdx(p);
  ok("short 10% swipe snaps back", s3 === 0, `idx=${s3}`);
  // mostly vertical swipe → unchanged
  await touch("touchStart", [{ x: sx, y: sy }]);
  for (let i = 1; i <= 10; i++) {
    await touch("touchMove", [{ x: sx - 2 * i, y: sy - 20 * i }]);
    await p.waitForTimeout(16);
  }
  await touch("touchEnd", []);
  await p.waitForTimeout(600);
  const s4 = await activeIdx(p);
  ok("vertical swipe leaves tab unchanged", s4 === 0, `idx=${s4}`);
  await mctx.close();
}
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE, { waitUntil: "networkidle" });
  await scrollToPanel(p);
  const box = (await p.locator(".system-main").boundingBox())!;
  const sx = box.x + box.width * 0.75, sy = box.y + box.height * 0.55;
  await p.mouse.move(sx, sy);
  await p.mouse.down();
  for (let i = 1; i <= 10; i++) { await p.mouse.move(sx - 0.6 * box.width * (i / 10), sy); await p.waitForTimeout(16); }
  await p.mouse.up();
  await p.waitForTimeout(800);
  const d = await activeIdx(p);
  ok("mouse drag left → next tab", d === 1, `idx=${d}`);
  await p.close();
}
{
  const rctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await rctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });
  await scrollToPanel(p);
  await p.waitForTimeout(6200);
  const ri = await activeIdx(p);
  ok("reduced motion: no autoplay", ri === 0, `idx=${ri}`);
  await rctx.close();
}

// ---------- hero 3d ----------
const shotCanvas = async (p: import("playwright").Page, path: string) => {
  const data = await p.locator(".sculpt-frame canvas").first().evaluate(
    (c) => (c as HTMLCanvasElement).toDataURL("image/png")
  );
  const buf = Buffer.from(data.replace(/^data:image\/png;base64,/, ""), "base64");
  await writeFile(path, buf);
  return buf;
};
{
  const gl = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"] });
  const p = await gl.newPage({ viewport: { width: 1440, height: 900 } });
  p.setDefaultTimeout(120000);
  const webgl = await p.evaluate(() => {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  });
  ok("WebGL context available (required for hero tests)", webgl);
  if (!webgl) throw new Error("No WebGL — hero checks cannot run");
  await p.goto(`${BASE}/?glcapture=1`, { waitUntil: "domcontentloaded" });
  const frame = p.locator(".sculpt-frame[data-frameloop]");
  ok("hero canvas mounted", await p.locator(".sculpt-frame canvas").waitFor({ timeout: 25000 }).then(() => true).catch(() => false));
  await p.waitForTimeout(600);
  await shotCanvas(p, `${OUT}/hero-intro-mid.png`);
  await p.waitForTimeout(2800);
  const idleBuf = await shotCanvas(p, `${OUT}/hero-idle.png`);
  const fb = (await frame.boundingBox())!;
  await p.mouse.move(fb.x + fb.width * 0.75, fb.y + fb.height * 0.45);
  await p.waitForTimeout(900);
  await shotCanvas(p, `${OUT}/hero-hover.png`);
  await p.mouse.move(fb.x + fb.width * 0.6, fb.y + fb.height * 0.5);
  await p.mouse.down();
  for (let i = 1; i <= 6; i++) { await p.mouse.move(fb.x + fb.width * 0.6 - 32 * i, fb.y + fb.height * 0.5); await p.waitForTimeout(18); }
  await shotCanvas(p, `${OUT}/hero-drag.png`);
  await p.mouse.up();
  await p.waitForTimeout(1600);
  await p.mouse.click(fb.x + fb.width * 0.5, fb.y + fb.height * 0.5);
  await p.waitForTimeout(350);
  const splitBuf = await shotCanvas(p, `${OUT}/hero-split-mid.png`);
  const diff = await p.evaluate(async ([da, db]) => {
    const load = (d: string) => new Promise<HTMLImageElement>((res) => { const i = new Image(); i.onload = () => res(i); i.src = d; });
    const [ia, ib] = await Promise.all([load(da), load(db)]);
    const c = document.createElement("canvas");
    c.width = ia.width; c.height = ia.height;
    const x = c.getContext("2d")!;
    x.drawImage(ia, 0, 0); const A = x.getImageData(0, 0, c.width, c.height).data;
    x.clearRect(0, 0, c.width, c.height); x.drawImage(ib, 0, 0); const B = x.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 0; i < A.length; i += 16) if (Math.abs(A[i] - B[i]) > 24) n++;
    return n;
  }, [`data:image/png;base64,${idleBuf.toString("base64")}`, `data:image/png;base64,${splitBuf.toString("base64")}`]);
  ok("click split visibly changes canvas", diff > 400, `diffPx=${diff}`);
  const fl1 = await frame.getAttribute("data-frameloop");
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
  await p.waitForTimeout(800);
  const fl2 = await frame.getAttribute("data-frameloop");
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(800);
  const fl3 = await frame.getAttribute("data-frameloop");
  ok("frameloop pauses offscreen / resumes", fl1 === "always" && fl2 === "never" && fl3 === "always", `${fl1},${fl2},${fl3}`);
  await p.close();
  await gl.close();
}
{
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const p = await mctx.newPage();
  const cdp = await mctx.newCDPSession(p);
  await p.goto(`${BASE}/?glcapture=1`, { waitUntil: "networkidle" });
  await p.waitForTimeout(1800);
  await p.locator(".sculpt-frame canvas").waitFor({ timeout: 25000 }).catch(() => {});
  await shotCanvas(p, `${OUT}/hero-390.png`);
  const fb = (await p.locator(".sculpt-frame[data-frameloop]").boundingBox())!;
  const sx = fb.x + fb.width / 2, sy = fb.y + fb.height * 0.6;
  const y0 = await p.evaluate(() => window.scrollY);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: sx, y: sy }] });
  for (let i = 1; i <= 8; i++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: sx, y: sy - 60 * i }] });
    await p.waitForTimeout(20);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await p.waitForTimeout(600);
  const y1 = await p.evaluate(() => window.scrollY);
  ok("vertical touch swipe on frame scrolls page", y1 > y0 + 50, `scrollY ${y0}→${y1}`);
  await mctx.close();
}
// ---------- system panel: progress bar agrees with timer on resume ----------
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE, { waitUntil: "networkidle" });
  await scrollToPanel(p);
  const box = (await p.locator(".system-panel").boundingBox())!;
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await p.waitForTimeout(2000);
  const oldBar = await p.evaluate(() => { const b = document.querySelector(".sys-progress"); (window as any).__bar = b; return !!b; });
  await p.mouse.move(box.x + box.width / 2, 60);
  const tLeave = Date.now();
  await p.waitForTimeout(300);
  const newBar = await p.evaluate(() => document.querySelector(".sys-progress") !== (window as any).__bar);
  const deadline = Date.now() + 7000;
  let idx = await activeIdx(p), elapsed = -1;
  while (Date.now() < deadline) {
    idx = await activeIdx(p);
    if (idx !== 0) { elapsed = (Date.now() - tLeave) / 1000; break; }
    await p.waitForTimeout(100);
  }
  ok("bar restarts from 0 on resume and tab advances ~5s after leave",
    oldBar && newBar && idx === 1 && elapsed > 4.5 && elapsed < 5.6,
    `oldBar=${oldBar} restarted=${newBar} idx=${idx} t=${elapsed.toFixed(2)}s`);
  await p.close();
}

await browser.close();
console.log(results.join("\n"));
const fails = results.filter((r) => r.startsWith("FAIL"));
console.log(`\n${results.length - fails.length} pass, ${fails.length} fail`);
process.exit(fails.length ? 1 : 0);
