"use client";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { clsx } from "clsx";
import { ShieldCheck } from "lucide-react";
import { seriesColors, seriesLabels } from "@/lib/catalog";
import type { BookNodeData } from "@/lib/types";

export function BookNode({ data }: NodeProps) {
  const nodeData = data as BookNodeData;
  const { book, isDimmed, isSelected } = nodeData;

  // Logika Liquid Glass:
  // 174px = szerokość karty (154px) + margines w gridzie (20px)
  const hasDuration = book.duration && book.duration > 0;
  const glassWidth = hasDuration ? `${book.duration! * 174}px` : null;
  const color = seriesColors[book.series] || "#ffffff";

  return (
    <div className="relative">
      
      {/* 🧊 EFEKT SZKŁA (Większy panel w kolorze serii) */}
      {hasDuration && (
        <div 
          className="absolute top-1/2 left-1/2 -z-10 h-[260px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border transition-all shadow-2xl"
          style={{ 
            width: glassWidth,
            // Solidny kolor tła (z dużą przezroczystością) całkowicie zakrywa linię pod spodem
            backgroundColor: `${color}15`,
            borderColor: `${color}40`,
            // Dodajemy subtelny blask na krawędziach
            boxShadow: `0 0 20px ${color}05`
          }}
        >
          {/* Gradient dla efektu szklanego panelu */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-20"
            style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
          />
        </div>
      )}

      {/* GŁÓWNA KARTA KSIĄŻKI */}
      <div className="relative w-[154px]">
        
        {/* UCHWYTY DOCELOWE (TARGET) - przyjmujące strzałki (wejście) */}
        <Handle type="target" position={Position.Top} id="target-top" className="!bg-transparent !border-transparent" />
        <Handle type="target" position={Position.Right} id="target-right" className="!bg-transparent !border-transparent" />
        <Handle type="target" position={Position.Bottom} id="target-bottom" className="!bg-transparent !border-transparent" />
        <Handle type="target" position={Position.Left} id="target-left" className="!bg-transparent !border-transparent" />

        {/* UCHWYTY ŹRÓDŁOWE (SOURCE) - wypuszczające strzałki (wyjście) */}
        <Handle type="source" position={Position.Top} id="source-top" className="!bg-transparent !border-transparent" />
        <Handle type="source" position={Position.Right} id="source-right" className="!bg-transparent !border-transparent" />
        <Handle type="source" position={Position.Bottom} id="source-bottom" className="!bg-transparent !border-transparent" />
        <Handle type="source" position={Position.Left} id="source-left" className="!bg-transparent !border-transparent" />

        <article
          className={clsx(
            "group relative h-full w-full overflow-hidden border bg-[#11131a]/95 shadow-2xl transition duration-200",
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
        </article>
      </div>
    </div>
  );
}