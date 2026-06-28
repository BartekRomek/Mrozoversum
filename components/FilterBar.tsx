"use client";

import { Search, SlidersHorizontal } from "lucide-react";
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

const relationTypes: RelationType[] = ["kontynuacja", "wzmianka", "crossover", "epizod"];

export function FilterBar({
  query,
  selectedSeries,
  selectedRelations,
  onQueryChange,
  onSeriesToggle,
  onRelationToggle,
  onReset
}: FilterBarProps) {
  return (
    <section className="flex flex-col gap-3 border-b border-white/10 bg-[#090a0f]/92 px-4 py-3 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative block w-full lg:max-w-[360px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            size={18}
          />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Szukaj książki, serii lub opisu"
            className="h-10 w-full border border-white/10 bg-white/[0.045] pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-rose-400/70"
            style={{ borderRadius: 8 }}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {seriesOrder.map((series) => {
            const isActive = selectedSeries.includes(series);

            return (
              <button
                key={series}
                type="button"
                onClick={() => onSeriesToggle(series)}
                className={clsx(
                  "flex h-9 items-center gap-2 border px-3 text-xs font-medium transition",
                  isActive
                    ? "border-white/22 bg-white/12 text-white"
                    : "border-white/10 bg-white/[0.035] text-white/55 hover:text-white"
                )}
                style={{ borderRadius: 8 }}
              >
                <span
                  className="h-2 w-2"
                  style={{ backgroundColor: seriesColors[series] }}
                />
                {seriesLabels[series]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal size={18} className="hidden text-white/35 sm:block" />
        {relationTypes.map((relation) => {
          const isActive = selectedRelations.includes(relation);

          return (
            <button
              key={relation}
              type="button"
              onClick={() => onRelationToggle(relation)}
              className={clsx(
                "h-9 border px-3 text-xs font-medium transition",
                isActive
                  ? "border-rose-300/40 bg-rose-500/16 text-rose-100"
                  : "border-white/10 bg-white/[0.035] text-white/50 hover:text-white"
              )}
              style={{ borderRadius: 8 }}
            >
              {relationLabels[relation]}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onReset}
          className="h-9 border border-white/10 bg-transparent px-3 text-xs font-medium text-white/55 transition hover:border-white/20 hover:text-white"
          style={{ borderRadius: 8 }}
        >
          reset
        </button>
      </div>
    </section>
  );
}