import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { serviceExtras } from "@/lib/serviceExtras";
import { industries } from "@/lib/industries";
import { articles } from "@/lib/articles";
import { phases, processFaq } from "@/lib/process";

export const dynamic = "force-static";

export function GET() {
  const out: string[] = [
    `# ${site.name} — full content`,
    "",
    `> ${site.description} Contact: ${site.email} — ${site.url}`,
    "",
  ];
  for (const s of services) {
    const ex = serviceExtras[s.slug];
    out.push(`## ${s.title}`, `Canonical: ${site.url}/services/${s.slug}`, "", s.short, "");
    s.intro.forEach((p) => out.push(p, ""));
    if (ex) {
      out.push("### What we build", ...ex.features.map((f) => `- ${f.title}: ${f.body}`), "");
      out.push("### Process", ...ex.process.map((p, i) => `${i + 1}. ${p.title} — ${p.body}`), "");
      out.push("### FAQ", ...ex.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`), "");
    }
    out.push("### Deliverables", ...s.deliverables.map((d) => `- ${d}`), "");
    out.push("### Scope & constraints", ...s.scope.map((x) => `- ${x}`), "");
  }
  out.push("## Industries", "");
  for (const i of industries) {
    out.push(`### ${i.title}`, `Canonical: ${site.url}/industries/${i.slug}`, "", i.short, "");
    i.intro.forEach((p) => out.push(p, ""));
    out.push("Challenges:", ...i.challenges.map((c) => `- ${c.title}: ${c.body}`), "");
    out.push("What we would build:", ...i.build.map((b) => `- ${b.title}: ${b.body}`), "");
    out.push("Considerations:", ...i.considerations.map((c) => `- ${c}`), "");
  }
  out.push("## Process", `Canonical: ${site.url}/process`, "");
  for (const p of phases) {
    out.push(`### ${p.n} — ${p.t}`, p.p, "");
    out.push("What happens:", ...p.happen.map((h) => `- ${h.t}: ${h.p}`), "");
    out.push("What you get:", ...p.get.map((g) => `- ${g}`), "");
    out.push(`Your involvement: ${p.involve}`, `Decision gate: ${p.gate}`, "");
  }
  out.push("### Process FAQ", ...processFaq.map((f) => `Q: ${f.q}\nA: ${f.a}`), "");
  out.push("## Insights", "");
  for (const a of articles) {
    out.push(`### ${a.title}`, `Canonical: ${site.url}/insights/${a.slug}`, `Published: ${a.date}`, "", a.description, "");
    a.intro.forEach((p) => out.push(p, ""));
    for (const sec of a.sections) {
      out.push(`#### ${sec.heading}`, "");
      sec.paragraphs?.forEach((p) => out.push(p, ""));
      sec.checklist?.forEach((c) => out.push(`- ${c}`));
      out.push("");
    }
  }
  return new Response(out.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
