"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { clsx } from "clsx";
import { Check, ShieldCheck } from "lucide-react";
import { seriesColors, seriesLabels } from "@/lib/catalog";
import type { BookNodeData } from "@/lib/types";
import { assetPath } from "@/lib/assetPath";
import { formatKonfrontacjaCountdown, getKonfrontacjaCountdown } from "@/lib/konfrontacja";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";

export function BookNode({ data }: NodeProps) {
  const nodeData = data as BookNodeData;
  const { book, isDimmed, isSelected } = nodeData;

  const hasDuration = book.duration && book.duration > 0;
  const glassWidth = hasDuration ? `${book.duration! * 245 + 154}px` : null;
  const color = seriesColors[book.series] || "#ffffff";
  const isVideo = book.mediaType === "video";
  const isCrossSeries = book.spanAllAxes === true;
  const footerColor = isCrossSeries ? "#ffffff" : color;
  const [countdown, setCountdown] = useState(0);
  const { user, bookStatuses, updateBookStatus } = useSupabaseAuth();
  const isRead = bookStatuses[book.id]?.isRead === true;

  const toggleRead = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) return;

    const currentStatus = bookStatuses[book.id] ?? { isFavorite: false, isRead: false };
    try {
      await updateBookStatus(book.id, { ...currentStatus, isRead: !currentStatus.isRead });
    } catch {
      // The details panel remains the place for any future save-error messaging.
    }
  };

  useEffect(() => {
    if (!isCrossSeries) return;

    const updateCountdown = () => setCountdown(getKonfrontacjaCountdown());
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, [isCrossSeries]);

  return (
    <div className="group relative">
      {isCrossSeries && countdown > 0 && (
        <div className="absolute -top-32 left-1/2 z-30 flex min-w-[520px] -translate-x-1/2 flex-col items-center rounded-3xl border-4 border-red-700/90 bg-[#12080a]/[.98] px-10 py-6 text-center shadow-[0_0_44px_rgba(127,29,29,0.72)] backdrop-blur-xl">
          <p className="font-mono text-base font-bold uppercase tracking-[0.3em] text-red-200/90">
            Premiera za
          </p>
          <p className="mt-2 whitespace-nowrap font-mono text-4xl font-black tracking-[0.12em] text-red-50">
            {formatKonfrontacjaCountdown(countdown)}
          </p>
        </div>
      )}
      {hasDuration && (
        <div
          className="absolute inset-y-0 left-0 z-0 h-full cursor-pointer rounded-2xl border shadow-2xl"
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

      <div className={isCrossSeries ? "relative h-[1460px] w-[930px]" : "relative w-[154px]"}>
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
            "relative z-10 overflow-hidden border bg-[#11131a]/95 shadow-2xl",
            isCrossSeries ? "flex h-full w-full flex-col" : "h-full w-full",
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
          <div className={clsx("relative bg-[#171923]", isCrossSeries ? "min-h-0 flex-1" : "h-[214px]")}>
            {isVideo ? (
              <video
                src={assetPath(book.cover)}
                aria-label={`Okładka: ${book.title}`}
                className="h-full w-full object-cover opacity-90"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onLoadedMetadata={(event) => {
                  event.currentTarget.playbackRate = 0.75;
                }}
              />
            ) : (
              <img
                src={assetPath(book.cover)}
                alt={`Okładka: ${book.title}`}
                className="h-full w-full object-cover opacity-90"
              />
            )}

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
                {!book.hideSeriesLabel && (
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                    {seriesLabels[book.series]}
                  </p>
                )}
                <h3 className="mt-1 text-base font-semibold leading-tight text-white md:text-lg">
                  {book.title}
                </h3>
              </div>
            </div>
          </div>

          <div
            className={clsx(
              "relative z-20 flex shrink-0 items-center justify-between border-t px-3 py-2 text-xs text-white/58"
            )}
            style={{
              borderTopColor: `${footerColor}66`,
              backgroundColor: `${footerColor}24`
            }}
          >
            <span className="font-semibold" style={{ color: footerColor }}>
              #{book.order}
            </span>
            <button
              type="button"
              disabled={!user}
              title={user ? (isRead ? "Cofnij oznaczenie przeczytanej książki" : "Oznacz książkę jako przeczytaną") : "Zaloguj się, aby oznaczać książki jako przeczytane"}
              aria-label={user ? (isRead ? "Cofnij oznaczenie przeczytanej książki" : "Oznacz książkę jako przeczytaną") : "Logowanie wymagane do oznaczania książki jako przeczytanej"}
              onClick={toggleRead}
              className={`nodrag flex items-center gap-1 rounded-md px-1 py-0.5 transition ${user ? "cursor-pointer hover:bg-white/10 hover:text-white" : "cursor-default"} ${isRead ? "text-emerald-300" : ""}`}
            >
              {isRead ? <Check size={13} strokeWidth={2.5} /> : <ShieldCheck size={13} />}
              {book.certainty}%
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
