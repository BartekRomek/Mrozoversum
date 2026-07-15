"use client";

import { useMemo, useState, useEffect, type ReactNode } from "react";
import { X, User, Calendar, BookOpen, Tag, AlertTriangle } from "lucide-react";
import { relationColors, relationLabels, seriesColors, seriesLabels } from "@/lib/catalog";
import type { Book, BookConnection, Character } from "@/lib/types";
import { CharacterCard } from "@/components/CharacterCard";
import charactersData from "@/data/characters.json";
import { appearancesData } from "@/data/appearances";

type BookDetailsPanelProps = {
  book: Book | null;
  books: Book[];
  connections: BookConnection[];
  onClose: () => void;
  onSelectBook: (bookId: string) => void;
  onSelectConnection: (connectionId: string) => void;
  onUpdateCover: (bookId: string, cover: string) => void;
};

const getBackgroundUrl = (coverPath: string) => {
  if (!coverPath) return "";
  const filename = coverPath.split("/").pop();
  return `/background/${filename}`;
};

const seriesGenres: Record<string, string> = {
  Chylka: "Thriller prawniczy",
  Forst: "Kryminał górski",
  Langer: "Thriller psychologiczny",
  Wladza: "Thriller polityczny",
  Behawiorysta: "Thriller psychologiczny",
  Zaorski: "Kryminał obyczajowy"
};

