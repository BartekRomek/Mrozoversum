"use client";

import { useEffect, useState, useMemo } from "react";
import { BookOpen, Link2, ShieldCheck, X, Users } from "lucide-react";
import { relationColors, relationLabels, seriesLabels } from "@/lib/catalog";
import type { Book, BookConnection, Character } from "@/lib/types";
import { CharacterCard } from "@/components/CharacterCard";

// Importujemy dane bezpośrednio tutaj dla wygody - lub przekaż je jako propsy z page.tsx
import charactersData from "@/data/characters.json";
import appearancesData from "@/data/appearances.json";

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
  const [coverDraft, setCoverDraft] = useState("");

  useEffect(() => {
    setCoverDraft(book?.cover ?? "");
  }, [book?.cover]);

  // Logika filtrowania postaci dla danej książki
  const relatedCharacters = useMemo(() => {
    if (!book) return [];
    // Znajdź IDs postaci, które występują w tej książce
    const appearanceIds = appearancesData
      .filter((a) => a.bookId === book.id)
      .map((a) => a.characterId);
    
    // Zwróć pełne obiekty postaci
    return charactersData.filter((c) => appearanceIds.includes(c.id)) as Character[];
  }, [book]);

  const relatedConnections = book
    ? connections.filter(
        (connection) => connection.source === book.id || connection.target === book.id
      )
    : [];

  const findBook = (bookId: string) => books.find((item) => item.id === bookId);

  return (
    <aside
      className={`fixed inset-y-0 right-0 z-30 w-full max-w-[420px] border-l border-white/10 bg-[#090a0f]/96 shadow-2xl shadow-black/60 backdrop-blur-xl transition-transform duration-300 ${
        book ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {book ? (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/42">Karta książki</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{book.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center border border-white/10 bg-white/[0.04] text-white/70 hover:text-white"
              style={{ borderRadius: 8 }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            {/* OKŁADKA I DANE */}
            <div className="grid grid-cols-[128px_1fr] gap-4">
              <div className="relative h-[184px] overflow-hidden border border-white/10 bg-[#141620]" style={{ borderRadius: 8 }}>
                <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
              </div>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-white/40">Seria</dt>
                  <dd className="font-medium text-white">{seriesLabels[book.series]}</dd>
                </div>
                <div>
                  <dt className="text-white/40">Rok</dt>
                  <dd className="font-mono text-white">{book.year ?? "brak"}</dd>
                </div>
              </dl>
            </div>

            {/* OPIS */}
            <section className="mt-6">
              <h3 className="text-sm font-semibold uppercase text-white/44">Opis</h3>
              <p className="mt-3 text-sm leading-6 text-white/72">{book.description}</p>
            </section>

            {/* POSTACIE */}
            <section className="mt-7">
              <h3 className="text-sm font-semibold uppercase text-white/44 mb-3 flex items-center gap-2">
                <Users size={15} /> Postacie
              </h3>
              <div className="space-y-2">
                {relatedCharacters.map((char) => (
                  <CharacterCard key={char.id} character={char} />
                ))}
              </div>
            </section>

            {/* POWIĄZANE KSIĄŻKI */}
            <section className="mt-7">
              <h3 className="text-sm font-semibold uppercase text-white/44">Powiązane</h3>
              {relatedConnections.map((conn) => {
                const b = findBook(conn.source === book.id ? conn.target : conn.source);
                return b ? <div key={b.id} className="mt-2 text-white/60 text-sm">{b.title}</div> : null;
              })}
            </section>
          </div>
        </div>
      ) : null}
    </aside>
  );
}