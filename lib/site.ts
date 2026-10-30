export const site = {
  name: "Lamdix",
  url: process.env.SITE_URL ?? "https://lamdix.com",
  email: "contact@lamdix.com",
  tagline: "Independent software & AI agency",
  description:
    "Lamdix is an independent software and AI agency. We design and engineer custom software, applied AI systems, and the customer operations that connect them.",
};

export const isPreview = process.env.VERCEL_ENV === "preview";

export const nav = [
  { label: "Services", href: "/services", mega: true },
  { label: "Industries", href: "/industries" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
] as const;
