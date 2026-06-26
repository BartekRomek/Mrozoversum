"use client";

import { Scale, Calendar, Knife, Mountain, User } from "lucide-react";
import { seriesColors, seriesLabels } from "@/lib/catalog";
import type { Character } from "@/lib/types";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const seriesId = (character.series as any) || "Chylka";
  const brandColor = seriesColors[seriesId] || "#3b82f6";

  const getIcon = () => {
    switch (character.series) {
      case "Forst": return <Mountain size={22} style={{ color: brandColor }} className="opacity-80" />;
      case "Langer": return <Knife size={22} className="text-rose-600" />;
      case "Chylka": return <Scale size={22} style={{ color: brandColor }} className="opacity-80" />;
      default: return <User size={22} style={{ color: brandColor }} className="opacity-80" />;
    }
  };

  return (
    <div 
      className="flex flex-col w-[220px] shrink-0 overflow-hidden rounded-xl bg-[#0f1115] border border-white/5 transition-transform duration-300 hover:scale-[1.02]"
      style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.6)` }}
    >
      <div className="relative h-[260px] bg-[#1a1d24] flex items-center justify-center">
        <div className="absolute top-4 left-4 z-20">{getIcon()}</div>
        {character.avatar && character.avatar !== "" ? (
          <img src={character.avatar} alt={character.name} className="absolute inset-0 z-10 h-full w-full object-cover" />
        ) : (
          <span className="relative z-10 font-mono text-5xl font-bold text-white/5">{character.name.charAt(0)}</span>
        )}
        <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#0f1115] to-transparent pointer-events-none" />
      </div>
      <div className="relative z-20 flex flex-col px-4 pb-5 pt-0 text-center">
        <h3 className="text-xl font-bold text-white/95 uppercase tracking-wide">{character.name}</h3>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: brandColor }}>
          {character.role || "Brak danych"}
        </span>
        <div className="mt-6 flex items-end justify-between">
          <div className="flex flex-col items-start gap-1.5">
            <span className="text-[9px] text-white/40 uppercase tracking-widest">Seria macierzysta</span>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: brandColor }} />
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">{seriesLabels[seriesId] || character.series}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[9px] text-white/40 uppercase tracking-widest">Debiut</span>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-white/60 mb-0.5" />
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">{character.debut || "Nieznany"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}