"use client";

import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { seriesColors } from "@/lib/catalog";
import type { Character } from "@/lib/types";
import { assetPath } from "@/lib/assetPath";

const seriesIcons: Record<string, string> = {
  Chylka: "/icons/chylka.svg",
  Forst: "/icons/forst.svg",
  Langer: "/icons/langer.svg",
  Wladza: "/icons/wladza.svg",
  Zaorski: "/icons/zaorski.svg",
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
  compact?: boolean;
  compactOnMobile?: boolean;
}

export function CharacterCard({
  character,
  showSpoilers = false,
  compact: compactProp = false,
  compactOnMobile = false,
}: CharacterCardProps) {
  const [isLocallyRevealed, setIsLocallyRevealed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!compactOnMobile) return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMobileState = () => setIsMobile(mediaQuery.matches);

    updateMobileState();
    mediaQuery.addEventListener("change", updateMobileState);

    return () => mediaQuery.removeEventListener("change", updateMobileState);
  }, [compactOnMobile]);

  const compact = compactProp || (compactOnMobile && isMobile);

  useEffect(() => {
    setIsLocallyRevealed(
      showSpoilers &&
        (!!character.isAntagonist ||
          !!character.isDead ||
          !!character.hiddenIdentity)
    );
  }, [
    showSpoilers,
    character.isAntagonist,
    character.isDead,
    character.hiddenIdentity,
  ]);

  const seriesId =
    (character.series as keyof typeof seriesColors) || "Chylka";

  const brandColor = seriesColors[seriesId] || "#00ff1a";

  const isShowingAntagonist =
    isLocallyRevealed && character.isAntagonist;

  const isShowingDeath =
    isLocallyRevealed && character.isDead;

  const isShowingHiddenIdentity =
    isLocallyRevealed && !!character.hiddenIdentity;

  const currentNameToDisplay =
    isShowingHiddenIdentity && character.hiddenName
      ? character.hiddenName
      : character.name;

  const nameParts = currentNameToDisplay.split(" ");

  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  const currentPseudonym =
    isShowingAntagonist && character.hiddenPseudonym
      ? character.hiddenPseudonym
      : character.pseudonym;

  const currentAvatar =
    (isShowingAntagonist || isShowingHiddenIdentity) &&
    character.hiddenAvatar
      ? character.hiddenAvatar
      : character.avatar;

  const highlightRole =
    isShowingAntagonist || isShowingHiddenIdentity;

  const displayRole =
    highlightRole && character.hiddenRole
      ? character.hiddenRole
      : character.role;

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

  const hasRevealedState =
    isShowingHiddenIdentity ||
    isShowingAntagonist ||
    isShowingDeath;

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
        borderColor: hasRevealedState
          ? `${revealColor}99`
          : "rgba(255,255,255,0.06)",
        boxShadow: hasRevealedState
          ? `0 14px 42px rgba(0,0,0,0.62), 0 0 22px ${revealColor}33`
          : "0 8px 32px rgba(0,0,0,0.56)",
      }}
    >
      {hasRevealedState && (
        <div
          className="pointer-events-none absolute inset-0 z-50 rounded-xl"
          style={{
            border: `1px solid ${revealColor}cc`,
            boxShadow: `inset 0 0 20px ${revealColor}18`,
          }}
        />
      )}

      {/* ZDJĘCIE */}

      <div
        className={`relative flex shrink-0 items-center justify-center bg-[#1a1d24] ${
          compact ? "h-[190px]" : "h-[260px]"
        }`}
      >
        {character.isNew && (
          <div
            className={`absolute z-30 ${
              compact ? "right-2 top-2" : "right-4 top-4"
            }`}
          >
            <div
              className={`flex flex-col items-center justify-center rounded-sm border border-[#00ff1a]/70 bg-black/35 text-center text-[#00ff1a] backdrop-blur-sm ${
                compact
                  ? "px-1 py-[2px]"
                  : "px-1.5 py-[3px]"
              }`}
            >
              <span
                className={`mb-[1.5px] font-bold uppercase leading-none tracking-widest ${
                  compact ? "text-[5px]" : "text-[6.5px]"
                }`}
              >
                Debiut
              </span>

              <span
                className={`font-bold uppercase leading-none tracking-widest opacity-90 ${
                  compact ? "text-[5px]" : "text-[6.5px]"
                }`}
              >
                w serii
              </span>
            </div>
          </div>
        )}

        {seriesIcons[seriesId] && (
          <div
            className={`absolute z-20 opacity-90 ${
              compact
                ? "left-2 top-2 h-6 w-6"
                : "left-4 top-4 h-8 w-8"
            }`}
            style={{
              backgroundColor: brandColor,
              WebkitMaskImage: `url(${assetPath(
                seriesIcons[seriesId]
              )})`,
              maskImage: `url(${assetPath(
                seriesIcons[seriesId]
              )})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              filter:
                "drop-shadow(0 0 2px rgba(0,0,0,0.8))",
            }}
          />
        )}

        {currentAvatar && currentAvatar !== "" ? (
          <img
            key={currentAvatar}
            src={assetPath(currentAvatar)}
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
              className={`absolute z-40 rounded-full border border-white/10 bg-black/45 text-white/70 backdrop-blur-md transition-all hover:bg-black/65 hover:text-white ${
                compact
                  ? "left-2 top-1/2 p-1"
                  : "left-3 top-1/2 p-1.5"
              }`}
            >
              <ChevronLeft
                size={compact ? 15 : 20}
              />
            </button>

            <button
              onClick={toggleReveal}
              className={`absolute z-40 rounded-full border border-white/10 bg-black/45 text-white/70 backdrop-blur-md transition-all hover:bg-black/65 hover:text-white ${
                compact
                  ? "right-2 top-1/2 p-1"
                  : "right-3 top-1/2 p-1.5"
              }`}
            >
              <ChevronRight
                size={compact ? 15 : 20}
              />
            </button>
          </>
        )}

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#0f1115] to-transparent ${
            compact ? "h-24" : "h-32"
          }`}
        />
      </div>

      {/* INFORMACJE */}

      <div
        className={`relative z-20 flex flex-grow flex-col text-center ${
          compact
            ? "px-2.5 pb-3 pt-0"
            : "px-4 pb-5 pt-0"
        }`}
      >
        <div
          className={`flex w-full flex-col items-center justify-center ${
            compact
              ? "mb-1 mt-1 h-[20px]"
              : "mb-2 mt-2 h-[28px]"
          }`}
        >
          {isShowingDeath && (
            <div
              className={`flex items-center justify-center rounded-sm border border-white/70 bg-black/60 text-white backdrop-blur-sm ${
                compact
                  ? "px-1.5 py-[1px]"
                  : "px-2 py-[2px]"
              }`}
            >
              <span
                className={`font-bold uppercase leading-none tracking-widest ${
                  compact ? "text-[6px]" : "text-[8px]"
                }`}
              >
                Śmierć
              </span>
            </div>
          )}

          {isShowingHiddenIdentity && (
            <div
              className={`flex items-center justify-center rounded-sm border border-purple-500/70 bg-black/45 text-purple-400 backdrop-blur-sm ${
                compact
                  ? "px-1.5 py-[1px]"
                  : "px-2 py-[2px]"
              }`}
            >
              <span
                className={`font-bold uppercase leading-none tracking-widest ${
                  compact ? "text-[6px]" : "text-[8px]"
                }`}
              >
                {typeof character.hiddenIdentity === "string"
                  ? character.hiddenIdentity
                  : "UKRYTA TOŻSAMOŚĆ"}
              </span>
            </div>
          )}

          {!isShowingHiddenIdentity &&
            isShowingAntagonist && (
              <div
                className={`flex items-center justify-center rounded-sm border border-red-600/70 bg-black/45 text-red-400 backdrop-blur-sm ${
                  compact
                    ? "mt-0 px-1.5 py-[1px]"
                    : "mt-1 px-2 py-[2px]"
                }`}
              >
                <span
                  className={`font-bold uppercase leading-none tracking-widest ${
                    compact ? "text-[6px]" : "text-[8px]"
                  }`}
                >
                  Antagonista
                </span>
              </div>
            )}
        </div>

        <div
          className={`flex flex-col items-center justify-start ${
            compact ? "min-h-[86px]" : "min-h-[120px]"
          }`}
        >
          <div
            className={`flex flex-col items-center justify-end ${
              compact
                ? "mb-1 min-h-[34px]"
                : "mb-1 min-h-[44px]"
            }`}
          >
            <h3
              className={`flex flex-col font-bold uppercase leading-[1.1] tracking-widest text-white/95 ${
                compact
                  ? "text-[11px]"
                  : "text-[17px] sm:text-lg"
              }`}
            >
              <span className="transition-all duration-300">
                {firstName}
              </span>

              {lastName && (
                <span className="transition-all duration-300">
                  {lastName}
                </span>
              )}
            </h3>
          </div>

          <span
            className={`font-medium uppercase tracking-widest transition-all duration-300 ${
              compact
                ? "mb-0.5 text-[7px]"
                : "mb-1 text-[10px]"
            } ${
              currentPseudonym
                ? "text-white/50"
                : "select-none opacity-0"
            }`}
          >
            {currentPseudonym
              ? `"${currentPseudonym}"`
              : '"BRAK"'}
          </span>

          <span
            className={`mt-0.5 font-bold uppercase tracking-widest transition-colors duration-300 ${
              compact ? "text-[7px]" : "text-[10px]"
            }`}
            style={{ color: roleColor }}
          >
            {displayRole || "Brak danych"}
          </span>
        </div>

        <div
          className={`mt-auto flex flex-col items-center border-t border-white/5 ${
            compact
              ? "pt-2 pb-0"
              : "pt-4 pb-1"
          }`}
        >
          <span
            className={`mb-1 uppercase tracking-widest text-white/40 ${
              compact ? "text-[6px]" : "text-[8px] sm:text-[9px]"
            }`}
          >
            Debiut
          </span>

          <div
            className={`flex items-center ${
              compact ? "gap-1" : "gap-1.5"
            }`}
          >
            <Calendar
              size={compact ? 9 : 12}
              className="shrink-0 text-white/60"
            />

            <span
              className={`font-semibold uppercase tracking-wider text-white/90 ${
                compact
                  ? "text-[7px]"
                  : "text-[10px] sm:text-xs"
              }`}
            >
              {character.debut || "Nieznany"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
