export type UpdateEntry = {
  version: string;
  date: string;
  title: string;
  changes: string[];
};

export const updates: UpdateEntry[] = [
  {
    version: "1.2.2",
    date: "5 Listopada 2026",
    title: "Porządki i poprawki techniczne",
    changes: [
      "Dodano bezpośrednie adresy URL dla najważniejszych podstron projektu.",
      "Ujednolicono informacje o Mrozoversum i jego twórcy w metadanych oraz na stronie projektu.",
      "Poprawiono dane SEO i dane strukturalne strony.",
      "Naprawiono wyświetlanie ikon serii w albumie bohaterów.",
      "Uproszczono nawigację i usunięto tymczasową funkcję zgłaszania błędów."
    ]
  },
  {
    version: "1.2.1",
    date: "28 Października 2026",
    title: "KONFRONTACJA NADCHODZI",
    changes: ["KONFRONTACJA NADCHODZI"]
  },
  {
    version: "1.2",
    date: "20 Października 2026",
    title: "Rozbudowa mapy i panelu postaci",
    changes: [
      "20 tom Bezprawie dodany do Mrozoversum.",
      "Dodano szczegółowy panel postaci z wersjami postaci, rolami i listą książek, w których występuje.",
      "Dodano możliwość przejścia z panelu postaci bezpośrednio do książki na mapie.",
      "Usprawniono mapę na urządzeniach mobilnych, otwieranie widoku oraz przewijanie panelu postaci.",
      "Dodano obsługę nowych oznaczeń na mapie, rozszerzeń czasu trwania i lepsze dopasowanie połączeń.",
      "Poprawiono wygląd kart książek, kolor serii oraz oznaczenie nowych publikacji."
    ]
  },
  {
    version: "1.1",
    date: "15 Września 2026",
    title: "Wprowadzenie albumu postaci oraz poprawki wizualne oraz działanie na aplikacjach mobilnyc",
    changes: [
      "Dodanie albumu wszytkich postaci z podziałem na serie oraz książki.",
      "Dodanie wyszukiwarki postaci w albumie",
      "Poprawki wizualne poprawiające działanie aplikacji na urządzeniach mobilnych.",
    ]
  },
  {
    version: "1.0",
    date: "10 Września 2026",
    title: "Premiera mrozoversum.pl",
    changes: [
      "Interaktywna mapa książek i powiązań między seriami.",
      "Wyszukiwanie, filtrowanie oraz panel szczegółów książki.",
      "Album postaci i strony poświęcone książkom oraz seriom."
    ]
  }
];

export const currentVersion = updates[0].version;
