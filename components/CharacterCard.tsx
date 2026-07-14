"use client";

import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { seriesColors } from "@/lib/catalog";
import type { Character } from "@/lib/types";

const seriesIcons: Record<string, string> = {
  "Chylka": "/icons/chylka.svg",
  "Forst": "/icons/forst.svg",
  "Langer": "/icons/langer.svg",
  "Wladza": "/icons/wladza.svg"
};

interface CharacterCardProps {
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
  const [isLocallyRevealed, setIsLocallyRevealed] = useState(false);

  useEffect(() => {
    setIsLocallyRevealed(showSpoilers && (!!character.isAntagonist || !!character.isDead || !!character.hiddenIdentity));
  }, [showSpoilers, character.isAntagonist, character.isDead, character.hiddenIdentity]);

  const seriesId = (character.series as keyof typeof seriesColors) || "Chylka";
  const brandColor = seriesColors[seriesId] || "#00ff1a";

  const isShowingAntagonist = isLocallyRevealed && character.isAntagonist;
  const isShowingDeath = isLocallyRevealed && character.isDead;
  const isShowingHiddenIdentity = isLocallyRevealed && !!character.hiddenIdentity;

  const currentNameToDisplay = (isShowingHiddenIdentity && character.hiddenName) ? character.hiddenName : character.name;
  const nameParts = currentNameToDisplay.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  const currentPseudonym = (isShowingAntagonist && character.hiddenPseudonym) ? character.hiddenPseudonym : character.pseudonym;
  const currentAvatar = ((isShowingAntagonist || isShowingHiddenIdentity) && character.hiddenAvatar) ? character.hiddenAvatar : character.avatar;

  const highlightRole = isShowingAntagonist || isShowingHiddenIdentity;
  const displayRole = (highlightRole && character.hiddenRole) ? character.hiddenRole : character.role;

  let roleColor = brandColor;
  if (isShowingHiddenIdentity) {
    roleColor = "#a855f7";
  } else if (isShowingAntagonist) {
    roleColor = "#ef4444";
  }

  const revealColor = isShowingHiddenIdentity
    ? "#a855f7"
    : isShowingAntagonist
      ? "#ef4444"
      : isShowingDeath
        ? "#ffffff"
        : brandColor;

  const hasRevealedState = isShowingHiddenIdentity || isShowingAntagonist || isShowingDeath;

