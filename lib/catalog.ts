import type { RelationType, SeriesId } from "@/lib/types";

export const seriesLabels: Record<SeriesId, string> = {
  Chylka: "Chyłka",
  Forst: "Forst",
  Langer: "Langer",
  Wladza: "W kręgach władzy",
  Behawiorysta: "Behawiorysta",
  Zaorski: "Zaorski"
};

export const seriesOrder: SeriesId[] = [
  "Chylka",
  "Forst",
  "Langer",
  "Wladza",
  "Behawiorysta",
  "Zaorski"
];

export const seriesColors: Record<SeriesId, string> = {
  Chylka: "#ff7300",
  Forst: "#66d5fd",
  Langer: "#ff0000",
  Wladza: "#00ac0e",
  Behawiorysta: "#a855f7", // fioletowy
  Zaorski: "#eab308"       // złoty
};

export const relationLabels: Record<RelationType, string> = {
  wzmianka: "wzmianka",
  crossover: "crossover",
  kontynuacja: "kontynuacja",
  epizod: "epizod",
  zmiana_serii: "zmiana głównej serii",
};

export const relationColors: Record<RelationType, string> = {
  wzmianka: "#fbff00",
  crossover: "#ff0000",
  kontynuacja: "#00ff08",
  epizod: "#00fff2",
  zmiana_serii: "#ff00fb", // różowo-karminowy
};