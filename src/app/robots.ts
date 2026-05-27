import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibeinvite.bzwl.club";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/", "/invitation/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
