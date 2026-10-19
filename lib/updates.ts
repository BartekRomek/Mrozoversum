export type UpdateEntry = {
  version: string;
  date: string;
  title: string;
  changes: string[];
};

export const updates: UpdateEntry[] = [
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
