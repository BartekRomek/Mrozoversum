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
  Forst: "#66d5fd",
  Langer: "#ff0000",
};

export const relationLabels: Record<RelationType, string> = {
  wzmianka: "wzmianka",
  crossover: "crossover",
  kontynuacja: "kontynuacja"
};

export const relationColors: Record<RelationType, string> = {
  wzmianka: "#fbff00",
  crossover: "#ff0000",
  kontynuacja: "#a855f7" // Fioletowy kolor dla kontynuacji (możesz zmienić)
};