"use client";

import { BookOpen, Calendar, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import booksData from "@/data/books.json";
import { appearancesData } from "@/data/appearances";
import { assetPath } from "@/lib/assetPath";
import { seriesColors, seriesLabels } from "@/lib/catalog";
import type { Book, Character } from "@/lib/types";

type CharacterDetailsPanelProps = {
  character: Character | null;
  variants: Character[];
  showSpoilers?: boolean;
  onClose: () => void;
  onSelectBook?: (bookId: string) => void;
};

type Appearance = {
  characterId: string;
  bookId: string;
  role?: string;
  isFirstAppearance?: boolean;
  isNew?: boolean;
  isDead?: boolean;
};

export function CharacterDetailsPanel({
  character,
  variants,
  showSpoilers = false,
  onClose,
  onSelectBook,
}: CharacterDetailsPanelProps) {
  const [activeVariantId, setActiveVariantId] = useState(character?.id || "");

  useEffect(() => {
    setActiveVariantId(character?.id || "");
  }, [character?.id]);

  if (!character) return null;

  const activeCharacter = variants.find((variant) => variant.id === activeVariantId) || character;
  const books = booksData as Book[];
  const appearances = (appearancesData as Appearance[]).filter(
    (appearance) => appearance.characterId === activeCharacter.id
  );
  const bookById = new Map(books.map((book) => [book.id, book]));
  const appearanceBooks = appearances
    .map((appearance) => ({
      appearance,
      book: bookById.get(appearance.bookId),
    }))
    .filter((item): item is { appearance: Appearance; book: Book } => Boolean(item.book));

  const color = seriesColors[activeCharacter.series as keyof typeof seriesColors] || "#d36b7c";
  const displayRole = activeCharacter.role;
  const displayName = showSpoilers && activeCharacter.hiddenName
    ? activeCharacter.hiddenName
    : activeCharacter.name;
  const displayAvatar = showSpoilers && activeCharacter.hiddenAvatar
    ? activeCharacter.hiddenAvatar
    : activeCharacter.avatar;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:p-5 md:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Szczegóły postaci: ${displayName}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="relative flex h-[calc(100dvh-1rem)] w-full max-w-[1080px] flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#090a0f]/[.98] text-white shadow-2xl shadow-black/80 sm:h-[min(640px,calc(100dvh-2rem))] sm:rounded-3xl md:w-[min(1080px,calc(100vw-2rem))] md:flex-row">
        <button
          type="button"
          onClick={onClose}
          aria-label="Zamknij szczegóły postaci"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/65 backdrop-blur transition hover:border-rose-300/50 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-[#111319] md:h-full md:w-[44%] md:aspect-auto">
          {displayAvatar ? (
            <>
              <div
                key={`${displayAvatar}-background`}
                className="absolute inset-0 scale-110 bg-cover bg-center opacity-60 blur-3xl"
                style={{ backgroundImage: `url(${assetPath(displayAvatar)})` }}
              />
              <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-[#111319] via-transparent to-[#111319] opacity-90" />
              <img
                key={displayAvatar}
                src={assetPath(displayAvatar)}
                alt={displayName}
                className="relative z-10 h-full w-full object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.55)]"
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-7xl font-bold text-white/10">
              {displayName.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-black/20" />
          <div
            className="absolute inset-x-0 bottom-0 h-1"
            style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}` }}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7 md:p-8">
          <div className="pr-10">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color }}>
              {seriesLabels[character.series as keyof typeof seriesLabels] || character.series}
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase leading-none tracking-tight text-white sm:text-4xl">
              {displayName}
            </h2>
            {activeCharacter.pseudonym && (
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-white/45">
                „{activeCharacter.pseudonym}”
              </p>
            )}
          </div>

          {variants.length > 1 && (
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.025] p-2">
              <div className="flex items-center justify-between px-2 pb-2">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
                  Wersje postaci
                </span>
                <span className="font-mono text-[10px] text-white/30">
                  {variants.findIndex((variant) => variant.id === activeCharacter.id) + 1}/{variants.length}
                </span>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {variants.map((variant, index) => {
                  const isActive = variant.id === activeCharacter.id;
                  const variantRole = showSpoilers && variant.hiddenRole
                    ? variant.hiddenRole
                    : variant.role;
                  const variantAvatar = showSpoilers && variant.hiddenAvatar
                    ? variant.hiddenAvatar
                    : variant.avatar;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setActiveVariantId(variant.id)}
                      className={`flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
                        isActive
                          ? "border-white/20 bg-white/10"
                          : "border-transparent bg-black/10 hover:border-white/10 hover:bg-white/[0.05]"
                      }`}
                    >
                      {variantAvatar ? (
                        <img
                          src={assetPath(variantAvatar)}
                          alt=""
                          className="h-9 w-8 shrink-0 rounded-md object-cover opacity-90"
                        />
                      ) : (
                        <span className="flex h-9 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 font-mono text-[10px] text-white/45">
                          {index + 1}
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-white/85">
                          {variantRole || `Wariant ${index + 1}`}
                        </span>
                        <span className="mt-0.5 block truncate font-mono text-[9px] uppercase tracking-[0.1em] text-white/30">
                          {variant.debut || "Nieznany debiut"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoItem label="Rola" value={displayRole || "Brak danych"} color={color} />
            {activeCharacter.hiddenRole && (
              <InfoItem label="Ukryta rola" value={activeCharacter.hiddenRole} color="#c084fc" />
            )}
            <InfoItem label="Debiut" value={activeCharacter.debut || "Nieznany"} color={color} icon={<Calendar size={14} />} />
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-rose-300/70">
                  Wystąpienia
                </p>
                <h3 className="mt-1 text-xl font-semibold text-white">Książki z postacią</h3>
              </div>
              <span className="font-mono text-xs text-white/35">{appearanceBooks.length}</span>
            </div>

            {appearanceBooks.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {appearanceBooks.map(({ book }) => (
                  <button
                    key={`${activeCharacter.id}-${book.id}`}
                    type="button"
                    onClick={() => onSelectBook?.(book.id)}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-2.5 text-left transition hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    <img src={assetPath(book.cover)} alt="" className="h-16 w-11 shrink-0 rounded-md object-cover opacity-90" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white/90">{book.title}</p>
                    </div>
                    <ChevronRight size={15} className="shrink-0 text-white/25 transition group-hover:text-rose-300" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-white/10 p-4 text-sm text-white/40">
                <BookOpen size={17} /> Brak przypisanych wystąpień.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoItem({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string;
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3">
      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">{label}</p>
      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold" style={{ color }}>
        {icon}
        {value}
      </p>
    </div>
  );
}
