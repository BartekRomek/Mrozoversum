"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { clsx } from "clsx";
import {
  relationLabels,
  seriesColors,
  seriesLabels,
  seriesOrder
} from "@/lib/catalog";
import type { RelationType, SeriesId } from "@/lib/types";

type FilterBarProps = {
  query: string;
  selectedSeries: SeriesId[];
  selectedRelations: RelationType[];
  onQueryChange: (value: string) => void;
  onSeriesToggle: (series: SeriesId) => void;
  onRelationToggle: (relation: RelationType) => void;
  onReset: () => void;
};

const relationTypes: RelationType[] = ["kontynuacja", "wzmianka", "crossover", "epizod", "zmiana_serii"];

export function FilterBar({
  query,
  selectedSeries,
  selectedRelations,
  onQueryChange,
  onSeriesToggle,
  onRelationToggle,
  onReset
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Sprawdzamy, czy użytkownik w ogóle ma włączone jakieś filtry
  const isFiltered =
    selectedSeries.length < seriesOrder.length ||
    selectedRelations.length < relationTypes.length ||
    query.length > 0;

  return (
    <div className="relative z-20 border-b border-white/10 bg-[#090a0f]/95 backdrop-blur-xl">
      {/* Główny, wąski pasek wyszukiwania */}
      <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
        <label className="relative flex-1 lg:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            size={16}
          />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Szukaj książki, postaci..."
            className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-rose-400/50 focus:bg-white/[0.05]"
          />
        </label>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "flex h-9 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition",
            isOpen || isFiltered
              ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
              : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white"
          )}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:block">Filtry</span>
          {isFiltered && (
            <span className="ml-1 flex h-2 w-2 rounded-full bg-rose-500" />
          )}
        </button>
      </div>

      {/* Rozwijany panel z przyciskami - pojawia się po kliknięciu */}
      {isOpen && (
        <div className="border-t border-white/5 bg-black/20 px-4 py-4 lg:px-6 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
            
            {/* Filtry Serii */}
            <div className="flex-1">
              <h3 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/40">
                Wybierz Serie
              </h3>
              <div className="flex flex-wrap gap-2">
                {seriesOrder.map((series) => {
                  const isActive = selectedSeries.includes(series);
                  return (
                    <button
                      key={series}
                      type="button"
                      onClick={() => onSeriesToggle(series)}
                      className={clsx(
                        "flex h-8 items-center gap-2 rounded-md border px-3 text-xs font-medium transition",
                        isActive
                          ? "border-white/20 bg-white/10 text-white"
                          : "border-white/5 bg-white/[0.02] text-white/40 hover:text-white/80"
                      )}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: seriesColors[series] }}
                      />
                      {seriesLabels[series]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtry Relacji */}
            <div className="flex-1">
              <h3 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/40">
                Typy połączeń
              </h3>
              <div className="flex flex-wrap gap-2">
                {relationTypes.map((relation) => {
                  const isActive = selectedRelations.includes(relation);
                  return (
                    <button
                      key={relation}
                      type="button"
                      onClick={() => onRelationToggle(relation)}
                      className={clsx(
                        "flex h-8 items-center rounded-md border px-3 text-xs font-medium transition",
                        isActive
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                          : "border-white/5 bg-white/[0.02] text-white/40 hover:text-white/80"
                      )}
                    >
                      {relationLabels[relation]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Opcja Reset */}
            <div className="flex items-end justify-end pt-2 lg:pt-0">
              <button
                onClick={onReset}
                className="flex h-8 items-center gap-2 rounded-md border border-white/10 px-4 text-xs font-medium text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                <RotateCcw size={14} />
                Resetuj wszystko
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}