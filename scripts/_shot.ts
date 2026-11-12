import { chromium } from "playwright";
import sharp from "sharp";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome-stable", args: ["--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"] });
const mode = process.argv[2];
if (mode === "poster") {
  for (const [w, h, pw, out] of [[1440, 900, 1920, "hero-poster.webp"], [390, 844, 780, "hero-poster-mobile.webp"]] as const) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto("http://localhost:3000/?poster", { waitUntil: "domcontentloaded" });
    await p.locator(".hero-canvas > canvas").waitFor({ timeout: 30000 });
    await p.waitForTimeout(5000);
    await p.addStyleTag({ content: ".hero > :not(.hero-bg), .site-header, .hero-poster, nextjs-portal { visibility: hidden !important } .hero-canvas{opacity:1!important} .lambda3d-canvas{display:none!important}" });
    await p.waitForTimeout(400);
    const r = await sharp(await p.screenshot()).resize({ width: pw }).webp({ quality: 76 }).toFile(`public/images/${out}`);
    console.log(out, r.size);
    await p.close();
  }
} else {
  for (const [w, h, name] of [[390, 844, "m"], [768, 1024, "t"], [1440, 900, "d"], [1920, 1080, "w"]] as const) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await p.locator(".hero-canvas > canvas").waitFor({ timeout: 30000 });
    await p.waitForTimeout(5000);
    await p.screenshot({ path: `/tmp/hero-${name}.png` });
    await p.close();
  }
}
await b.close();
