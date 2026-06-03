import type { MetadataRoute } from "next";
import { getAllPosts } from "./blog/data/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibeinvite.bzwl.club";

  const staticPages = [
    { path: "", priority: 1, changeFreq: "weekly" as const },
    { path: "/pricing", priority: 0.9, changeFreq: "monthly" as const },
    { path: "/login", priority: 0.7, changeFreq: "yearly" as const },
    { path: "/contact", priority: 0.6, changeFreq: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/refund", priority: 0.3, changeFreq: "yearly" as const },
    { path: "/blog", priority: 0.8, changeFreq: "weekly" as const },
  ];

  const eventTypes = ["weddings", "galas", "birthdays", "baby-showers", "corporate"];
  const templateStyles = ["modern", "floral", "classic", "dark"];

  const staticEntries = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  const eventEntries = eventTypes.map((type) => ({
    url: `${baseUrl}/events/${type}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const templateEntries = templateStyles.map((style) => ({
    url: `${baseUrl}/templates/${style}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const blogPosts = getAllPosts();
  const blogEntries = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...eventEntries, ...templateEntries, ...blogEntries];
}
