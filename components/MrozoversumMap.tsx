"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
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

const nodeTypes = {
  book: BookNode
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
        return {
          id: book.id,
          type: "book",
          position: {
            x: xPositions.get(book.id) ?? 0,
            y: rowY[book.series]
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

      if (cover.trim()) {
        next[bookId] = cover.trim();
      } else {
        delete next[bookId];
      }

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
            <Stat icon={<BookMarked size={17} />} label="książki" value={books.length} />
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
        <div className="absolute left-4 top-4 z-10 hidden max-w-[330px] border border-white/10 bg-[#090a0f]/88 p-3 text-xs leading-5 text-white/56 backdrop-blur-md lg:block" style={{ borderRadius: 8 }}>
          <strong className="mb-1 block text-white/80">Oś główna: Chyłka</strong>
          Poziome ułożenie pokazuje chronologię serii Chyłka, a pozostałe serie są
          osadzone jako osobne grupy wokół niej.
        </div>

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
  if (!connection || !source || !target) {
    return null;
  }

  const title =
    connection.type === "crossover"
      ? "Crossover"
      : connection.type === "cameo"
        ? "Cameo"
        : "Wzmianka";

  return (
    <aside className="fixed bottom-5 left-1/2 z-40 w-[calc(100vw-2rem)] max-w-[560px] -translate-x-1/2 border border-white/12 bg-[#090a0f]/96 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl" style={{ borderRadius: 8 }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-white/42">
            Relacja: {title}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            {source.title} → {target.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-8 border border-white/10 px-3 text-xs text-white/60 transition hover:text-white"
          style={{ borderRadius: 8 }}
        >
          zamknij
        </button>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/72">
        {connection.note || "Brak opisu tej relacji w pliku JSON."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/55">
        <span className="border border-white/10 bg-white/[0.04] px-2 py-1" style={{ borderRadius: 6 }}>
          pewność {connection.certainty}%
        </span>
        {connection.importance ? (
          <span className="border border-rose-300/30 bg-rose-500/12 px-2 py-1 text-rose-100" style={{ borderRadius: 6 }}>
            {connection.importance}
          </span>
        ) : null}
      </div>
    </aside>
  );
}

function Stat({
  icon,
  label,
  value
}: {
  icon?: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="border border-white/10 bg-white/[0.035] px-3 py-2" style={{ borderRadius: 8 }}>
      <div className="flex items-center gap-2 text-white/45">
        {icon}
        <span className="text-[11px] uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-1 font-mono text-xl text-white">{value}</p>
    </div>
  );
}
