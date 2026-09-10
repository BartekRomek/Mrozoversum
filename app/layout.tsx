import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { StructuredData } from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mrozoversum.pl"),

  title: {
    default: "Mrozoversum – Interaktywna mapa książek Remigiusza Mroza",
    template: "%s | Mrozoversum"
  },

  description:
    "Odkrywaj świat książek Remigiusza Mroza. Interaktywna mapa chronologii, postaci, serii i powiązań między książkami.",

  keywords: [
    "Remigiusz Mróz",
    "Mrozoversum",
    "książki Remigiusza Mroza",
    "chronologia książek Remigiusza Mroza",
    "serie Remigiusza Mroza",
    "Joanna Chyłka",
    "Wiktor Forst",
    "mapa książek",
    "powiązania książek",
    "kolejność książek Remigiusza Mroza"
  ],

  authors: [
    {
      name: "Bartek Romek"
    }
  ],

  creator: "Bartek Romek",
  publisher: "Mrozoversum",

  alternates: {
    canonical: "/"
  },

  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://mrozoversum.pl",
    siteName: "Mrozoversum",
    title: "Mrozoversum – Interaktywna mapa książek Remigiusza Mroza",
    description:
      "Odkrywaj chronologię, postacie i powiązania między książkami Remigiusza Mroza.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mrozoversum – interaktywna mapa książek Remigiusza Mroza"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "Mrozoversum – Interaktywna mapa książek Remigiusza Mroza",
    description:
      "Odkrywaj chronologię, postacie i powiązania między książkami Remigiusza Mroza.",
    images: ["/og-image.jpg"]
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StructuredData />
        {children}
        <GoogleAnalytics gaId="G-T19SCFY82Y" />
      </body>
    </html>
  );
}