export function BookDetailsPanel({
  book,
  books,
  connections,
  onClose,
  onSelectConnection
}: BookDetailsPanelProps) {
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    setShowSpoilers(false);
    setShowWarningModal(false);
  }, [book?.id]);

  const relatedCharacters = useMemo(() => {
    if (!book) return [];

    const chars = appearancesData
      .filter((a) => a.bookId === book.id)
      .map((appearance) => {
        const char = charactersData.find((c) => c.id === appearance.characterId) as Character | undefined;
        if (!char) return null;

        const isAntagonistInThisBook = appearance.role === "antagonist";
        const isDeadInThisBook = (appearance as any).isDead === true;
        const hiddenIdentityInThisBook = (appearance as any).hiddenIdentity;
        const hiddenName = (char as any).hiddenName;
        const hiddenRole = (char as any).hiddenRole;
        const hiddenPseudonym = (char as any).hiddenPseudonym;
        const hiddenAvatar = (char as any).hiddenAvatar;

        const canSwitch = !!hiddenIdentityInThisBook || (isAntagonistInThisBook && (
          !!hiddenName || !!hiddenRole || !!hiddenPseudonym || !!hiddenAvatar
        ));

        return {
          ...char,
          isNew: appearance.isNew || false,
          isAntagonist: isAntagonistInThisBook,
          isDead: isDeadInThisBook,
          hiddenIdentity: hiddenIdentityInThisBook,
          hiddenName,
          hiddenRole,
          hiddenPseudonym,
          hiddenAvatar,
          canSwitch
        };
      })
      .filter(Boolean) as (Character & {
        isNew: boolean;
        isAntagonist: boolean;
        isDead: boolean;
        canSwitch: boolean;
        hiddenIdentity?: string | boolean;
        hiddenName?: string;
        hiddenRole?: string;
        hiddenPseudonym?: string;
        hiddenAvatar?: string;
      })[];

    return chars;
  }, [book]);

  const backgroundUrl = book ? getBackgroundUrl(book.cover) : "";
  const brandColor = book ? seriesColors[book.series] || "#e11d48" : "#e11d48";

  const relatedConnections = useMemo(() => {
    if (!book) return [];

    return connections
      .filter((connection) => connection.source === book.id || connection.target === book.id)
      .slice(0, 6);
  }, [book, connections]);

  const handleToggleSpoilers = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (showSpoilers) {
      setShowSpoilers(false);
    } else {
      setShowWarningModal(true);
    }
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-[735px] max-w-[100vw] border-l border-white/10 shadow-2xl shadow-black/80 transition-transform duration-500 ${
          book ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {book ? (
          <div className="relative h-full overflow-y-auto bg-[#08090d]">
            <div className="absolute top-0 left-0 right-0 h-[620px] pointer-events-none z-0 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-top blur-[12px] scale-105 opacity-32 transition-all duration-700"
                style={{ backgroundImage: `url(${backgroundUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#08090d]/72 to-[#08090d]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#08090d] via-[#08090d]/62 to-transparent" />
              <div
                className="absolute inset-0 opacity-25"
                style={{ background: `radial-gradient(circle at 22% 18%, ${brandColor}55, transparent 34%)` }}
              />
            </div>

            <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#08090d]/38 px-8 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <span
                  className="h-9 w-1 rounded-full"
                  style={{
                    backgroundColor: brandColor,
                    boxShadow: `0 0 16px ${brandColor}99`
                  }}
                />
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-white/38">
                    Karta książki
                  </p>
                  <p className="text-xs font-medium text-white/55">
                    {seriesLabels[book.series]}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative z-10 flex min-h-full flex-col px-8 pb-12 pt-8">
              <div className="pr-4">
                <p
                  className="text-[10px] uppercase tracking-[0.22em] font-bold drop-shadow-md"
                  style={{ color: brandColor }}
                >
                  {seriesLabels[book.series]}
                </p>
                <h2 className="mt-2 text-[42px] leading-tight font-bold text-white tracking-tight drop-shadow-lg">
                  {book.title}
                </h2>

                <div className="mt-5 flex flex-wrap gap-3 text-[13px] text-white/72 font-medium">
                  <MetaItem icon={<User size={14} />} label="Seria" value={seriesLabels[book.series]} />
                  <MetaItem icon={<Calendar size={14} />} label="Rok" value={book.year ?? "---"} />
                  <MetaItem icon={<BookOpen size={14} />} label="Tom" value={book.volume ?? book.order ?? "—"} />
                  <MetaItem
                    icon={<Tag size={14} />}
                    label="Gatunek"
                    value={book.genre ?? seriesGenres[book.series] ?? "Nie określono"}
                    />
                </div>
              </div>

              <div className="mt-10 grid grid-cols-[180px_1fr] gap-8">
                <div className="w-[180px]">
                  <div
                    className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border bg-black/40 shadow-[0_16px_50px_rgba(0,0,0,0.62)]"
                    style={{ borderColor: `${brandColor}55` }}
                  >
                    <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
                    <div
                      className="absolute inset-x-0 top-0 h-1"
                      style={{ backgroundColor: brandColor }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-7 shadow-xl shadow-black/45 backdrop-blur-xl">
                  <h3
                    className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: brandColor }}
                  >
                    Opis
                  </h3>
                  <p className="text-[14px] font-normal leading-loose text-white/78">
                    {book.description}
                  </p>
                </div>
              </div>

              {relatedConnections.length > 0 && (
                <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/42">
                    Wzajemne powiązania
                  </h3>
                  <div className="grid gap-2">
                    {relatedConnections.map((connection) => {
                      const targetId = connection.source === book.id ? connection.target : connection.source;
                      const target = books.find((item) => item.id === targetId);
                      const connectionId = `${connection.source}-${connection.target}-${connection.type}`;
                      const relationColor = relationColors[connection.type] ?? "#e11d48";
                      const relationLabel = relationLabels[connection.type] ?? connection.type.replace("_", " ");

                      if (!target) return null;

                      return (
                        <button
                          key={connectionId}
                          onClick={() => onSelectConnection(connectionId)}
                          className="group flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-4 py-3 text-left transition hover:border-white/16 hover:bg-white/[0.05]"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white/86 transition group-hover:text-white">
                              {target.title}
                            </p>
                            <p
                              className="mt-1 text-[11px] uppercase tracking-[0.16em]"
                              style={{ color: relationColor }}
                            >
                              {relationLabel}
                            </p>
                          </div>

                          <span
                            className="h-2 w-8 rounded-full transition group-hover:w-10"
                            style={{
                              backgroundColor: relationColor,
                              boxShadow: `0 0 14px ${relationColor}66`
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="mt-8">
                <div className="mb-5 flex items-center justify-between border-b border-white/8 pb-3">
                  <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-white/50 drop-shadow-md">
                    Postacie ({relatedCharacters.length})
                  </h3>

                  <label className="group flex cursor-pointer items-center gap-2.5">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                      showSpoilers ? "text-rose-400 drop-shadow-[0_0_8px_rgba(225,29,72,0.45)]" : "text-white/40 group-hover:text-white/60"
                    }`}>
                      Odkryj prawdę
                    </span>
                    <div className={`relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer items-center rounded-full border border-white/10 transition-colors duration-300 ease-in-out focus:outline-none ${
                      showSpoilers ? "bg-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.35)]" : "bg-white/10"
                    }`}>
                      <span className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition duration-300 ease-in-out ${
                        showSpoilers ? "translate-x-[20px]" : "translate-x-[2px]"
                      }`} />
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={showSpoilers}
                        onChange={handleToggleSpoilers}
                      />
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-5 auto-rows-min">
                  {relatedCharacters.map((char) => (
                    <CharacterCard
                      key={char.id}
                      character={char}
                      showSpoilers={showSpoilers}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : null}
      </aside>

      {showWarningModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#090a0f] p-6 text-center shadow-[0_0_40px_rgba(225,29,72,0.2)] animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.3)]">
              <AlertTriangle size={28} />
            </div>

            <h3 className="mb-3 text-xl font-bold text-white">
              Czy chcesz odkryć prawdę?
            </h3>

            <p className="mb-8 px-2 text-sm leading-relaxed text-white/60">
              Odkrycie prawdy łączy się ze spoilerem tej książki lub całej serii.
              Jeżeli chcesz tego uniknąć, nie odkrywaj prawdy.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-1/2 rounded-lg border border-white/10 px-6 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                Nie
              </button>
              <button
                onClick={() => {
                  setShowSpoilers(true);
                  setShowWarningModal(false);
                }}
                className="w-1/2 rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-colors hover:bg-rose-500"
              >
                Tak
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MetaItem({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-black/18 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <span className="text-white/38">{icon}</span>
      <span className="text-white/35">{label}:</span>
      <span className="text-white/76">{value}</span>
    </div>
  );
}