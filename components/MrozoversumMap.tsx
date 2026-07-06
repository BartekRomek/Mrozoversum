"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useViewport,
  Handle,
  Position,
  type Edge,
  type Node,
  type EdgeMouseHandler,
  type NodeMouseHandler
} from "@xyflow/react";
import { BookMarked, GitBranch, Network, X } from "lucide-react";
import { clsx } from "clsx"; // Dodano import clsx dla przycisku
import { BookNode } from "@/components/BookNode";
import { BookDetailsPanel } from "@/components/BookDetailsPanel";
import { FilterBar } from "@/components/FilterBar";
import { CharacterCard } from "@/components/CharacterCard";
import {
  relationColors,
  seriesColors,
  seriesLabels,
  seriesOrder
} from "@/lib/catalog";
import type { Book, BookConnection, BookNodeData, RelationType, SeriesId, Character } from "@/lib/types";

type MrozoversumMapProps = {
  books: Book[];
  connections: BookConnection[];
  characters?: Character[]; 
};

function AxisPointNode() {
  return (
    <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(225,29,72,0.9)] transform -translate-x-1/2 -translate-y-1/2">
      <Handle type="target" position={Position.Top} id="target-top" className="opacity-0" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="opacity-0" />
    </div>
  );
}

const nodeTypes = {
  book: BookNode,
  axisPoint: AxisPointNode
};

// ZAKTUALIZOWANO: Dodano oś W kręgach władzy (-720 to powyżej Forsta, który ma -360)
const rowY: Record<SeriesId, number> = {
  Wladza: -720,
  Forst: -360,
  Chylka: 0,
  Langer: 340,
  Behawiorysta: -1080,
  Zaorski: 690
};

// DODANO OBSŁUGĘ epizod - określ rodzaj przerywania linii (np. kropkowana)
const relationDash: Record<RelationType, string | undefined> = {
  kontynuacja: "6 6", 
  wzmianka: "3 7",
  crossover: undefined,
  epizod: "2 4" // Dodane
};

function TimelineLines() {
  const { x, y, zoom } = useViewport();
  const offset = 150; 

  return (
    <svg className="absolute inset-0 pointer-events-none z-0 w-full h-full overflow-visible">
      <g transform={`translate(${x}, ${y}) scale(${zoom})`}>
        {/* ZAKTUALIZOWANO: Dodano linię dla Władzy */}
        <line x1="-50000" y1={rowY.Wladza + offset} x2="50000" y2={rowY.Wladza + offset} stroke="rgba(225, 29, 72, 0.25)" strokeWidth="1.5" />
        <line x1="-50000" y1={rowY.Forst + offset} x2="50000" y2={rowY.Forst + offset} stroke="rgba(225, 29, 72, 0.25)" strokeWidth="1.5" />
        <line x1="-50000" y1={rowY.Chylka + offset} x2="50000" y2={rowY.Chylka + offset} stroke="rgba(225, 29, 72, 0.25)" strokeWidth="1.5" />
        <line x1="-50000" y1={rowY.Langer + offset} x2="50000" y2={rowY.Langer + offset} stroke="rgba(225, 29, 72, 0.25)" strokeWidth="1.5" />
      </g>

      {/* ZAKTUALIZOWANO: Dodano napis dla Władzy */}
      <text x="24" y={(rowY.Wladza + offset) * zoom + y - 8} fill="rgba(225, 29, 72, 0.9)" fontSize="13" fontWeight="800" letterSpacing="3" className="font-mono">W KRĘGACH WŁADZY</text>
      <text x="24" y={(rowY.Forst + offset) * zoom + y - 8} fill="rgba(225, 29, 72, 0.9)" fontSize="13" fontWeight="800" letterSpacing="3" className="font-mono">FORST</text>
      <text x="24" y={(rowY.Chylka + offset) * zoom + y - 8} fill="rgba(225, 29, 72, 0.9)" fontSize="13" fontWeight="800" letterSpacing="3" className="font-mono">CHYŁKA</text>
      <text x="24" y={(rowY.Langer + offset) * zoom + y - 8} fill="rgba(225, 29, 72, 0.9)" fontSize="13" fontWeight="800" letterSpacing="3" className="font-mono">LANGER</text>
    </svg>
  );
}

