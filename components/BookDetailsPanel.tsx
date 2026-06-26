"use client";

import { useEffect, useState, useMemo } from "react";
import { X, Users } from "lucide-react";
import { seriesLabels } from "@/lib/catalog";
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
  onUpdateCover: (bookId: string, cover: string) => void;
};

export function BookDetailsPanel({
  book,
  books,
  connections,
  onClose,
  onSelectBook,
  onUpdateCover
}: BookDetailsPanelProps) {
  
  const relatedCharacters = useMemo(() => {
    if (!book) return [];
    const appearanceIds = appearancesData
      .filter((a) => a.bookId === book.id)
      .map((a) => a.characterId);
    return charactersData.filter((c) => appearanceIds.includes(c.id)) as Character[];
  }, [book]);

  const relatedConnections = book
    ? connections.filter((connection) => connection.source === book.id || connection.target === book.id)
    : [];

  const findBook = (bookId: string) => books.find((item) => item.id === bookId);

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-30 w-1/2 min-w-[520px] max-w-[960px] border-l border-white/10 bg-[#090a0f]/96 shadow-2xl shadow-black/60 backdrop-blur-xl transition-transform duration-300 ${
        book ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {book ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/42">Karta książki</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{book.title}</h2>
            </div>
            <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center border border-white/10 bg-white/[0.04] text-white/70 hover:text-white" style={{ borderRadius: 8 }}>
              <X size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-[128px_1fr] gap-6">
              {/* Okładka */}
              <div className="relative h-[184px] overflow-hidden border border-white/10 bg-[#141620]" style={{ borderRadius: 8 }}>
                <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
              </div>
              
              {/* Układ: Dane (lewo) | Opis (prawo) */}
              <div className="grid grid-cols-[auto_1fr] gap-8">
                {/* Seria i Rok */}
                <dl className="flex flex-col gap-4 text-sm whitespace-nowrap">
                  <div>
                    <dt className="text-white/40">Seria</dt>
                    <dd className="font-medium text-white">{seriesLabels[book.series]}</dd>
                  </div>
                  <div>
                    <dt className="text-white/40">Rok</dt>
                    <dd className="font-mono text-white">{book.year ?? "brak"}</dd>
                  </div>
                </dl>

                {/* Opis */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/80">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/40">Opis</h3>
                  {book.description}
                </div>
              </div>
            </div>

            {/* Postacie */}
            <section className="mt-9">
              <h3 className="text-sm font-semibold uppercase text-white/44 mb-4 flex items-center gap-2">
                <Users size={15} /> Postacie ({relatedCharacters.length})
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {relatedCharacters.map((char) => (
                  <CharacterCard key={char.id} character={char} />
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </aside>
  );
}