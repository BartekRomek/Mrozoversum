import type { Metadata } from "next";
import { SupportPage } from "@/components/SupportPage";

export const metadata: Metadata = {
  title: "Wsparcie projektu",
  description:
    "Wesprzyj rozwój niezależnego projektu Mrozoversum stworzonego i prowadzonego przez Bartłomieja Romka.",
  alternates: {
    canonical: "https://mrozoversum.pl/wsparcie/"
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://mrozoversum.pl/wsparcie/",
    siteName: "Mrozoversum",
    title: "Wsparcie projektu | Mrozoversum",
    description:
      "Wesprzyj rozwój niezależnego projektu Mrozoversum stworzonego i prowadzonego przez Bartłomieja Romka.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Mrozoversum" }]
  }
};

export default function SupportRoute() {
  return <SupportPage />;
}
