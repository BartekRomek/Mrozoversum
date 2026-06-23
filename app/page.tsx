import connections from "@/data/connections.json";
import books from "@/data/books.json";
import { MrozoversumMap } from "@/components/MrozoversumMap";
import type { Book, BookConnection } from "@/lib/types";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <MrozoversumMap
        books={books as Book[]}
        connections={connections as BookConnection[]}
      />
    </main>
  );
}
