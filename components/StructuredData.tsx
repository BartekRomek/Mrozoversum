export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mrozoversum",
    alternateName: "Mrozoversum – Interaktywna mapa książek Remigiusza Mroza",
    url: "https://mrozoversum.pl",
    description:
      "Interaktywna mapa chronologii, postaci, serii i powiązań między książkami Remigiusza Mroza.",
    inLanguage: "pl-PL",
    author: {
      "@type": "Person",
      name: "Bartek Romek"
    },
    creator: {
      "@type": "Person",
      name: "Bartek Romek"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}