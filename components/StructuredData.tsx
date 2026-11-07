export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://mrozoversum.pl/#website",
        name: "Mrozoversum",
        alternateName: "Mrozoversum – Interaktywna mapa książek Remigiusza Mroza",
        url: "https://mrozoversum.pl",
        description:
          "Interaktywna mapa chronologii, postaci, serii i powiązań między książkami Remigiusza Mroza.",
        inLanguage: "pl-PL",
        creator: { "@id": "https://mrozoversum.pl/o-projekcie#bartlomiej-romek" },
        publisher: { "@id": "https://mrozoversum.pl/o-projekcie#bartlomiej-romek" }
      },
      {
        "@type": "Person",
        "@id": "https://mrozoversum.pl/o-projekcie#bartlomiej-romek",
        name: "Bartłomiej Romek",
        url: "https://mrozoversum.pl/o-projekcie",
        description: "Twórca i prowadzący niezależny projekt Mrozoversum.",
        owns: { "@id": "https://mrozoversum.pl/#website" }
      }
    ]
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
