import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibeinvite.bzwl.club";

  const staticPages = [
    { path: "", priority: 1, changeFreq: "weekly" as const },
    { path: "/pricing", priority: 0.9, changeFreq: "monthly" as const },
    { path: "/login", priority: 0.7, changeFreq: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/refund", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/contact", priority: 0.5, changeFreq: "yearly" as const },
  ];

  return staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));
}