  const toggleReveal = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (showSpoilers && character.canSwitch) {
      setIsLocallyRevealed(!isLocallyRevealed);
    }
  };

  return (
    <div
      className="relative flex h-full w-full shrink-0 flex-col overflow-hidden rounded-xl border bg-[#0f1115] transition duration-300 hover:-translate-y-1 hover:border-white/16"
      style={{
        borderColor: hasRevealedState ? `${revealColor}99` : "rgba(255,255,255,0.06)",
        boxShadow: hasRevealedState
          ? `0 14px 42px rgba(0,0,0,0.62), 0 0 22px ${revealColor}33`
          : "0 8px 32px rgba(0,0,0,0.56)"
      }}
    >
      {hasRevealedState && (
        <div
          className="pointer-events-none absolute inset-0 z-50 rounded-xl"
          style={{
            border: `1px solid ${revealColor}cc`,
            boxShadow: `inset 0 0 20px ${revealColor}18`
          }}
        />
      )}

      <div className="relative flex h-[260px] shrink-0 items-center justify-center bg-[#1a1d24]">
        {character.isNew && (
          <div className="absolute right-4 top-4 z-30">
            <div className="flex flex-col items-center justify-center rounded-sm border border-[#00ff1a]/70 bg-black/35 px-1.5 py-[3px] text-center text-[#00ff1a] backdrop-blur-sm">
              <span className="mb-[1.5px] text-[6.5px] font-bold uppercase leading-none tracking-widest">Debiut</span>
              <span className="text-[6.5px] font-bold uppercase leading-none tracking-widest opacity-90">w serii</span>
            </div>
          </div>
        )}

        {seriesIcons[seriesId] && (
          <div
            className="absolute left-4 top-4 z-20 h-8 w-8 opacity-90"
            style={{
              backgroundColor: brandColor,
              WebkitMaskImage: `url(${seriesIcons[seriesId]})`,
              maskImage: `url(${seriesIcons[seriesId]})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              filter: "drop-shadow(0 0 2px rgba(0,0,0,0.8))"
            }}
          />
        )}

        {currentAvatar && currentAvatar !== "" ? (
          <img
            key={currentAvatar}
            src={currentAvatar}
            alt={currentNameToDisplay}
            className="absolute inset-0 z-10 h-full w-full object-cover animate-in fade-in duration-500"
          />
        ) : (
          <span className="relative z-10 font-mono text-5xl font-bold text-white/5">
            {currentNameToDisplay.charAt(0)}
          </span>
        )}

        {showSpoilers && character.canSwitch && (
          <>
            <button
              onClick={toggleReveal}
              className="absolute left-3 top-1/2 z-40 rounded-full border border-white/10 bg-black/45 p-1.5 text-white/70 backdrop-blur-md transition-all hover:bg-black/65 hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={toggleReveal}
              className="absolute right-3 top-1/2 z-40 rounded-full border border-white/10 bg-black/45 p-1.5 text-white/70 backdrop-blur-md transition-all hover:bg-black/65 hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-[#0f1115] to-transparent" />
      </div>

      <div className="relative z-20 flex flex-grow flex-col px-4 pb-5 pt-0 text-center">
        <div className="mt-2 mb-2 flex h-[28px] w-full flex-col items-center justify-center">
          {isShowingDeath && (
            <div className="mb-1 flex items-center justify-center rounded-sm border border-white/70 bg-black/60 px-2 py-[2px] text-white backdrop-blur-sm">
              <span className="text-[8px] font-bold uppercase leading-none tracking-widest">Śmierć</span>
            </div>
          )}

          {isShowingHiddenIdentity && (
            <div className="flex items-center justify-center rounded-sm border border-purple-500/70 bg-black/45 px-2 py-[2px] text-purple-400 backdrop-blur-sm">
              <span className="text-[8px] font-bold uppercase leading-none tracking-widest">
                {typeof character.hiddenIdentity === "string" ? character.hiddenIdentity : "UKRYTA TOŻSAMOŚĆ"}
              </span>
            </div>
          )}

          {!isShowingHiddenIdentity && isShowingAntagonist && (
            <div className="mt-1 flex items-center justify-center rounded-sm border border-red-600/70 bg-black/45 px-2 py-[2px] text-red-400 backdrop-blur-sm">
              <span className="text-[8px] font-bold uppercase leading-none tracking-widest">Antagonista</span>
            </div>
          )}
        </div>

        <div className="flex min-h-[120px] flex-col items-center justify-start">
          <div className="mb-1 flex min-h-[44px] flex-col items-center justify-end">
            <h3 className="flex flex-col text-[17px] font-bold uppercase leading-[1.1] tracking-widest text-white/95 sm:text-lg">
              <span className="transition-all duration-300">{firstName}</span>
              {lastName && <span className="transition-all duration-300">{lastName}</span>}
            </h3>
          </div>

          <span className={`mb-1 text-[10px] font-medium uppercase tracking-widest transition-all duration-300 ${currentPseudonym ? "text-white/50" : "opacity-0 select-none"}`}>
            {currentPseudonym ? `"${currentPseudonym}"` : '"BRAK"'}
          </span>

          <span
            className="mt-0.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300"
            style={{ color: roleColor }}
          >
            {displayRole || "Brak danych"}
          </span>
        </div>

        <div className="mt-auto flex flex-col items-center border-t border-white/5 pt-4 pb-1">
          <span className="mb-1 text-[8px] uppercase tracking-widest text-white/40 sm:text-[9px]">Debiut</span>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="shrink-0 text-white/60" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90 sm:text-xs">
              {character.debut || "Nieznany"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}