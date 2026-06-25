import connections from "@/data/connections.json";
import books from "@/data/books.json";
import characters from "@/data/characters.json"; // Dodaj import
import { MrozoversumMap } from "@/components/MrozoversumMap";
import type { Book, BookConnection, Character } from "@/lib/types";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <MrozoversumMap
        books={books as Book[]}
        connections={connections as BookConnection[]}
        characters={characters as Character[]} // Przekaż postacie
      />
    </main>
  );
}