"use client";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { clsx } from "clsx";
import { ShieldCheck } from "lucide-react";
import { seriesColors, seriesLabels } from "@/lib/catalog";
import type { BookNodeData } from "@/lib/types";

export function BookNode({ data }: NodeProps) {
  const nodeData = data as BookNodeData;
  const { book, isDimmed, isSelected } = nodeData;

  return (
    <article
      className={clsx(
        "group w-[154px] overflow-hidden border bg-[#11131a]/95 shadow-2xl transition duration-200 relative",
        isSelected
          ? "border-rose-400 shadow-rose-950/60"
          : "border-white/10 shadow-black/50",
        isDimmed && "opacity-25 grayscale"
      )}
      style={{
        borderRadius: 8,
        background: `linear-gradient(180deg, ${seriesColors[book.series]}26, rgba(17, 19, 26, 0.98) 34%)`,
        boxShadow: isSelected
          ? `0 0 0 2px ${seriesColors[book.series]}99, 0 22px 70px rgba(0,0,0,.58)`
          : `0 18px 48px rgba(0,0,0,.48), 0 0 24px ${seriesColors[book.series]}24`
      }}
    >
      {/* Uchwyty docelowe (przyjmujące strzałki) - z lewej i z góry */}
      <Handle type="target" position={Position.Left} id="target-left" />
      <Handle type="target" position={Position.Top} id="target-top" />

      <div className="relative h-[214px] bg-[#171923]">
        <img
          src={book.cover}
          alt={`Okładka: ${book.title}`}
          className="h-full w-full object-cover opacity-85"
        />
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ backgroundColor: seriesColors[book.series] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/28 to-transparent" />
        <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
          <span
            className="h-2.5 w-2.5"
            style={{
              backgroundColor: seriesColors[book.series],
              boxShadow: `0 0 18px ${seriesColors[book.series]}`
            }}
          />
          <span className="rounded-sm bg-black/55 px-1.5 py-0.5 font-mono text-[10px] text-white/70">
            {book.year ?? "----"}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">
            {seriesLabels[book.series]}
          </p>
          <h3 className="mt-1 text-lg font-semibold leading-tight text-white">
            {book.title}
          </h3>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-3 py-2 text-xs text-white/58">
        <span>#{book.order}</span>
        <span className="flex items-center gap-1">
          <ShieldCheck size={13} />
          {book.certainty}%
        </span>
      </div>

      {/* Uchwyty źródłowe (wypuszczające strzałki) - z prawej i z dołu */}
      <Handle type="source" position={Position.Right} id="source-right" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" />
    </article>
  );
}