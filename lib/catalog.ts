import type { RelationType, SeriesId } from "@/lib/types";

export const seriesLabels: Record<SeriesId, string> = {
  Chylka: "Chyłka",
  Forst: "Forst",
  Langer: "Langer",
};

export const seriesOrder: SeriesId[] = [
  "Chylka",
  "Forst",
  "Langer",
];

export const seriesColors: Record<SeriesId, string> = {
  Chylka: "#ff7300",
  Forst: "#38bdf8",
  Langer: "#ff0000",
};

export const relationLabels: Record<RelationType, string> = {
  cameo: "cameo",
  wzmianka: "wzmianka",
  crossover: "crossover"
};

export const relationColors: Record<RelationType, string> = {
  cameo: "#22ff00",
  wzmianka: "#fbff00",
  crossover: "#ff0000"
};
