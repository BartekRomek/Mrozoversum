"use client";

import { useMemo, useState, useEffect } from "react";
import { X, Users, User, Calendar, BookOpen, Tag, AlertTriangle } from "lucide-react";
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
        // Wymuszamy typ od razu przy szukaniu, żeby uniknąć konfliktów z JSON
        const char = charactersData.find((c) => c.id === appearance.characterId) as Character | undefined;
        if (!char) return null;

        const isAntagonistInThisBook = appearance.role === "antagonist";
        
        // Pobieramy informację o śmierci bezpośrednio z relacji książka-postać (appearances), 
        // a nie globalnego pliku postaci. Rzutujemy na "any" na wypadek gdyby 
        // typ w appearancesData jeszcze nie miał oficjalnie pola isDead.
        const isDeadInThisBook = (appearance as any).isDead === true;

        const canSwitch = !!char.hiddenRole && isAntagonistInThisBook;

        return { 
          ...char, 
          isNew: appearance.isNew || false,
          isAntagonist: isAntagonistInThisBook,
          isDead: isDeadInThisBook, // <-- UPEWNIJ SIĘ, ŻE TO TU JEST
          canSwitch 
        };
      })
      // Czyste rzutowanie odrzucające wszystkie wartości null z uwzględnieniem isDead
      .filter(Boolean) as (Character & { isNew: boolean; isAntagonist: boolean; isDead: boolean; canSwitch: boolean })[];

    return chars;
  }, [book]);

  const backgroundUrl = book ? getBackgroundUrl(book.cover) : "";

  const handleToggleSpoilers = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); 
    if (showSpoilers) {
      setShowSpoilers(false);
    } else {
      setShowWarningModal(true);
    }
  };

  return (
    <>
      <aside
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
                  
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                      showSpoilers ? "text-rose-500 drop-shadow-[0_0_8px_rgba(225,29,72,0.5)]" : "text-white/40 group-hover:text-white/60"
                    }`}>
                      Odkryj prawdę
                    </span>
                    <div className={`relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                      showSpoilers ? "bg-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.4)]" : "bg-white/10"
                    }`}>
                      <span className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${
                        showSpoilers ? "translate-x-[20px]" : "translate-x-0"
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
                      canSwitch={char.canSwitch} 
                    />
                  ))}
                </div>
              </section>
              
            </div>
          </div>
        ) : null}
      </aside>

      {/* MODAL OSTRZEGAWCZY */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#090a0f] border border-rose-500/30 rounded-2xl shadow-[0_0_40px_rgba(225,29,72,0.2)] max-w-md w-full p-6 text-center transform transition-all animate-in fade-in zoom-in-95 duration-200">
            
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-5 shadow-[0_0_15px_rgba(225,29,72,0.3)]">
              <AlertTriangle size={28} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">
              Czy chcesz odkryć prawdę?
            </h3>
            
            <p className="text-sm text-white/60 leading-relaxed mb-8 px-2">
              Odkrycie prawdy łączy się ze spoilerem tej książki lub całej serii. 
              Jeżeli chcesz tego uniknąć, nie odkrywaj prawdy.
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowWarningModal(false)}
                className="px-6 py-2.5 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-colors font-semibold text-sm w-1/2"
              >
                Nie
              </button>
              <button
                onClick={() => {
                  setShowSpoilers(true);
                  setShowWarningModal(false);
                }}
                className="px-6 py-2.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.4)] font-semibold text-sm w-1/2"
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