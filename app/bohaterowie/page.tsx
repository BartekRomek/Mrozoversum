import type { Metadata } from "next";

import { CharacterAlbum } from "@/components/CharacterAlbum";

export const metadata: Metadata = {
  title: "Bohaterowie",
  description:
    "Poznaj bohaterów Mrozoversum i odkrywaj ich role oraz wystąpienia w książkach Remigiusza Mroza.",
  alternates: {
    canonical: "https://mrozoversum.pl/bohaterowie/"
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://mrozoversum.pl/bohaterowie/",
    siteName: "Mrozoversum",
    title: "Bohaterowie | Mrozoversum",
    description:
      "Poznaj bohaterów Mrozoversum i odkrywaj ich role oraz wystąpienia w książkach Remigiusza Mroza."
  }
};

export default function BohaterowiePage() {
  return <CharacterAlbum />;
}
