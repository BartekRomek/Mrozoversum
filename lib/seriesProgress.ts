import type { Book, SeriesId } from "@/lib/types";
import { seriesLabels, seriesOrder, seriesColors } from "@/lib/catalog";
import type { BookStatus } from "@/lib/supabase/books";

export type SeriesLevel = "started" | "bronze" | "silver" | "gold" | "platinum";
export type SeriesProgress = {
  series: SeriesId;
  label: string;
  readCount: number;
  totalCount: number;
  percentage: number;
  level: SeriesLevel;
  levelLabel: string;
  color: string;
  iconPath?: string;
};

const seriesIcons: Partial<Record<SeriesId, string>> = {
  Chylka: "/icons/chylka.svg",
  Forst: "/icons/forst.svg",
  Langer: "/icons/langer.svg",
  Wladza: "/icons/wladza.svg",
  Zaorski: "/icons/zaorski.svg"
};

export const levelRank: Record<SeriesLevel, number> = { started: 0, bronze: 1, silver: 2, gold: 3, platinum: 4 };

function isRealBook(book: Book) {
  // Axis nodes are layout-only markers. They belong to a series in the map
  // data, but must not inflate the public book count or progress percentage.
  return !book.id.includes("-axis-");
}

function getLevel(percentage: number): SeriesLevel {
  if (percentage >= 100) return "platinum";
  if (percentage >= 75) return "gold";
  if (percentage >= 50) return "silver";
  if (percentage >= 25) return "bronze";
  return "started";
}

function getLevelLabel(level: SeriesLevel) {
  return { started: "Rozpoczęta", bronze: "Odkrywca", silver: "Znawca", gold: "Ekspert", platinum: "Mistrz" }[level];
}

function getLevelColor(level: SeriesLevel, series: SeriesId) {
  return { started: seriesColors[series], bronze: "#a8663f", silver: "#b9c1cc", gold: "#d5a928", platinum: "#b21f3b" }[level];
}

export function getSeriesProgressForSeries(books: Book[], statuses: Record<string, BookStatus>, series: SeriesId): SeriesProgress {
  const seriesBooks = books.filter((book) => book.series === series && isRealBook(book));
  const readCount = seriesBooks.filter((book) => statuses[book.id]?.isRead).length;
  const totalCount = seriesBooks.length;
  const percentage = totalCount ? Math.round((readCount / totalCount) * 100) : 0;
  const level = getLevel(percentage);
  return { series, label: seriesLabels[series], readCount, totalCount, percentage, level, levelLabel: getLevelLabel(level), color: getLevelColor(level, series), iconPath: seriesIcons[series] };
}

export function getSeriesProgress(books: Book[], statuses: Record<string, BookStatus>) {
  return seriesOrder.map((series) => getSeriesProgressForSeries(books, statuses, series));
}
