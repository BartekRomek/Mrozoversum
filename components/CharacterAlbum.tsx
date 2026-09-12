"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, Users } from "lucide-react";

import charactersData from "@/data/characters.json";

import { CharacterCard } from "@/components/CharacterCard";
import type { Character } from "@/lib/types";
import { seriesColors } from "@/lib/catalog";
import { trackEvent } from "@/lib/analytics";
import { SubpageLayout } from "@/components/SubpageLayout";

interface CharacterAlbumProps {
  onBack?: () => void;
  showSpoilers?: boolean;
}

const seriesOrder = [
  "Chylka",
  "Forst",
  "Langer",
  "Wladza",
  "Behawiorysta",
  "Zaorski",
];

const seriesLabels: Record<string, string> = {
  Chylka: "CHYŁKA",
  Forst: "FORST",
  Langer: "LANGER",
  Wladza: "WŁADZA",
  Behawiorysta: "BEHAWIORYSTA",
  Zaorski: "ZAORSKI",
};

const seriesIcons: Record<string, string> = {
  Chylka: "/icons/chylka.svg",
  Forst: "/icons/forst.svg",
  Langer: "/icons/langer.svg",
  Wladza: "/icons/wladza.svg",
  Behawiorysta: "/icons/behawiorysta.svg",
  Zaorski: "/icons/zaorski.svg",
};

function getUniqueCharacters(items: Character[]) {
  const seen = new Set<string>();

  return items.filter((character) => {
    const key = character.name.trim().toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function CharacterAlbum({
  onBack,
  showSpoilers = false,
}: CharacterAlbumProps) {
  const [openSeries, setOpenSeries] = useState<Record<string, boolean>>({
    Chylka: true,
    Forst: true,
    Langer: true,
    Wladza: true,
    Behawiorysta: true,
    Zaorski: true,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const characters = charactersData as Character[];

  const charactersBySeries = useMemo(() => {
    const grouped: Record<string, Character[]> = {};

    for (const series of seriesOrder) {
      grouped[series] = [];
    }

    for (const character of characters) {
      const series = character.series || "Chylka";

      if (!grouped[series]) {
        grouped[series] = [];
      }

      grouped[series].push(character);
    }

    return grouped;
  }, [characters]);

  const uniqueCharactersBySeries = useMemo(() => {
    const grouped: Record<string, Character[]> = {};

    for (const series of seriesOrder) {
      grouped[series] = getUniqueCharacters(
        charactersBySeries[series] || []
      );
    }

    return grouped;
  }, [charactersBySeries]);

  const totalUniqueCharacters = useMemo(() => {
    const seen = new Set<string>();

    for (const character of characters) {
      const key = character.name.trim().toLowerCase();
      seen.add(key);
    }

    return seen.size;
  }, [characters]);

  const toggleSeries = (series: string) => {
    setOpenSeries((current) => ({
      ...current,
      [series]: !current[series],
    }));
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();

  useEffect(() => {
    if (normalizedSearch.length < 2) return;
    const hasResults = characters.some((character) =>
      character.name.toLowerCase().includes(normalizedSearch)
    );
    trackEvent("search", { entity_type: "character", has_results: hasResults });
  }, [normalizedSearch, characters]);

  const getFilteredCharacters = (series: string) => {
    const items = uniqueCharactersBySeries[series] || [];

    if (!normalizedSearch) {
      return items;
    }

    return items.filter((character) =>
      character.name.toLowerCase().includes(normalizedSearch)
    );
  };

  return (
    <SubpageLayout onBack={onBack} className="character-album-page">
      {/* CONTENT */}
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10">
        {/* INTRO / SEARCH */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">Bohaterowie</h1>
              <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50"><Users size={14} className="text-[#d36b7c]" />{totalUniqueCharacters} postaci</span>
            </div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
              Poznaj bohaterów Mrozoversum
            </p>

          </div>

          <div className="relative w-full md:w-[300px]">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="SZUKAJ POSTACI"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-11 pr-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white outline-none placeholder:text-white/25 transition-all focus:border-white/20 focus:bg-white/[0.04]"
            />
          </div>
        </div>

        {/* SERIES */}
        <div className="space-y-8">
          {seriesOrder.map((series) => {
            const allCharacters =
              uniqueCharactersBySeries[series] || [];

            const visibleCharacters =
              getFilteredCharacters(series);

            if (allCharacters.length === 0) {
              return null;
            }

            const isOpen = openSeries[series];

            const brandColor =
              seriesColors[
                series as keyof typeof seriesColors
              ] || "#00ff1a";

            return (
              <section
                key={series}
                className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.012]"
              >
                {/* SERIES HEADER */}
                <button
                  type="button"
                  onClick={() => toggleSeries(series)}
                  className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-white/[0.025] sm:px-7"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    {/* ICON */}
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/20"
                      style={{
                        borderColor: `${brandColor}30`,
                      }}
                    >
                      {seriesIcons[series] ? (
                        <div
                          className="h-5 w-5 opacity-90"
                          style={{
                            backgroundColor: brandColor,
                            WebkitMaskImage: `url(${seriesIcons[series]})`,
                            maskImage: `url(${seriesIcons[series]})`,
                            WebkitMaskSize: "contain",
                            maskSize: "contain",
                            WebkitMaskRepeat: "no-repeat",
                            maskRepeat: "no-repeat",
                          }}
                        />
                      ) : (
                        <span
                          className="text-xs font-black"
                          style={{ color: brandColor }}
                        >
                          §
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div
                        className="text-sm font-black uppercase tracking-[0.2em]"
                        style={{ color: brandColor }}
                      >
                        {seriesLabels[series] || series}
                      </div>

                      <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.15em] text-white/30">
                        {allCharacters.length}{" "}
                        {allCharacters.length === 1
                          ? "postać"
                          : "postaci"}
                      </div>
                    </div>
                  </div>

                  {/* ARROW */}
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 group-hover:border-white/20 group-hover:text-white/70"
                    style={{
                      transform: isOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    <ChevronDown size={17} />
                  </div>
                </button>

                {/* SERIES CONTENT */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-white/[0.06] px-5 pb-7 pt-6 sm:px-7">
                      {visibleCharacters.length > 0 ? (
                        /*
                         * KARTY
                         *
                         * Nie rozciągamy kart na całą szerokość.
                         * Każda karta ma szerokość zbliżoną do tej
                         * używanej w karcie książki.
                         *
                         * auto-fit = tyle kart, ile sensownie
                         * mieści się w danym rzędzie.
                         */
                        <div
                          className="grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] md:gap-4"
                        >
                          {visibleCharacters.map((character) => (
                            <div
                              key={`${series}-${character.name}`}
                              className="min-w-0"
                            >
                              <CharacterCard
                                character={character}
                                showSpoilers={showSpoilers}
                                compactOnMobile
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-dashed border-white/10">
                          <div className="text-center">
                            <Search
                              size={22}
                              className="mx-auto mb-3 text-white/20"
                            />

                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                              Nie znaleziono postaci
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </SubpageLayout>
  );
}
