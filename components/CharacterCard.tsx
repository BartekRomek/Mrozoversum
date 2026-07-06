"use client";

import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { seriesColors, seriesLabels } from "@/lib/catalog";
import type { Character } from "@/lib/types";

const seriesIcons: Record<string, string> = {
  "Chylka": "/icons/chylka.svg",
  "Forst": "/icons/forst.svg",
  "Langer": "/icons/langer.svg",
  "Wladza": "/icons/wladza.svg",
};

interface CharacterCardProps {
  // Rozszerzony typ: dodano hiddenIdentity (jako string lub boolean), hiddenName, hiddenPseudonym oraz hiddenAvatar
  character: Character & { 
    isNew?: boolean; 
    isAntagonist?: boolean; 
    isDead?: boolean; 
    pseudonym?: string; 
    hiddenRole?: string; 
    canSwitch?: boolean; 
    hiddenIdentity?: string | boolean; 
    hiddenName?: string;
    hiddenPseudonym?: string;
    hiddenAvatar?: string;
  };
  showSpoilers?: boolean; 
}

export function CharacterCard({ character, showSpoilers = false }: CharacterCardProps) {
  // LOKALNY STAN: Przechowuje informację o tym, czy karta jest w trybie "odkrytym"
  const [isLocallyRevealed, setIsLocallyRevealed] = useState(false);

  useEffect(() => {
    // Karta jest lokalnie odkryta, jeśli pokazujemy spoilery i ma JAKĄKOLWIEK tajemnicę
    setIsLocallyRevealed(showSpoilers && (!!character.isAntagonist || !!character.isDead || !!character.hiddenIdentity));
  }, [showSpoilers, character.isAntagonist, character.isDead, character.hiddenIdentity]);

  const seriesId = (character.series as any) || "Chylka";
  const brandColor = seriesColors[seriesId] || "#00ff1a"; 

  // Stany pokazywania poszczególnych "sekretów"
  const isShowingAntagonist = isLocallyRevealed && character.isAntagonist;
  const isShowingDeath = isLocallyRevealed && character.isDead;
  const isShowingHiddenIdentity = isLocallyRevealed && !!character.hiddenIdentity;

  // LOGIKA IMIENIA I DANYCH (Jeśli pokazujemy ukrytą tożsamość i postać ma ukryte dane, podmień)
  const currentNameToDisplay = (isShowingHiddenIdentity && character.hiddenName) ? character.hiddenName : character.name;
  const nameParts = currentNameToDisplay.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");
  
  // POPRAWIONE: Logika dla pseudonimu (tylko antagonista) i avatara (antagonista LUB ukryta tożsamość)
  const currentPseudonym = (isShowingAntagonist && character.hiddenPseudonym) ? character.hiddenPseudonym : character.pseudonym;
  const currentAvatar = ((isShowingAntagonist || isShowingHiddenIdentity) && character.hiddenAvatar) ? character.hiddenAvatar : character.avatar;

  // LOGIKA ROLI I KOLORU
  const highlightRole = isShowingAntagonist || isShowingHiddenIdentity;
  const displayRole = (highlightRole && character.hiddenRole) ? character.hiddenRole : character.role;

  // Ustawianie koloru dolnego napisu roli (Fioletowy priorytet, potem Czerwony, potem kolor serii)
  let roleColor = brandColor;
  if (isShowingHiddenIdentity) {
    roleColor = "#a855f7"; // Fioletowy dla ukrytej tożsamości
  } else if (isShowingAntagonist) {
    roleColor = "#ef4444"; // Czerwony dla antagonisty
  }

  // Przełączanie karty jeśli postać ma ukryte informacje
  const toggleReveal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showSpoilers && character.canSwitch) {
      setIsLocallyRevealed(!isLocallyRevealed);
    }
  };

  return (
    <div 
      className={`relative flex flex-col w-full h-full shrink-0 overflow-hidden rounded-xl bg-[#0f1115] transition-transform duration-300 hover:scale-[1.02] ${
        isShowingHiddenIdentity || isShowingAntagonist || isShowingDeath ? "" : "border border-white/5"
      }`}
      style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.6)` }}
    >
      {/* 🟣 PULSUJĄCA OBWÓDKA (Fioletowa - najwyższy priorytet) */}
      {isShowingHiddenIdentity && (
        <div className="absolute inset-0 z-50 pointer-events-none rounded-xl border border-purple-500/90 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.5)]" />
      )}
      {/* 🔴 PULSUJĄCA OBWÓDKA (Czerwona - jeśli nie ma fioletowej) */}
      {!isShowingHiddenIdentity && isShowingAntagonist && (
        <div className="absolute inset-0 z-50 pointer-events-none rounded-xl border border-red-600/90 animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.5)]" />
      )}
      {/* ⚪ PULSUJĄCA OBWÓDKA (Biała - jeśli nie ma fioletowej ani czerwonej) */}
      {!isShowingHiddenIdentity && !isShowingAntagonist && isShowingDeath && (
        <div className="absolute inset-0 z-50 pointer-events-none rounded-xl border border-white/90 animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
      )}

      {/* Sekcja obrazka */}
      <div className="relative h-[260px] bg-[#1a1d24] flex items-center justify-center shrink-0">
        {character.isNew && (
          <div className="absolute top-4 right-4 z-30 animate-pulse">
            <div className="flex flex-col items-center justify-center border border-[#00ff1a]/80 text-[#00ff1a] px-1.5 py-[3px] rounded-sm bg-black/30 backdrop-blur-sm text-center">
              <span className="text-[6.5px] font-bold uppercase tracking-widest leading-none mb-[1.5px]">Debiut</span>
              <span className="text-[6.5px] font-bold uppercase tracking-widest leading-none opacity-90">w serii</span>
            </div>
          </div>
        )}

        {seriesIcons[seriesId] && (
          <div className="absolute top-4 left-4 z-20 w-8 h-8 opacity-90" style={{ backgroundColor: brandColor, WebkitMaskImage: `url(${seriesIcons[seriesId]})`, maskImage: `url(${seriesIcons[seriesId]})`, WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))' }} />
        )}

        {currentAvatar && currentAvatar !== "" ? (
          <img key={currentAvatar} src={currentAvatar} alt={currentNameToDisplay} className="absolute inset-0 z-10 h-full w-full object-cover animate-in fade-in duration-500" />
        ) : (
          <span className="relative z-10 font-mono text-5xl font-bold text-white/5">{currentNameToDisplay.charAt(0)}</span>
        )}

        {/* Strzałki widoczne TYLKO gdy canSwitch z BookDetailsPanel jest true */}
        {showSpoilers && character.canSwitch && (
          <>
            <button onClick={toggleReveal} className="absolute left-3 top-1/2 -translate-y-1/2 z-40 p-1.5 rounded-full bg-black/40 text-white/70 hover:text-white backdrop-blur-md transition-all hover:bg-black/60">
              <ChevronLeft size={20} />
            </button>
            <button onClick={toggleReveal} className="absolute right-3 top-1/2 -translate-y-1/2 z-40 p-1.5 rounded-full bg-black/40 text-white/70 hover:text-white backdrop-blur-md transition-all hover:bg-black/60">
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#0f1115] to-transparent pointer-events-none" />
      </div>

      {/* Sekcja tekstowa */}
      <div className="relative z-20 flex flex-col px-4 pb-5 pt-0 text-center flex-grow">
        
        {/* ETYKIETY - Stały kontener 28px, by karta nie skakała */}
        <div className="h-[28px] w-full flex flex-col items-center justify-center mt-2 mb-2">
          {isShowingDeath && (
            <div className="flex items-center justify-center border border-white/80 text-white px-2 py-[2px] rounded-sm bg-black/60 backdrop-blur-sm animate-pulse mb-1">
              <span className="text-[8px] font-bold uppercase tracking-widest leading-none">Śmierć</span>
            </div>
          )}
          
          {/* FIOLETOWY KAFELEK - Ukryta tożsamość */}
          {isShowingHiddenIdentity && (
            <div className="flex items-center justify-center border border-purple-500/80 text-purple-500 px-2 py-[2px] rounded-sm bg-black/40 backdrop-blur-sm animate-pulse">
              <span className="text-[8px] font-bold uppercase tracking-widest leading-none">
                {typeof character.hiddenIdentity === "string" ? character.hiddenIdentity : "UKRYTA TOŻSAMOŚĆ"}
              </span>
            </div>
          )}

          {/* CZERWONY KAFELEK - Antagonista (Ukryty, jeśli postać ma fioletowy kafelek) */}
          {!isShowingHiddenIdentity && isShowingAntagonist && (
            <div className="flex items-center justify-center border border-red-600/80 text-red-500 px-2 py-[2px] rounded-sm bg-black/40 backdrop-blur-sm animate-pulse mt-1">
              <span className="text-[8px] font-bold uppercase tracking-widest leading-none">Antagonista</span>
            </div>
          )}
        </div>

        {/* Stały min-height (120px) gwarantuje stabilny układ tekstowy */}
        <div className="flex flex-col items-center justify-start min-h-[120px]">
          <div className="flex flex-col items-center justify-end min-h-[44px] mb-1">
            <h3 className="flex flex-col text-[17px] sm:text-lg font-bold text-white/95 uppercase tracking-widest leading-[1.1]">
              <span className="transition-all duration-300">{firstName}</span>
              {lastName && <span className="transition-all duration-300">{lastName}</span>}
            </h3>
          </div>
          
          <span className={`text-[10px] font-medium tracking-widest uppercase mb-1 transition-all duration-300 ${currentPseudonym ? "text-white/50" : "opacity-0 select-none"}`}>
            {currentPseudonym ? `"${currentPseudonym}"` : '"BRAK"'}
          </span>

          <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5 transition-colors duration-300" style={{ color: roleColor }}>
            {displayRole || "Brak danych"}
          </span>
        </div>

        <div className="mt-auto flex flex-col items-center pt-4 border-t border-white/5 pb-1">
          <span className="text-[8px] sm:text-[9px] text-white/40 uppercase tracking-widest mb-1">Debiut</span>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-white/60 shrink-0" />
            <span className="text-[10px] sm:text-xs font-semibold text-white/90 uppercase tracking-wider">{character.debut || "Nieznany"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}