"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  ReactFlow,
  useViewport,
  Handle,
  Position,
  MarkerType,
  type Edge,
  type Node,
  type EdgeMouseHandler,
  type NodeMouseHandler,
  type ReactFlowInstance
} from "@xyflow/react";
import { X, SlidersHorizontal, Search } from "lucide-react";
import { clsx } from "clsx";
import { BookNode } from "@/components/BookNode";
import { BookDetailsPanel } from "@/components/BookDetailsPanel";
import { CharacterCard } from "@/components/CharacterCard";
import {
  relationColors,
  relationLabels,
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

const relationTypes: RelationType[] = ["kontynuacja", "wzmianka", "crossover", "epizod", "zmiana_serii"];

function AxisPointNode({ data }: { data: any }) {
  const color = data?.color || "#e11d48";

  return (
    <div
      className="w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2"
      style={{
        backgroundColor: color,
        boxShadow: `0 0 12px ${color}`
      }}
    >
      <Handle type="target" position={Position.Top} id="target-top" className="opacity-0" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" className="opacity-0" />
      <Handle type="source" position={Position.Top} id="source-top" className="opacity-0" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" className="opacity-0" />
    </div>
  );
}

const nodeTypes = {
  book: BookNode,
  axisPoint: AxisPointNode
};

const rowY: Record<SeriesId, number> = {
  Wladza: -720,
  Forst: -360,
  Chylka: 0,
  Langer: 340,
  Behawiorysta: -1080,
  Zaorski: 690
};

const relationDash: Record<RelationType, string | undefined> = {
  kontynuacja: "6 6",
  wzmianka: "3 7",
  crossover: undefined,
  epizod: "2 4",
  zmiana_serii: undefined
};

const relationTitles: Record<RelationType, string> = {
  kontynuacja: "Kontynuacja",
  wzmianka: "Wzmianka",
  crossover: "Crossover",
  epizod: "Epizod",
  zmiana_serii: "Zmiana głównej serii"
};

function TimelineLines() {
  const { x, y, zoom } = useViewport();
  const offset = 150;

  const rows = [
    { key: "Wladza", label: "W KRĘGACH WŁADZY", y: rowY.Wladza + offset },
    { key: "Forst", label: "FORST", y: rowY.Forst + offset },
    { key: "Chylka", label: "CHYŁKA", y: rowY.Chylka + offset },
    { key: "Langer", label: "LANGER", y: rowY.Langer + offset },
    { key: "Zaorski", label: "SEWERYN ZAORSKI", y: rowY.Zaorski + offset },
    { key: "Behawiorysta", label: "Gerard Edling", y: rowY.Behawiorysta + offset }

  ];

  return (
    <svg className="absolute inset-0 pointer-events-none z-0 w-full h-full overflow-visible">
      <g transform={`translate(${x}, ${y}) scale(${zoom})`}>
        {rows.map((row) => (
          <line
            key={row.key}
            x1="-50000"
            y1={row.y}
            x2="50000"
            y2={row.y}
            stroke="rgba(225, 29, 72, 0.16)"
            strokeWidth="1"
          />
        ))}
      </g>

      {rows.map((row) => {
        const labelY = row.y * zoom + y - 8;

        return (
          <g key={row.key}>
            <rect
              x="18"
              y={labelY - 18}
              width={row.label.length * 10 + 28}
              height="28"
              rx="8"
              fill="rgba(7, 8, 12, 0.62)"
              stroke="rgba(225, 29, 72, 0.12)"
            />
            <text
              x="32"
              y={labelY}
              fill="rgba(244, 63, 94, 0.78)"
              fontSize="12"
              fontWeight="800"
              letterSpacing="3"
              className="font-mono"
            >
              {row.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function MrozoversumMap({ books, connections, characters = [] }: MrozoversumMapProps) {
  const [query, setQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<SeriesId[]>(seriesOrder);
  const [selectedRelations, setSelectedRelations] = useState<RelationType[]>(relationTypes);
  const [selectedBookId, setSelectedBookId] = useState<string | null>("kasacja");
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [hoveredConnectionId, setHoveredConnectionId] = useState<string | null>(null);
  const [coverOverrides, setCoverOverrides] = useState<Record<string, string>>({});
  const [showSpoilers] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

  const focusMapPoint = useCallback((point: { x: number; y: number }) => {
    const instance = reactFlowInstanceRef.current;
    if (!instance || typeof window === "undefined") return;

    const { zoom } = instance.getViewport();

    instance.setViewport(
      {
        x: window.innerWidth * 0.28 - point.x * zoom,
        y: window.innerHeight * 0.55 - point.y * zoom,
        zoom
      },
      { duration: 650 }
    );
  }, []);

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

const activeConnection = useMemo(() => {
  if (!selectedConnectionId) return null;

  return visibleConnections.find(
    (connection) =>
      `${connection.source}-${connection.target}-${connection.type}` === selectedConnectionId
  ) ?? null;
}, [selectedConnectionId, visibleConnections]);

  const connectedToSelected = useMemo(() => {
    if (!selectedBookId) return new Set<string>();

    const related = new Set<string>([selectedBookId]);
    for (const connection of connections) {
      if (connection.source === selectedBookId) related.add(connection.target);
      if (connection.target === selectedBookId) related.add(connection.source);
    }

    return related;
  }, [connections, selectedBookId]);

  const nodes: Node<BookNodeData | any>[] = useMemo(() => {
    const groupedBySeries = new Map<SeriesId, Book[]>();

    for (const book of displayBooks.filter((item) => filteredBookIds.has(item.id))) {
      const items = groupedBySeries.get(book.series) ?? [];
      items.push(book);
      groupedBySeries.set(book.series, items);
    }

    const xPositions = new Map<string, number>();

    for (const [, seriesBooks] of groupedBySeries) {
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

        let axisColor = undefined;
        if (isAxis) {
          const relatedConnection = connections.find(c => c.source === book.id || c.target === book.id);
          if (relatedConnection) {
            axisColor = relationColors[relatedConnection.type];
          }
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
            isDimmed:
              Boolean(selectedBookId && !connectedToSelected.has(book.id)) ||
              Boolean(
                activeConnection &&
                  !isAxis &&
                  book.id !== activeConnection.source &&
                  book.id !== activeConnection.target
              ),
            color: axisColor
          }
        };
      });
  }, [displayBooks, connectedToSelected, filteredBookIds, selectedBookId, connections, activeConnection]);

const edges: Edge[] = useMemo(() => {
  return visibleConnections.map((connection) => {
    const id = `${connection.source}-${connection.target}-${connection.type}`;
    const activeConnectionId = selectedConnectionId;
    const isFocusedConnection = activeConnectionId === id;
    const isRelatedToSelectedBook =
      selectedBookId &&
      (connection.source === selectedBookId || connection.target === selectedBookId);

    const relationColor = relationColors[connection.type];
    const relationTitle = relationTitles[connection.type];

    return {
      id,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: connection.pathType || "smoothstep",
      animated: true,
      interactionWidth: isFocusedConnection ? 34 : 28,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: relationColor,
        width: isFocusedConnection ? 13 : 10,
        height: isFocusedConnection ? 13 : 10
      },
      label: relationTitle,
      labelStyle: {
        fill: "#f4f1ea",
        fontSize: isFocusedConnection ? 12 : 11,
        fontWeight: 800
      },
      labelBgPadding: [10, 6],
      labelBgBorderRadius: 8,
      labelBgStyle: {
        fill: isFocusedConnection
          ? "rgba(7, 8, 12, 0.92)"
          : "rgba(7, 8, 12, 0.74)",
        stroke: relationColor,
        strokeWidth: isFocusedConnection ? 1.2 : 0.8
      },
      style: {
        cursor: "pointer",
        stroke: relationColor,
        strokeWidth: isFocusedConnection
          ? 3.5
          : connection.importance === "finale"
            ? 3
            : connection.importance === "major" ||
                connection.type === "crossover" ||
                connection.type === "kontynuacja" ||
                connection.type === "epizod" ||
                connection.type === "zmiana_serii"
              ? 2.5
              : 2,
        strokeDasharray: relationDash[connection.type],
        opacity:
          activeConnectionId && !isFocusedConnection
            ? 0.16
            : selectedBookId &&
                connection.source !== selectedBookId &&
                connection.target !== selectedBookId
              ? 0.28
              : isFocusedConnection
                ? 0.98
                : isRelatedToSelectedBook
                  ? 0.86
                  : 0.78,
        filter: isFocusedConnection
          ? `drop-shadow(0 0 8px ${relationColor}cc)`
          : `drop-shadow(0 0 5px ${relationColor}88)`
      }
    };
  });
}, [selectedBookId, selectedConnectionId, hoveredConnectionId, visibleConnections]);

  const selectedBook = selectedBookId ? bookById.get(selectedBookId) ?? null : null;
  const selectedConnection = selectedConnectionId
    ? visibleConnections.find(
        (connection) =>
          `${connection.source}-${connection.target}-${connection.type}` ===
          selectedConnectionId
      ) ?? null
    : null;

  const getNodeFocusPoint = useCallback((node: Node<BookNodeData | any>) => {
    if (node.type === "book") {
      return {
        x: node.position.x + 77,
        y: node.position.y + 125
      };
    }

    return {
      x: node.position.x,
      y: node.position.y
    };
  }, []);

  const focusConnectionById = useCallback((connectionId: string) => {
    const connection = visibleConnections.find(
      (item) => `${item.source}-${item.target}-${item.type}` === connectionId
    );

    if (!connection) return;

    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);

    if (!sourceNode || !targetNode) return;

    const sourcePoint = getNodeFocusPoint(sourceNode);
    const targetPoint = getNodeFocusPoint(targetNode);

    focusMapPoint({
      x: (sourcePoint.x + targetPoint.x) / 2,
      y: (sourcePoint.y + targetPoint.y) / 2
    });
  }, [focusMapPoint, getNodeFocusPoint, nodes, visibleConnections]);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    if (node.id.includes("axis")) return;

    setSelectedBookId(node.id);
    setSelectedConnectionId(null);
    setHoveredConnectionId(null);
    focusMapPoint(getNodeFocusPoint(node as Node<BookNodeData | any>));
  }, [focusMapPoint, getNodeFocusPoint]);

  const onEdgeClick: EdgeMouseHandler = useCallback((_, edge) => {
    setSelectedConnectionId(edge.id);
    setSelectedBookId(null);
    setHoveredConnectionId(null);
    focusConnectionById(edge.id);
  }, [focusConnectionById]);

  const onEdgeMouseEnter: EdgeMouseHandler = useCallback((_, edge) => {
    if (selectedConnectionId) return;
    setHoveredConnectionId(edge.id);
  }, [selectedConnectionId]);

  const onEdgeMouseLeave: EdgeMouseHandler = useCallback(() => {
    if (selectedConnectionId) return;
    setHoveredConnectionId(null);
  }, [selectedConnectionId]);

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
    setSelectedRelations(relationTypes);
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
    <div className="flex h-screen flex-col text-white overflow-hidden relative">
      <header className="relative z-30 overflow-hidden border-b border-white/10 bg-[rgba(7,8,12,0.88)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(225,29,72,0.16),transparent_32%),linear-gradient(90deg,rgba(225,29,72,0.06),transparent_30%,transparent_70%,rgba(225,29,72,0.06))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-500/45 to-transparent" />

        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
          <div className="flex min-w-[220px] items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.7)]" />
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-rose-300/70">
                Interaktywna mapa
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-white/40">
                książki, serie i powiązania
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.12)]">
              MROZOVERSUM
            </h1>
            <div className="mt-2 h-px w-32 bg-gradient-to-r from-transparent via-rose-400 to-transparent shadow-[0_0_14px_rgba(244,63,94,0.65)]" />
          </div>

          <div className="ml-auto flex items-center justify-end gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <Stat label="Książki" value={books.filter(b => !b.id.includes("axis")).length} />
              <div className="h-6 w-px bg-white/10" />
              <Stat label="Relacje" value={connections.length} />
              <div className="h-6 w-px bg-white/10" />
              <Stat label="Serie" value={seriesOrder.length} />
            </div>

            <button
              onClick={() => setIsFiltersOpen(true)}
              className="group flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.045] px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_28px_rgba(0,0,0,0.18)] transition hover:border-rose-400/35 hover:bg-rose-500/10 hover:text-rose-50"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-rose-200 transition group-hover:border-rose-300/35 group-hover:bg-rose-500/15">
                <SlidersHorizontal size={15} />
              </span>
              <span>Filtry</span>
            </button>
          </div>
        </div>
      </header>

      <section className="relative min-h-0 flex-1 z-10">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={(instance) => {
            reactFlowInstanceRef.current = instance;
          }}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onEdgeMouseLeave={onEdgeMouseLeave}
          fitView
          fitViewOptions={{ padding: 0.22, maxZoom: 1.05 }}
          minZoom={0.22}
          maxZoom={1.55}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          nodesDraggable={false}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ type: "smoothstep" }}
        >
          <Background id="fine" gap={28} color="rgba(255,255,255,0.035)" />
          <Background id="coarse" gap={140} color="rgba(255,255,255,0.065)" />
          <TimelineLines />
        </ReactFlow>

        <ConnectionLegend />
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,transparent_48%,rgba(0,0,0,0.32)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-black/35 to-transparent" />
      </section>

      <aside
        className={clsx(
          "fixed inset-y-0 right-0 z-40 flex w-[360px] max-w-full flex-col border-l border-white/10 bg-[#090a0f]/95 shadow-2xl backdrop-blur-xl transition-transform duration-300",
          isFiltersOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/80">
            Wyszukiwanie i filtry
          </h2>
          <button
            onClick={() => setIsFiltersOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Szukaj
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Książka, seria, opis..."
                className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-rose-400/50 focus:bg-white/[0.05]"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Serie
            </label>
            <div className="flex flex-col gap-2">
              {seriesOrder.map((series) => {
                const isActive = selectedSeries.includes(series);

                return (
                  <button
                    key={series}
                    onClick={() => toggleSeries(series)}
                    className={clsx(
                      "flex h-9 items-center gap-3 rounded-md border px-3 text-sm font-medium transition",
                      isActive
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-transparent bg-white/[0.02] text-white/40 hover:bg-white/[0.05] hover:text-white/80"
                    )}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seriesColors[series] }} />
                    {seriesLabels[series]}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Typy połączeń
            </label>
            <div className="flex flex-col gap-2">
              {relationTypes.map((relation) => {
                const isActive = selectedRelations.includes(relation);

                return (
                  <button
                    key={relation}
                    onClick={() => toggleRelation(relation)}
                    className={clsx(
                      "flex h-9 items-center gap-3 rounded-md border px-3 text-sm font-medium transition",
                      isActive
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-transparent bg-white/[0.02] text-white/40 hover:bg-white/[0.05] hover:text-white/80"
                    )}
                  >
                    <span className="h-2 w-6 rounded-full" style={{ backgroundColor: relationColors[relation] }} />
                    {relationLabels[relation] ?? relation}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={resetFilters}
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/[0.05] hover:text-white"
          >
            Resetuj wszystko
          </button>
        </div>
      </aside>

      <BookDetailsPanel
        book={selectedBook}
        books={displayBooks}
        connections={connections}
        onClose={() => {
          setSelectedBookId(null);
          setHoveredConnectionId(null);
        }}
        onSelectBook={setSelectedBookId}
        onSelectConnection={(connectionId) => {
          setSelectedBookId(null);
          setSelectedConnectionId(connectionId);
          setHoveredConnectionId(null);
          focusConnectionById(connectionId);
        }}
        onUpdateCover={updateBookCover}
      />

      <ConnectionDetailsSidebar
        connection={selectedConnection}
        source={selectedConnection ? bookById.get(selectedConnection.source) ?? null : null}
        target={selectedConnection ? bookById.get(selectedConnection.target) ?? null : null}
        allCharacters={characters}
        onClose={() => {
          setSelectedConnectionId(null);
          setHoveredConnectionId(null);
        }}
        showSpoilers={showSpoilers}
      />
    </div>
  );
}

function ConnectionLegend() {
  return (
    <div className="group absolute bottom-6 left-6 z-30">
      <div className="flex h-12 min-w-[116px] items-center justify-center rounded-2xl border border-white/10 bg-[#08090d]/82 px-4 text-[11px] font-black uppercase tracking-[0.18em] text-white/72 shadow-2xl shadow-black/50 backdrop-blur-xl transition duration-300 group-hover:scale-95 group-hover:border-rose-400/25 group-hover:text-rose-100">
      LEGENDA
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 w-[250px] translate-y-3 scale-95 rounded-2xl border border-white/10 bg-[#08090d]/88 p-5 opacity-0 shadow-2xl shadow-black/55 backdrop-blur-xl transition duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/42">
            Legenda relacji
          </h3>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/35">
            Hover
          </span>
        </div>

        <div className="space-y-3">
          {relationTypes.map((type) => (
            <div key={type} className="flex items-center gap-3 text-sm font-semibold text-white/64">
              <span
                className="h-0.5 w-12 rounded-full"
                style={{
                  backgroundColor: relationColors[type],
                  boxShadow: `0 0 10px ${relationColors[type]}66`
                }}
              />
              <span>{relationLabels[type]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConnectionDetailsSidebar({
  connection,
  source,
  target,
  allCharacters,
  onClose,
  showSpoilers
}: {
  connection: BookConnection | null;
  source: Book | null;
  target: Book | null;
  allCharacters: Character[];
  onClose: () => void;
  showSpoilers: boolean;
}) {
  if (!connection || !source || !target) return null;

  const title = relationTitles[connection.type];
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
                  showSpoilers={showSpoilers}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: number; }) {
  return (
    <div className="min-w-[54px] text-center">
      <span className="block font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white/[0.35]">
        {label}
      </span>
      <span className="mt-0.5 block text-sm font-semibold leading-none text-white">
        {value}
      </span>
    </div>
  );
}