import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mrozoversum.pl",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: "https://mrozoversum.pl/postaw-kawe",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: "https://mrozoversum.pl/ustawienia",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2
    },
    {
      url: "https://mrozoversum.pl/zglos-blad",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3
    }
  ];
}