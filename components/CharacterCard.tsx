"use client";

import { Calendar } from "lucide-react";
import { seriesColors, seriesLabels } from "@/lib/catalog";
import type { Character } from "@/lib/types";

const seriesIcons: Record<string, string> = {
  "Chylka": "/icons/chylka.svg",
  "Forst": "/icons/forst.svg",
  "Langer": "/icons/langer.svg",
};

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const seriesId = (character.series as any) || "Chylka";
  const brandColor = seriesColors[seriesId] || "#00ff1a"; 

  // Rozdzielenie imienia i nazwiska
  const nameParts = character.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return (
    <div 
      className="flex flex-col w-full shrink-0 overflow-hidden rounded-xl bg-[#0f1115] border border-white/5 transition-transform duration-300 hover:scale-[1.02]"
      style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.6)` }}
    >
      <div className="relative h-[260px] bg-[#1a1d24] flex items-center justify-center">
        
        {/* Ikona */}
        {seriesIcons[seriesId] && (
          <div 
            className="absolute top-4 left-4 z-20 w-8 h-8 opacity-90"
            style={{ 
              backgroundColor: brandColor,
              WebkitMaskImage: `url(${seriesIcons[seriesId]})`,
              maskImage: `url(${seriesIcons[seriesId]})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))'
            }}
          />
        )}

        {character.avatar && character.avatar !== "" ? (
          <img 
            src={character.avatar} 
            alt={character.name} 
            className="absolute inset-0 z-10 h-full w-full object-cover"
          />
        ) : (
          <span className="relative z-10 font-mono text-5xl font-bold text-white/5">
            {character.name.charAt(0)}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#0f1115] to-transparent pointer-events-none" />
      </div>

      <div className="relative z-20 flex flex-col px-4 pb-5 pt-0 text-center">
        
        {/* TYPOGRAFIA POSTACI - SZTYWNY UKŁAD */}
        <div className="flex flex-col items-center justify-start min-h-[76px]">
          
          {/* 1. Imię i Nazwisko (Sztywna wysokość na max 2 linijki tekstu) */}
          <div className="flex flex-col items-center justify-end min-h-[44px] mb-1">
            <h3 className="flex flex-col text-[17px] sm:text-lg font-bold text-white/95 uppercase tracking-widest leading-[1.1]">
              <span>{firstName}</span>
              {lastName && <span>{lastName}</span>}
            </h3>
          </div>
          
          {/* 2. Pseudonim (Zawsze renderowany, przezroczysty jeśli go brak) */}
          <span 
            className={`text-[10px] font-medium tracking-widest uppercase mb-1 ${
              character.pseudonym ? "text-white/50" : "opacity-0 select-none"
            }`}
          >
            {character.pseudonym ? `"${character.pseudonym}"` : '"BRAK"'}
          </span>

          {/* 3. Rola (Kolorowa, zawsze na tej samej wysokości) */}
          <span 
            className="text-[10px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: brandColor }}
          >
            {character.role || "Brak danych"}
          </span>
        </div>

        {/* DOLNE METADANE (Seria i Debiut) */}
        <div className="mt-5 flex items-end justify-between">
          <div className="flex flex-col items-start gap-1.5 w-1/2">
            <span className="text-[8px] sm:text-[9px] text-white/40 uppercase tracking-widest truncate w-full text-left">
              Seria
            </span>
            <div className="flex items-center gap-1.5 w-full">
              <span 
                className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: brandColor }}
              />
              <span className="text-[10px] sm:text-xs font-semibold text-white/90 uppercase tracking-wider truncate">
                {seriesLabels[seriesId] || character.series}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 w-1/2">
            <span className="text-[8px] sm:text-[9px] text-white/40 uppercase tracking-widest truncate w-full text-right">
              Debiut
            </span>
            <div className="flex items-center gap-1.5 w-full justify-end">
              <Calendar size={12} className="text-white/60 shrink-0" />
              <span className="text-[10px] sm:text-xs font-semibold text-white/90 uppercase tracking-wider truncate">
                {character.debut || "Nieznany"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}