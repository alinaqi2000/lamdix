import type { Metadata } from "next";
import { site } from "./site";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  articleDate?: string
): Metadata {
  const url = new URL(path, site.url).toString();
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: articleDate ? "article" : "website",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "Lamdix — Software & AI Agency",
        },
      ],
      ...(articleDate
        ? { publishedTime: articleDate, modifiedTime: articleDate }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}
