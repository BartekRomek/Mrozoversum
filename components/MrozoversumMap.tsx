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
import { BookMarked, GitBranch, Network } from "lucide-react";
import { BookNode } from "@/components/BookNode";
import { BookDetailsPanel } from "@/components/BookDetailsPanel";
import { FilterBar } from "@/components/FilterBar";
import {
  relationColors,
  seriesColors,
  seriesLabels,
  seriesOrder
} from "@/lib/catalog";
import type { Book, BookConnection, BookNodeData, RelationType, SeriesId } from "@/lib/types";

type MrozoversumMapProps = {
  books: Book[];
  connections: BookConnection[];
};

// Nowy, niewidzialny węzeł na osi
function AxisPointNode() {
  return (
    <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(225,29,72,0.9)] transform -translate-x-1/2 -translate-y-1/2">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

const nodeTypes = {
  book: BookNode,
  axisPoint: AxisPointNode
};

const rowY: Record<SeriesId, number> = {
  Chylka: 0,
  Forst: -360,
  Langer: 340,
  Behawiorysta: -700,
  Zaorski: 690
};

const relationDash: Record<RelationType, string | undefined> = {
  cameo: "8 7",
  wzmianka: "3 7",
  crossover: undefined
};

function TimelineLines() {
  const { x, y, zoom } = useViewport();
  const offset = 150; 

  return (
    <svg className="absolute inset-0 pointer-events-none z-0 w-full h-full overflow-visible">
      <g transform={`translate(${x}, ${y}) scale(${zoom})`}>
        <line x1="-50000" y1={rowY.Forst + offset} x2="50000" y2={rowY.Forst + offset} stroke="rgba(225, 29, 72, 0.25)" strokeWidth="1.5" />
        <line x1="-50000" y1={rowY.Chylka + offset} x2="50000" y2={rowY.Chylka + offset} stroke="rgba(225, 29, 72, 0.25)" strokeWidth="1.5" />
        <line x1="-50000" y1={rowY.Langer + offset} x2="50000" y2={rowY.Langer + offset} stroke="rgba(225, 29, 72, 0.25)" strokeWidth="1.5" />
      </g>

      <text x="24" y={(rowY.Forst + offset) * zoom + y - 8} fill="rgba(225, 29, 72, 0.9)" fontSize="13" fontWeight="800" letterSpacing="3" className="font-mono">FORST</text>
      <text x="24" y={(rowY.Chylka + offset) * zoom + y - 8} fill="rgba(225, 29, 72, 0.9)" fontSize="13" fontWeight="800" letterSpacing="3" className="font-mono">CHYŁKA</text>
      <text x="24" y={(rowY.Langer + offset) * zoom + y - 8} fill="rgba(225, 29, 72, 0.9)" fontSize="13" fontWeight="800" letterSpacing="3" className="font-mono">LANGER</text>
    </svg>
  );
}

export function MrozoversumMap({ books, connections }: MrozoversumMapProps) {
  const [query, setQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<SeriesId[]>(seriesOrder);
  const [selectedRelations, setSelectedRelations] = useState<RelationType[]>([
    "cameo",
    "wzmianka",
    "crossover"
  ]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>("kasacja");
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [coverOverrides, setCoverOverrides] = useState<Record<string, string>>({});

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
    if (!selectedBookId) {
      return new Set<string>();
    }

    const related = new Set<string>([selectedBookId]);

    for (const connection of connections) {
      if (connection.source === selectedBookId) {
        related.add(connection.target);
      }

      if (connection.target === selectedBookId) {
        related.add(connection.source);
      }
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
      const seriesIndex = seriesOrder.indexOf(series);
      let lastX = Number.NEGATIVE_INFINITY;

      for (const book of [...seriesBooks].sort((left, right) => {
        const leftTimeline = left.timeline ?? left.order;
        const rightTimeline = right.timeline ?? right.order;

        return leftTimeline - rightTimeline;
      })) {
        const timelineSlot = book.timeline ?? book.order;
        const baseX =
          series === "Chylka"
            ? (timelineSlot - 1) * 245
            : (timelineSlot - 1) * 245 + seriesIndex * 18;
        const x = Math.max(baseX, lastX + 188);

        xPositions.set(book.id, x);
        lastX = x;
      }
    }

    return displayBooks
      .filter((book) => filteredBookIds.has(book.id))
      .map((book) => {
        const isAxis = book.id.includes("axis");

        return {
          id: book.id,
          type: isAxis ? "axisPoint" : "book",
          position: {
            x: (xPositions.get(book.id) ?? 0) + (isAxis ? 120 : 0),
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
      type: "smoothstep",
      animated: connection.type === "crossover",
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
        stroke: relationColors[connection.type],
        strokeWidth:
          connection.importance === "finale"
            ? 5
            : connection.importance === "major" || connection.type === "crossover"
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
    // Nie otwieraj panelu bocznego, jeśli kliknięto w kropkę na osi
    if (node.id.includes("axis")) return; 
    
    setSelectedBookId(node.id);
    setSelectedConnectionId(null);
  }, []);

  const onEdgeClick: EdgeMouseHandler = useCallback((_, edge) => {
    setSelectedConnectionId(edge.id);
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
    setSelectedRelations(["cameo", "wzmianka", "crossover"]);
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

      <BookDetailsPanel
        book={selectedBook}
        books={displayBooks}
        connections={connections}
        onClose={() => setSelectedBookId(null)}
        onSelectBook={setSelectedBookId}
        onUpdateCover={updateBookCover}
      />

      <ConnectionDetails
        connection={selectedConnection}
        source={selectedConnection ? bookById.get(selectedConnection.source) ?? null : null}
        target={selectedConnection ? bookById.get(selectedConnection.target) ?? null : null}
        onClose={() => setSelectedConnectionId(null)}
      />
    </div>
  );
}

function ConnectionDetails({
  connection,
  source,
  target,
  onClose
}: {
  connection: BookConnection | null;
  source: Book | null;
  target: Book | null;
  onClose: () => void;
}) {
  if (!connection || !source || !target) return null;
  const title = connection.type === "crossover" ? "Crossover" : connection.type === "cameo" ? "Cameo" : "Wzmianka";
  return (
    <aside className="fixed bottom-5 left-1/2 z-40 w-[calc(100vw-2rem)] max-w-[560px] -translate-x-1/2 border border-white/12 bg-[#090a0f]/96 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl" style={{ borderRadius: 8 }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/42">Relacja: {title}</p>
          <h2 className="mt-1 text-lg font-semibold text-white">{source.title} → {target.title}</h2>
        </div>
        <button type="button" onClick={onClose} className="h-8 border border-white/10 px-3 text-xs text-white/60 transition hover:text-white" style={{ borderRadius: 8 }}>zamknij</button>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/72">{connection.note || "Brak opisu."}</p>
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