export function MrozoversumMap({ books, connections, characters = [] }: MrozoversumMapProps) {
  const [query, setQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<SeriesId[]>(seriesOrder);
  
  const [selectedRelations, setSelectedRelations] = useState<RelationType[]>([
    "kontynuacja",
    "wzmianka",
    "crossover",
    "epizod"
  ]);
  
  const [selectedBookId, setSelectedBookId] = useState<string | null>("kasacja");
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [coverOverrides, setCoverOverrides] = useState<Record<string, string>>({});
  
  // DODANO: Stan dla przełącznika spoilerów
  const [showSpoilers, setShowSpoilers] = useState(false);

  useEffect(() => {
    const storedCovers = window.localStorage.getItem("mrozoversum-cover-overrides");
    if (storedCovers) {
      setCoverOverrides(JSON.parse(storedCovers) as Record<string, string>);
    }
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const displayBooks = useMemo(
    () =>
      books.map((book) => ({
        ...book,
        cover: coverOverrides[book.id] || book.cover
      })),
    [books, coverOverrides]
  );

  const bookById = useMemo(
    () => new Map(displayBooks.map((book) => [book.id, book])),
    [displayBooks]
  );

  const filteredBookIds = useMemo(() => {
    return new Set(
      displayBooks
        .filter((book) => {
          const matchesSeries = selectedSeries.includes(book.series);
          const matchesQuery =
            !normalizedQuery ||
            `${book.title} ${book.series} ${book.description}`
              .toLowerCase()
              .includes(normalizedQuery);

          return matchesSeries && matchesQuery;
        })
        .map((book) => book.id)
    );
  }, [displayBooks, normalizedQuery, selectedSeries]);

  const visibleConnections = useMemo(
    () =>
      connections.filter(
        (connection) =>
          selectedRelations.includes(connection.type) &&
          filteredBookIds.has(connection.source) &&
          filteredBookIds.has(connection.target)
      ),
    [connections, filteredBookIds, selectedRelations]
  );

  const connectedToSelected = useMemo(() => {
    if (!selectedBookId) return new Set<string>();

    const related = new Set<string>([selectedBookId]);
    for (const connection of connections) {
      if (connection.source === selectedBookId) related.add(connection.target);
      if (connection.target === selectedBookId) related.add(connection.source);
    }
    return related;
  }, [connections, selectedBookId]);

  const nodes: Node<BookNodeData>[] = useMemo(() => {
    const groupedBySeries = new Map<SeriesId, Book[]>();

    for (const book of displayBooks.filter((item) => filteredBookIds.has(item.id))) {
      const items = groupedBySeries.get(book.series) ?? [];
      items.push(book);
      groupedBySeries.set(book.series, items);
    }

    const xPositions = new Map<string, number>();

    for (const [series, seriesBooks] of groupedBySeries) {
      let lastX = Number.NEGATIVE_INFINITY;

      for (const book of [...seriesBooks].sort((left, right) => {
        const leftTimeline = left.timeline ?? left.order;
        const rightTimeline = right.timeline ?? right.order;
        return leftTimeline - rightTimeline;
      })) {
        const timelineSlot = book.timeline ?? book.order;
        const baseX = (timelineSlot - 1) * 245;
        const x = Math.max(baseX, lastX + 188);

        xPositions.set(book.id, x);
        lastX = x;
      }
    }

    return displayBooks
      .filter((book) => filteredBookIds.has(book.id))
      .map((book) => {
        const isAxis = book.id.includes("axis");
        
        let finalX = xPositions.get(book.id) ?? 0;
        
        if (isAxis) {
          const parentBookId = book.id.split("-axis-")[1];
          const parentX = parentBookId ? (xPositions.get(parentBookId) ?? 0) : finalX;
          finalX = parentX + 77; 
        }

        return {
          id: book.id,
          type: isAxis ? "axisPoint" : "book",
          position: {
            x: finalX,
            y: rowY[book.series] + (isAxis ? 150 : 0)
          },
          data: {
            book,
            isSelected: selectedBookId === book.id,
            isDimmed: Boolean(selectedBookId && !connectedToSelected.has(book.id))
          }
        };
      });
  }, [displayBooks, connectedToSelected, filteredBookIds, selectedBookId]);

  const edges: Edge[] = useMemo(() => {
    return visibleConnections.map((connection) => {
      const id = `${connection.source}-${connection.target}-${connection.type}`;

      return {
        id,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle, 
        targetHandle: connection.targetHandle, 
        type: connection.pathType || "smoothstep",
        animated: connection.type === "crossover" || connection.type === "epizod", // <--- Dodano epizod
        label: `${connection.type} ${connection.certainty}%`,
        labelStyle: {
          fill: "#f4f1ea",
          fontSize: 11,
          fontWeight: 600
        },
        labelBgPadding: [7, 4],
        labelBgBorderRadius: 6,
        labelBgStyle: {
          fill:
            selectedConnectionId === id
              ? "rgba(225, 29, 72, 0.95)"
              : "rgba(9, 10, 15, 0.9)",
          stroke: "rgba(255, 255, 255, 0.16)"
        },
        style: {
          // Upewnij się, że relationColors w pliku catalog ma też kolor dla "epizod"!
          stroke: relationColors[connection.type],
          strokeWidth:
            connection.importance === "finale"
              ? 5
              : connection.importance === "major" || connection.type === "crossover" || connection.type === "kontynuacja" || connection.type === "epizod"
                ? 3
                : 2,
          strokeDasharray: relationDash[connection.type],
          opacity:
            selectedBookId &&
            connection.source !== selectedBookId &&
            connection.target !== selectedBookId
              ? 0.18
              : 0.92
        }
      };
    });
  }, [selectedBookId, selectedConnectionId, visibleConnections]);

  const selectedBook = selectedBookId ? bookById.get(selectedBookId) ?? null : null;
  const selectedConnection = selectedConnectionId
    ? visibleConnections.find(
        (connection) =>
          `${connection.source}-${connection.target}-${connection.type}` ===
          selectedConnectionId
      ) ?? null
    : null;

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    if (node.id.includes("axis")) return; 
    setSelectedBookId(node.id);
    setSelectedConnectionId(null);
  }, []);

  const onEdgeClick: EdgeMouseHandler = useCallback((_, edge) => {
    setSelectedConnectionId(edge.id);
    setSelectedBookId(null); 
  }, []);

  const toggleSeries = (series: SeriesId) => {
    setSelectedSeries((current) =>
      current.includes(series)
        ? current.filter((item) => item !== series)
        : [...current, series]
    );
  };

  const toggleRelation = (relation: RelationType) => {
    setSelectedRelations((current) =>
      current.includes(relation)
        ? current.filter((item) => item !== relation)
        : [...current, relation]
    );
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedSeries(seriesOrder);
    setSelectedRelations(["kontynuacja", "wzmianka", "crossover", "epizod"]);
  };

  const updateBookCover = (bookId: string, cover: string) => {
    setCoverOverrides((current) => {
      const next = { ...current };
      if (cover.trim()) next[bookId] = cover.trim();
      else delete next[bookId];
      window.localStorage.setItem("mrozoversum-cover-overrides", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="flex h-screen flex-col text-white">
      <header className="border-b border-white/10 bg-[#08090d]/95 px-4 py-4 backdrop-blur-xl lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-rose-200">
              <Network size={22} />
              <span className="font-mono text-xs uppercase tracking-[0.32em]">
                Remigiusz Mróz universe
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white md:text-5xl">
              Mrozoversum
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm text-white/70 sm:w-[420px]">
            <Stat icon={<BookMarked size={17} />} label="książki" value={books.filter(b => !b.id.includes("axis")).length} />
            <Stat icon={<GitBranch size={17} />} label="relacje" value={connections.length} />
            <Stat label="serie" value={seriesOrder.length} />
          </div>
        </div>
      </header>

      {/* DODANO: Pasek z przyciskiem do ukrywania/pokazywania spoilerów */}
      <div className="flex justify-end px-4 pt-3 pb-1 bg-[#08090d]/95 lg:px-6">
        <button
          onClick={() => setShowSpoilers(!showSpoilers)}
          className={clsx(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
            showSpoilers
              ? "bg-rose-500/10 border-rose-500/50 text-rose-300"
              : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
          )}
        >
          {showSpoilers ? "☠️ Tryb Spoilerów" : "🛡️ Tryb Bezpieczny"}
        </button>
      </div>

      <FilterBar
        query={query}
        selectedSeries={selectedSeries}
        selectedRelations={selectedRelations}
        onQueryChange={setQuery}
        onSeriesToggle={toggleSeries}
        onRelationToggle={toggleRelation}
        onReset={resetFilters}
      />

      <section className="relative min-h-0 flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          fitView
          fitViewOptions={{ padding: 0.22, maxZoom: 1.05 }}
          minZoom={0.22}
          maxZoom={1.55}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          nodesDraggable={false}
          proOptions={{ hideAttribution: true }}
          // DODANO: Ustawienie kątów prostych (z zaokrąglonymi rogami) na wszystkich liniach domyślnie
          defaultEdgeOptions={{ type: 'smoothstep' }} 
        >
          <Background gap={28} color="rgba(255,255,255,0.05)" />
          <TimelineLines />
          <Controls position="bottom-left" />
          <MiniMap
            position="bottom-right"
            pannable
            zoomable
            nodeColor={(node) => {
              const book = bookById.get(node.id);
              return book ? seriesColors[book.series] : "#71717a";
            }}
            maskColor="rgba(0, 0, 0, 0.48)"
          />
        </ReactFlow>
      </section>

      {/* Panele boczne */}
      <BookDetailsPanel
        book={selectedBook}
        books={displayBooks}
        connections={connections}
        onClose={() => setSelectedBookId(null)}
        onSelectBook={setSelectedBookId}
        onUpdateCover={updateBookCover}
      />

      <ConnectionDetailsSidebar
        connection={selectedConnection}
        source={selectedConnection ? bookById.get(selectedConnection.source) ?? null : null}
        target={selectedConnection ? bookById.get(selectedConnection.target) ?? null : null}
        allCharacters={characters}
        onClose={() => setSelectedConnectionId(null)}
        showSpoilers={showSpoilers} // DODANO: Przekazanie stanu do paska bocznego
      />
    </div>
  );
}

function ConnectionDetailsSidebar({
  connection,
  source,
  target,
  allCharacters,
  onClose,
  showSpoilers // DODANO: Odbiór stanu
}: {
  connection: BookConnection | null;
  source: Book | null;
  target: Book | null;
  allCharacters: Character[];
  onClose: () => void;
  showSpoilers: boolean; // DODANO: Typowanie
}) {
  if (!connection || !source || !target) return null;
  
  const title = connection.type === "crossover" ? "Crossover" : connection.type === "kontynuacja" ? "Kontynuacja" : connection.type === "epizod" ? "epizod" : "Wzmianka";
  const involvedCharacters = connection.characters 
    ? allCharacters.filter(char => connection.characters!.includes(char.id)) 
    : [];

  return (
    <aside className="fixed inset-y-0 right-0 z-50 flex w-1/2 min-w-[520px] max-w-[960px] flex-col border-l border-white/10 bg-[#090a0f]/95 shadow-2xl backdrop-blur-xl transition-transform">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-rose-400">{title}</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{source.title} → {target.title}</h2>
        </div>
        <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white">
          <X size={20} />
        </button>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm leading-6 text-white/80">
          {connection.note || "Brak szczegółowego opisu dla tego powiązania."}
        </div>

        {involvedCharacters.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Powiązane postacie ({involvedCharacters.length})
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              {involvedCharacters.map(char => (
                <CharacterCard 
                  key={char.id} 
                  character={char} 
                  showSpoilers={showSpoilers} // DODANO: Przekazanie stanu do karty postaci
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function Stat({ icon, label, value }: { icon?: React.ReactNode; label: string; value: number; }) {
  return (
    <div className="border border-white/10 bg-white/[0.035] px-3 py-2" style={{ borderRadius: 8 }}>
      <div className="flex items-center gap-2 text-white/45">{icon}<span className="text-[11px] uppercase tracking-[0.18em]">{label}</span></div>
      <p className="mt-1 font-mono text-xl text-white">{value}</p>
    </div>
  );
}