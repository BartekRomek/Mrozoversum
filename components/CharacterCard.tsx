"use client";

import { Scale, Calendar } from "lucide-react";
import { seriesColors, seriesLabels } from "@/lib/catalog";
import type { Character } from "@/lib/types";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  // Pobieramy dynamiczny kolor serii, aby kropka, rola i ikona pasowały do uniwersum
  const seriesId = (character.series as any) || "Chylka";
  const brandColor = seriesColors[seriesId] || "#3b82f6"; // Domyślnie niebieski dla dopasowania z wizualizacją

  return (
    <div 
      className="flex flex-col w-[220px] shrink-0 overflow-hidden rounded-xl bg-[#0f1115] border border-white/5 transition-transform duration-300 hover:scale-[1.02]"
      style={{
        boxShadow: `0 8px 32px rgba(0,0,0,0.6)`
      }}
    >
      {/* GÓRNA SEKCJA: Zdjęcie z gradientem i ikoną */}
      <div className="relative h-[260px] bg-[#1a1d24] flex items-center justify-center">
        {/* Ikona w lewym górnym rogu */}
        <div className="absolute top-4 left-4 z-20">
          <Scale size={22} style={{ color: brandColor }} className="opacity-80" />
        </div>

        {/* Miejsce na zdjęcie od Ciebie */}
        {character.avatar && character.avatar !== "" ? (
          <img 
            src={character.avatar} 
            alt={character.name} 
            className="absolute inset-0 z-10 h-full w-full object-cover"
          />
        ) : (
          /* Fallback, gdyby postać nie miała jeszcze zdjęcia */
          <span className="relative z-10 font-mono text-5xl font-bold text-white/5">
            {character.name.charAt(0)}
          </span>
        )}

        {/* Gradient płynnie łączący zdjęcie z czarnym tłem dolnej sekcji */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#0f1115] to-transparent pointer-events-none" />
      </div>

      {/* DOLNA SEKCJA: Informacje tekstowe */}
      <div className="relative z-20 flex flex-col px-4 pb-5 pt-0 text-center">
        {/* Imię i nazwisko */}
        <h3 className="text-xl font-bold text-white/95 uppercase tracking-wide">
          {character.name}
        </h3>
        
        {/* Rola / Praca */}
        <span 
          className="mt-1 text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: brandColor }}
        >
          {character.role || "Brak danych"}
        </span>

        {/* Dolny wiersz z Serią i Debiutem */}
        <div className="mt-6 flex items-end justify-between">
          
          {/* Lewa strona: Seria */}
          <div className="flex flex-col items-start gap-1.5">
            <span className="text-[9px] text-white/40 uppercase tracking-widest">
              Seria macierzysta
            </span>
            <div className="flex items-center gap-1.5">
              <span 
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: brandColor }}
              />
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                {seriesLabels[seriesId] || character.series}
              </span>
            </div>
          </div>

          {/* Prawa strona: Debiut */}
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[9px] text-white/40 uppercase tracking-widest">
              Debiut
            </span>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-white/60 mb-0.5" />
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                {character.debut || "Nieznany"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}