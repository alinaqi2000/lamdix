import { site } from "@/lib/site";
import { articles } from "@/lib/articles";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = articles
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${site.url}/insights/${a.slug}</link>
      <guid isPermaLink="true">${site.url}/insights/${a.slug}</guid>
      <pubDate>${new Date(a.date + "T00:00:00Z").toUTCString()}</pubDate>
      <description>${esc(a.description)}</description>
    </item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Lamdix Insights</title>
    <link>${site.url}/insights</link>
    <atom:link href="${site.url}/insights/feed.xml" rel="self" type="application/rss+xml" />
    <description>Notes from the Lamdix practice — software, applied AI, and customer operations.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
