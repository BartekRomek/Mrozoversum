import type { RelationType, SeriesId } from "@/lib/types";

export const seriesLabels: Record<SeriesId, string> = {
  Chylka: "Chyłka",
  Forst: "Forst",
  Langer: "Langer",
  Behawiorysta: "Behawiorysta",
  Zaorski: "Zaorski"
};

export const seriesOrder: SeriesId[] = [
  "Chylka",
  "Forst",
  "Langer",
  "Behawiorysta",
  "Zaorski"
];

export const seriesColors: Record<SeriesId, string> = {
  Chylka: "#e11d48",
  Forst: "#38bdf8",
  Langer: "#f59e0b",
  Behawiorysta: "#a78bfa",
  Zaorski: "#22c55e"
};

export const relationLabels: Record<RelationType, string> = {
  cameo: "cameo",
  wzmianka: "wzmianka",
  crossover: "crossover"
};

export const relationColors: Record<RelationType, string> = {
  cameo: "#f59e0b",
  wzmianka: "#94a3b8",
  crossover: "#e11d48"
};
