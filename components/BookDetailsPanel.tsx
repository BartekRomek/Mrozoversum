"use client";

import { useMemo } from "react";
import { X, Users, User, Calendar, BookOpen, Tag } from "lucide-react";
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

const getBackgroundUrl = (coverPath: string) => {
  if (!coverPath) return "";
  const filename = coverPath.split("/").pop(); 
  return `/background/${filename}`;
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
    return appearancesData
      .filter((a) => a.bookId === book.id)
      .map((appearance) => {
        const char = charactersData.find((c) => c.id === appearance.characterId);
        return char ? { 
          ...char, 
          isNew: appearance.isNew || false,
          isAntagonist: appearance.role === "antagonist" 
        } : null;
      })
      .filter((char): char is Character & { isNew: boolean; isAntagonist: boolean } => !!char);
  }, [book]);

  const backgroundUrl = book ? getBackgroundUrl(book.cover) : "";

  return (
    <aside
      // IDEALNA STAŁA SZEROKOŚĆ Z MACBOOKA: w-[735px]
      className={`fixed inset-y-0 right-0 z-30 w-[735px] max-w-[100vw] border-l border-white/10 shadow-2xl shadow-black/80 transition-transform duration-500 ${
        book ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {book ? (
        <div className="relative h-full bg-[#090a0f] overflow-y-auto">
          
          <button 
            onClick={onClose} 
            className="fixed top-8 right-8 z-50 p-2 rounded-xl bg-black/20 border border-white/10 text-white/50 hover:text-white backdrop-blur-md transition-all hover:bg-white/10"
          >
            <X size={20} />
          </button>

          <div className="absolute top-0 left-0 right-0 h-[700px] pointer-events-none z-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-top blur-[10px] scale-105 opacity-40 transition-all duration-700"
              style={{ backgroundImage: `url(${backgroundUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090a0f]/60 to-[#090a0f]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090a0f] via-[#090a0f]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#090a0f] to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col min-h-full px-8 pt-8 pb-12">
            
            <div className="pr-16">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#ff7300] font-bold drop-shadow-md">Karta książki</p>
                <h2 className="mt-1 text-[40px] leading-tight font-bold text-white tracking-tight drop-shadow-lg">{book.title}</h2>
              </div>

              <div className="mt-4 flex flex-wrap gap-5 text-[13px] text-white/70 font-medium">
                <div className="flex items-center gap-1.5 drop-shadow-md">
                  <User size={14} className="text-white/40" />
                  <span className="text-white/40">Seria:</span> {seriesLabels[book.series]}
                </div>
                <div className="flex items-center gap-1.5 drop-shadow-md">
                  <Calendar size={14} className="text-white/40" />
                  {book.year ?? "---"}
                </div>
                <div className="flex items-center gap-1.5 drop-shadow-md">
                  <BookOpen size={14} className="text-white/40" />
                  <span className="text-white/40">Tom</span> {book.volume ?? "1"}
                </div>
                <div className="flex items-center gap-1.5 drop-shadow-md">
                  <Tag size={14} className="text-white/40" />
                  {book.genre ?? "Thriller prawniczy"}
                </div>
              </div>
            </div>

            <div className="flex gap-8 mt-10 items-center">
              
              <div className="w-[180px] flex-shrink-0">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/15 bg-black/40 shadow-[0_12px_40px_rgb(0,0,0,0.6)]">
                  <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
                </div>
              </div>
              
              <div className="flex-grow rounded-2xl border border-white/5 bg-white/[0.04] backdrop-blur-xl p-7 shadow-xl shadow-black/50">
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#ff7300]">Opis</h3>
                <p className="text-white/80 leading-loose text-[14px] font-normal">{book.description}</p>
              </div>
            </div>

            <section className="mt-8">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/5">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-2 drop-shadow-md">
                  Postacie ({relatedCharacters.length})
                </h3>
              </div>
              
              {/* Twarde 3 kolumny, idealne pod 735px szerokości panelu */}
              <div className="grid grid-cols-3 gap-5 auto-rows-min">
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