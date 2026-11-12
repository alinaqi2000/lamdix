import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome-stable", args: ["--enable-unsafe-swiftshader", "--use-gl=angle", "--use-angle=swiftshader"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on("console", (m) => { if (m.type() !== "log") console.log("[" + m.type() + "]", m.text().slice(0, 2000)); });
p.on("pageerror", (e) => console.log("PAGEERR", e.message.slice(0, 500)));
await p.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);
await b.close();
