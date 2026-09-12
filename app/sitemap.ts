import type { MetadataRoute } from "next";
import books from "@/data/books.json";
import characters from "@/data/characters.json";
import { seriesOrder } from "@/lib/catalog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages: MetadataRoute.Sitemap = [
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
    ...seriesOrder.map((series) => ({ url: `https://mrozoversum.pl/serie/${series.toLowerCase()}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...books.filter((book) => !book.id.includes("-axis-")).map((book) => ({ url: `https://mrozoversum.pl/ksiazki/${book.id}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...characters.map((character) => ({ url: `https://mrozoversum.pl/postacie/${character.id}`, changeFrequency: "monthly" as const, priority: 0.5 }))
  ];
  return publicPages;
}
