import type { RelationType, SeriesId } from "@/lib/types";

export const seriesLabels: Record<SeriesId, string> = {
  Chylka: "Chyłka",
  Forst: "Forst",
  Langer: "Langer",
  Wladza: "W kręgach władzy",
};

export const seriesOrder: SeriesId[] = [
  "Chylka",
  "Forst",
  "Langer",
  "Wladza",
];

export const seriesColors: Record<SeriesId, string> = {
  Chylka: "#ff7300",
  Forst: "#66d5fd",
  Langer: "#ff0000",
  Wladza: "#00ac0e",
};

export const relationLabels: Record<RelationType, string> = {
  wzmianka: "wzmianka",
  crossover: "crossover",
  kontynuacja: "kontynuacja",
  epizod: "epizod",
};

export const relationColors: Record<RelationType, string> = {
  wzmianka: "#fbff00",
  crossover: "#ff0000",
  kontynuacja: "#00ff08",
  epizod: "#00fff2",
};