import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { industries } from "@/lib/industries";
import { articles } from "@/lib/articles";

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description} Contact: ${site.email} — ${site.url}`,
    "",
    "## Services",
    "",
    ...services.map((s) => `- [${s.title}](${site.url}/services/${s.slug}): ${s.short.split("—")[0].trim()}`),
    "",
    "## Industries",
    "",
    ...industries.map((i) => `- [${i.title}](${site.url}/industries/${i.slug}): ${i.short}`),
    "",
    "## Insights",
    "",
    ...articles.map((a) => `- [${a.title}](${site.url}/insights/${a.slug}): ${a.description}`),
    "",
    "## Company",
    "",
    `- [About](${site.url}/about): Who Lamdix is and how the integrated model works`,
    `- [Process](${site.url}/process): Discover, Design, Engineer, Evolve — the engagement arc`,
    `- [Contact](${site.url}/contact): Start a project or reach the team`,
    `- [Privacy](${site.url}/privacy): Data handling for site visitors and inquiries`,
    "",
    "## Optional",
    "",
    `- [Full content](${site.url}/llms-full.txt): Complete site content for LLM consumption`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
