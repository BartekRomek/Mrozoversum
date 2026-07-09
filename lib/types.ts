export type SeriesId = "Chylka" | "Forst" | "Langer" | "Wladza" | "Behawiorysta" | "Zaorski";
export type RelationType = "wzmianka" | "crossover" | "kontynuacja" | "epizod";

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
  duration?: number; 
  volume?: string | number; 
  genre?: string;           
};

export type Character = {
  id: string;
  name: string;
  role: string;
  hiddenRole?: string;      
  isAntagonist?: boolean;   // Zostawiamy, jeśli definiujesz to czasem globalnie
  pseudonym?: string;       
  avatar: string;
  hiddenAvatar?: string;
  description: string;
  series: string;
  debut: string;
};

// ... (BookConnection i BookNodeData pozostają bez zmian)

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
  characters?: string[]; 
};

export type BookNodeData = {
  book: Book;
  isDimmed: boolean;
  isSelected: boolean;
};