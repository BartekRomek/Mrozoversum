export type SeriesId = "Chylka" | "Forst" | "Langer" | "Behawiorysta" | "Zaorski";

export type RelationType = "cameo" | "wzmianka" | "crossover";

export type Book = {
  id: string;
  title: string;
  series: SeriesId;
  cover: string;
  description: string;
  certainty: number;
  order: number;
  timeline?: number;
  year?: number;
};

export type BookConnection = {
  source: string;
  target: string;
  type: RelationType;
  certainty: number;
  note?: string;
  importance?: "standard" | "major" | "finale";
};

export type BookNodeData = {
  book: Book;
  isDimmed: boolean;
  isSelected: boolean;
};
