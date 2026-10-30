import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { articles } from "@/lib/articles";
import { site } from "@/lib/site";
import { industries } from "@/lib/industries";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-10-29");
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...services.map((s) => ({
      url: `${site.url}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${site.url}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...industries.map((i) => ({
      url: `${site.url}/industries/${i.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${site.url}/process`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/insights`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...articles.map((a) => ({
      url: `${site.url}/insights/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
