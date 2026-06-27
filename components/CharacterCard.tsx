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
  character: Character & { isNew?: boolean; isAntagonist?: boolean };
}

export function CharacterCard({ character }: CharacterCardProps) {
  const seriesId = (character.series as any) || "Chylka";
  const brandColor = seriesColors[seriesId] || "#00ff1a"; 

  // Rozdzielenie imienia i nazwiska
  const nameParts = character.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  const isAntagonist = character.isAntagonist;

  return (
    <div 
      // Usunęliśmy szarą obwódkę na sztywno. Dodajemy ją tylko, gdy postać NIE jest antagonistą.
      className={`relative flex flex-col w-full h-full shrink-0 overflow-hidden rounded-xl bg-[#0f1115] transition-transform duration-300 hover:scale-[1.02] ${
        isAntagonist ? "" : "border border-white/5"
      }`}
      style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.6)` }}
    >
      {/* 🔴 PULSUJĄCA OBWÓDKA KARTY DLA ANTAGONISTY (Zmieniono na 1px i wyrównano do samego brzegu) */}
      {isAntagonist && (
        <div className="absolute inset-0 z-50 pointer-events-none rounded-xl border border-red-600/90 animate-pulse shadow-[inset_0_0_12px_rgba(220,38,38,0.3)]" />
      )}

      {/* Sekcja obrazka */}
      <div className="relative h-[260px] bg-[#1a1d24] flex items-center justify-center shrink-0">
        
        {/* POMNIEJSZONA Etykieta DEBIUT */}
        {character.isNew && (
          <div className="absolute top-4 right-4 z-30 animate-pulse">
            <div className="flex flex-col items-center justify-center border border-[#00ff1a]/80 text-[#00ff1a] px-1.5 py-[3px] rounded-sm bg-black/30 backdrop-blur-sm text-center">
              <span className="text-[6.5px] font-bold uppercase tracking-widest leading-none mb-[1.5px]">
                Debiut
              </span>
              <span className="text-[6.5px] font-bold uppercase tracking-widest leading-none opacity-90">
                w serii
              </span>
            </div>
          </div>
        )}

        {/* Ikona serii */}
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

      {/* Sekcja tekstowa */}
      <div className="relative z-20 flex flex-col px-4 pb-5 pt-0 text-center flex-grow">
        
        {/* 🔴 ETYKIETA "ANTAGONISTA" NAD IMIENIEM */}
        {isAntagonist && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 animate-pulse">
            <div className="flex items-center justify-center border border-red-600/80 text-red-500 px-2 py-[2px] rounded-sm bg-black/40 backdrop-blur-sm">
              <span className="text-[8px] font-bold uppercase tracking-widest leading-none">
                Antagonista
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-start min-h-[92px]">
          
          <div className="flex flex-col items-center justify-end min-h-[44px] mb-1">
            <h3 className="flex flex-col text-[17px] sm:text-lg font-bold text-white/95 uppercase tracking-widest leading-[1.1]">
              <span>{firstName}</span>
              {lastName && <span>{lastName}</span>}
            </h3>
          </div>
          
          <span 
            className={`text-[10px] font-medium tracking-widest uppercase mb-1 ${
              character.pseudonym ? "text-white/50" : "opacity-0 select-none"
            }`}
          >
            {character.pseudonym ? `"${character.pseudonym}"` : '"BRAK"'}
          </span>

          <span 
            className="text-[10px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: isAntagonist ? "#ef4444" : brandColor }}
          >
            {character.role || "Brak danych"}
          </span>
        </div>

        {/* DOLNE METADANE */}
        <div className="mt-auto flex items-end justify-between pt-4">
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