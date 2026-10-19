export type UpdateEntry = {
  version: string;
  date: string;
  title: string;
  changes: string[];
};

export const updates: UpdateEntry[] = [
  {
    version: "0.1.0",
    date: "20 października 2026",
    title: "Pierwsze wydanie Mrozoversum",
    changes: [
      "Interaktywna mapa książek i powiązań między seriami.",
      "Wyszukiwanie, filtrowanie oraz panel szczegółów książki.",
      "Album postaci i strony poświęcone książkom oraz seriom."
    ]
  }
];

export const currentVersion = updates[0].version;
