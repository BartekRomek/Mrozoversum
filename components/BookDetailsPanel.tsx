"use client";

import { useEffect, useState } from "react";
import { BookOpen, Link2, ShieldCheck, X } from "lucide-react";
import { relationColors, relationLabels, seriesLabels } from "@/lib/catalog";
import type { Book, BookConnection } from "@/lib/types";

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
              <p className="text-xs uppercase tracking-[0.2em] text-white/42">
                Karta książki
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white">{book.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Zamknij panel"
              className="grid h-9 w-9 place-items-center border border-white/10 bg-white/[0.04] text-white/70 transition hover:text-white"
              style={{ borderRadius: 8 }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="grid grid-cols-[128px_1fr] gap-4">
              <div
                className="relative h-[184px] overflow-hidden border border-white/10 bg-[#141620]"
                style={{ borderRadius: 8 }}
              >
                <img
                  src={book.cover}
                  alt={`Okładka: ${book.title}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <strong className="absolute bottom-3 left-3 right-3 text-sm leading-tight text-white">
                  {book.title}
                </strong>
              </div>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="flex items-center gap-2 text-white/40">
                    <BookOpen size={15} />
                    Seria
                  </dt>
                  <dd className="mt-1 font-medium text-white">
                    {seriesLabels[book.series]}
                  </dd>
                </div>
                <div>
                  <dt className="text-white/40">Rok na osi</dt>
                  <dd className="mt-1 font-mono text-white">{book.year ?? "brak"}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-white/40">
                    <ShieldCheck size={15} />
                    Pewność danych
                  </dt>
                  <dd className="mt-2">
                    <div className="h-2 overflow-hidden bg-white/10" style={{ borderRadius: 8 }}>
                      <div
                        className="h-full bg-rose-500"
                        style={{ width: `${book.certainty}%` }}
                      />
                    </div>
                    <span className="mt-1 block text-xs text-white/60">
                      {book.certainty}%
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <section className="mt-6 border border-white/10 bg-white/[0.035] p-3" style={{ borderRadius: 8 }}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/44">
                Okładka karty
              </h3>
              <div className="mt-3 flex gap-2">
                <input
                  value={coverDraft}
                  onChange={(event) => setCoverDraft(event.target.value)}
                  placeholder="/covers/kasacja.jpg lub https://..."
                  className="min-w-0 flex-1 border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-rose-400/70"
                  style={{ borderRadius: 8 }}
                />
                <button
                  type="button"
                  onClick={() => onUpdateCover(book.id, coverDraft)}
                  className="border border-rose-300/30 bg-rose-500/18 px-3 text-sm font-medium text-rose-50 transition hover:bg-rose-500/28"
                  style={{ borderRadius: 8 }}
                >
                  Zastosuj
                </button>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/42">
                Pusta wartość przywraca okładkę z pliku JSON.
              </p>
            </section>

            <section className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/44">
                Opis
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/72">{book.description}</p>
            </section>

            <section className="mt-7">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/44">
                  Powiązane książki
                </h3>
                <span className="text-xs text-white/40">{relatedConnections.length}</span>
              </div>

              <div className="mt-3 space-y-2">
                {relatedConnections.length ? (
                  relatedConnections.map((connection) => {
                    const relatedId =
                      connection.source === book.id ? connection.target : connection.source;
                    const relatedBook = findBook(relatedId);

                    if (!relatedBook) {
                      return null;
                    }

                    return (
                      <button
                        key={`${connection.source}-${connection.target}`}
                        type="button"
                        onClick={() => onSelectBook(relatedBook.id)}
                        className="w-full border border-white/10 bg-white/[0.035] p-3 text-left transition hover:border-white/20 hover:bg-white/[0.06]"
                        style={{ borderRadius: 8 }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-white">{relatedBook.title}</p>
                            <p className="mt-1 text-xs text-white/45">
                              {seriesLabels[relatedBook.series]}
                            </p>
                          </div>
                          <span
                            className="shrink-0 border px-2 py-1 text-[11px]"
                            style={{
                              borderRadius: 6,
                              borderColor: `${relationColors[connection.type]}66`,
                              color: relationColors[connection.type]
                            }}
                          >
                            {relationLabels[connection.type]}
                          </span>
                        </div>
                        {connection.note ? (
                          <p className="mt-2 flex gap-2 text-xs leading-5 text-white/50">
                            <Link2 size={13} className="mt-0.5 shrink-0" />
                            {connection.note}
                          </p>
                        ) : null}
                      </button>
                    );
                  })
                ) : (
                  <p className="border border-dashed border-white/12 p-4 text-sm text-white/45" style={{ borderRadius: 8 }}>
                    Brak powiązań w aktualnym zestawie danych.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
