import { describe, expect, test } from "bun:test";
import { services } from "../lib/services";
import { articles } from "../lib/articles";
import sitemap from "../app/sitemap";

describe("robots", () => {
  test("production allows search + AI bots with sitemap", async () => {
    const { default: robots } = await import("../app/robots");
    const r = robots() as any;
    const json = JSON.stringify(r);
    for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) expect(json).toContain(bot);
    expect(r.rules[1].userAgent.length).toBeGreaterThan(10);
    expect(r.sitemap).toBe("https://lamdix.com/sitemap.xml");
    expect(r.host).toBe("https://lamdix.com");
  });
  test("preview disallows all with no sitemap", async () => {
    process.env.VERCEL_ENV = "preview";
    const { default: robots } = await import(`../app/robots?t=${Date.now()}`);
    const r = robots() as any;
    expect(r.rules[0].disallow).toBe("/");
    expect(r.sitemap).toBeUndefined();
    delete process.env.VERCEL_ENV;
  });
});

describe("discovery feeds", () => {
  test("llms.txt covers sitemap URLs", async () => {
    const { GET } = await import("../app/llms.txt/route");
    const body = await (await GET()).text();
    for (const e of sitemap() as any[]) expect(body).toContain(e.url.replace("https://lamdix.com", "https://lamdix.com"));
  });
  test("llms-full.txt has all titles", async () => {
    const { GET } = await import("../app/llms-full.txt/route");
    const body = await (await GET()).text();
    for (const a of articles) expect(body).toContain(a.title);
    for (const s of services) expect(body).toContain(s.title);
  });
  test("feed.xml has all articles and one channel", async () => {
    const { GET } = await import("../app/insights/feed.xml/route");
    const body = await (await GET()).text();
    for (const a of articles) expect(body).toContain(`/insights/${a.slug}`);
    expect(body.split("<channel>").length).toBe(2);
  });
});
