export type SeriesId = "Chylka" | "Forst" | "Langer" | "Behawiorysta" | "Zaorski";
export type RelationType = "wzmianka" | "crossover" | "kontynuacja";

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

export type Character = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  series: string;
  debut: string;
};

export type BookConnection = {
  source: string;
  target: string;
  type: RelationType;
  certainty: number;
  note?: string;
  importance?: "standard" | "major" | "finale";
  pathType?: "default" | "straight" | "step" | "smoothstep" | "bezier";
  sourceHandle?: string;
  targetHandle?: string;
  characters?: string[]; // Lista ID postaci powiązanych z tym crossoverem
};

export type BookNodeData = {
  book: Book;
  isDimmed: boolean;
  isSelected: boolean;
};