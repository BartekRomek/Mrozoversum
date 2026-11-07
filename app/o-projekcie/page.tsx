import type { Metadata } from "next";
import { SupportPage } from "@/components/SupportPage";

export const metadata: Metadata = {
  title: "O projekcie",
  description:
    "Poznaj niezależny projekt Mrozoversum stworzony i prowadzony przez Bartłomieja Romka oraz dowiedz się, jak możesz go wesprzeć.",
  alternates: {
    canonical: "https://mrozoversum.pl/o-projekcie/"
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://mrozoversum.pl/o-projekcie/",
    siteName: "Mrozoversum",
    title: "O projekcie | Mrozoversum",
    description:
      "Poznaj Mrozoversum i jego twórcę oraz wesprzyj rozwój projektu.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Mrozoversum - o projekcie" }]
  }
};

export default function AboutProjectRoute() {
  return <SupportPage showCopyright />;
}
