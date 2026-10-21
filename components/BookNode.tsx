"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { clsx } from "clsx";
import { ShieldCheck } from "lucide-react";
import { seriesColors, seriesLabels } from "@/lib/catalog";
import type { BookNodeData } from "@/lib/types";
import { assetPath } from "@/lib/assetPath";

export function BookNode({ data }: NodeProps) {
  const nodeData = data as BookNodeData;
  const { book, isDimmed, isSelected } = nodeData;

  const hasDuration = book.duration && book.duration > 0;
  const glassWidth = hasDuration ? `${book.duration! * 245 + 154}px` : null;
  const color = seriesColors[book.series] || "#ffffff";

  return (
    <div className="group relative">
      {hasDuration && (
        <div
          className="absolute inset-y-0 left-0 z-0 h-full cursor-pointer rounded-2xl border shadow-2xl transition duration-300 group-hover:-translate-y-1 group-hover:scale-[1.015] group-hover:!border-white/25"
          style={{
            width: glassWidth || undefined,
            backgroundColor: `${color}${isSelected ? "28" : "18"}`,
            borderColor: isSelected ? "#fb7185" : `${color}2f`,
            boxShadow: isSelected
              ? `0 0 0 2px ${color}66, 0 0 24px ${color}44`
              : `0 0 16px ${color}04`
          }}
        />
      )}

      <div className="relative w-[154px]">
        <Handle type="target" position={Position.Top} id="target-top" isConnectable={false} className="!bg-transparent !border-transparent" />
        <Handle type="target" position={Position.Right} id="target-right" isConnectable={false} className="!bg-transparent !border-transparent" />
        <Handle type="target" position={Position.Bottom} id="target-bottom" isConnectable={false} className="!bg-transparent !border-transparent" />
        <Handle type="target" position={Position.Left} id="target-left" isConnectable={false} className="!bg-transparent !border-transparent" />

        <Handle type="source" position={Position.Top} id="source-top" isConnectable={false} className="!bg-transparent !border-transparent" />
        <Handle type="source" position={Position.Right} id="source-right" isConnectable={false} className="!bg-transparent !border-transparent" />
        <Handle type="source" position={Position.Bottom} id="source-bottom" isConnectable={false} className="!bg-transparent !border-transparent" />
        <Handle type="source" position={Position.Left} id="source-left" isConnectable={false} className="!bg-transparent !border-transparent" />

        <article
          className={clsx(
            "relative z-10 h-full w-full overflow-hidden border bg-[#11131a]/95 shadow-2xl transition duration-300 group-hover:-translate-y-1 group-hover:scale-[1.015] group-hover:border-white/25",
            isSelected
              ? "border-rose-400 shadow-rose-950/60"
              : book.isNew
                ? "border-emerald-400 shadow-emerald-950/60"
              : "border-white/10 shadow-black/50",
            isDimmed && "opacity-25 grayscale"
          )}
          style={{
            borderRadius: 8,
            borderColor: isSelected
              ? "#fb7185"
              : book.isNew
                ? "#34d399"
                : "rgba(255, 255, 255, 0.1)",
            background: `linear-gradient(180deg, ${seriesColors[book.series]}1c, rgba(17, 19, 26, 0.98) 46%)`,
            boxShadow: isSelected
              ? `0 0 0 2px ${seriesColors[book.series]}99, 0 22px 70px rgba(0,0,0,.58), 0 0 24px ${seriesColors[book.series]}44`
              : book.isNew
                ? "0 0 0 2px rgba(52, 211, 153, .8), 0 18px 48px rgba(0,0,0,.48), 0 0 28px rgba(16, 185, 129, .3)"
              : `0 18px 48px rgba(0,0,0,.48), 0 0 24px ${seriesColors[book.series]}24`
          }}
        >
          <div className="relative h-[214px] bg-[#171923]">
            <img
              src={assetPath(book.cover)}
              alt={`Okładka: ${book.title}`}
              className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.035] group-hover:opacity-100"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#08090d] via-[#08090d]/78 to-transparent" />

            <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
              <span className="rounded-sm bg-black/55 px-1.5 py-0.5 font-mono text-[10px] text-white/70">
                {book.year ?? "----"}
              </span>
              {book.isNew && (
                <span className="absolute left-1/2 -translate-x-1/2 rounded-sm border border-emerald-300/70 bg-emerald-400/20 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.35)]">
                  new
                </span>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="rounded-md bg-black/20 p-2 backdrop-blur-[2px]">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                  {seriesLabels[book.series]}
                </p>
                <h3 className="mt-1 text-base font-semibold leading-tight text-white md:text-lg">
                  {book.title}
                </h3>
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-between border-t px-3 py-2 text-xs text-white/58"
            style={{
              borderTopColor: `${seriesColors[book.series]}66`,
              backgroundColor: `${seriesColors[book.series]}33`
            }}
          >
            <span className="font-semibold" style={{ color: seriesColors[book.series] }}>
              #{book.order}
            </span>
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
