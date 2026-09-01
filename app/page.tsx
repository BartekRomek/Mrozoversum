"use client";

import { useState } from "react";
import connections from "@/data/connections.json";
import books from "@/data/books.json";
import characters from "@/data/characters.json"; // Dodaj import
import { MrozoversumMap } from "@/components/MrozoversumMap";
import { MrozoversumIntro } from "@/components/MrozoversumIntro";
import type { Book, BookConnection, Character } from "@/lib/types";

export default function Home() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="mrozoversum-map-enter">
        <MrozoversumMap
          books={books as Book[]}
          connections={connections as BookConnection[]}
          characters={characters as Character[]} // Przekaż postacie
          introComplete={isIntroComplete}
        />
      </div>
      <MrozoversumIntro onComplete={() => setIsIntroComplete(true)} />
    </main>
  );
}
