import type { Metadata } from "next";

export const siteUrl = "https://mrozoversum.pl";

export function entityMetadata({
  title,
  description,
  path,
  imageAlt
}: {
  title: string;
  description: string;
  path: string;
  imageAlt: string;
}): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url,
      siteName: "Mrozoversum",
      title: `${title} | Mrozoversum`,
      description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: imageAlt }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Mrozoversum`,
      description,
      images: ["/og-image.jpg"]
    }
  };
}
