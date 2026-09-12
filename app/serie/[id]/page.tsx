import type { Metadata } from "next";
import { notFound } from "next/navigation";
import books from "@/data/books.json";
import { seriesLabels, seriesOrder } from "@/lib/catalog";
import { entityMetadata } from "@/lib/seo";
import { SubpageLayout } from "@/components/SubpageLayout";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return seriesOrder.map((id) => ({ id: id.toLowerCase() }));
}

function findSeries(id: string) {
  return seriesOrder.find((series) => series.toLowerCase() === id.toLowerCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const series = findSeries(id);
  if (!series) return { title: "Nie znaleziono serii" };
  return entityMetadata({
    title: seriesLabels[series],
    description: `Książki i informacje o serii ${seriesLabels[series]} w Mrozoversum.`,
    path: `/serie/${series.toLowerCase()}`,
    imageAlt: `Seria ${seriesLabels[series]} w Mrozoversum`
  });
}

export default async function SeriesPage({ params }: Props) {
  const { id } = await params;
  const series = findSeries(id);
  if (!series) notFound();
  const seriesBooks = books.filter((book) => book.series === series && !book.id.includes("-axis-")).sort((a, b) => a.order - b.order);

  return (
    <SubpageLayout className="series-entity-page">
      <article className="mx-auto max-w-3xl">
        <p className="mt-12 font-mono text-xs uppercase tracking-[0.25em] text-rose-300/70">Seria</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{seriesLabels[series]}</h1>
        <p className="mt-5 text-white/60">{seriesBooks.length} {seriesBooks.length === 1 ? "książka" : "książek"} w katalogu Mrozoversum.</p>
        <ol className="mt-8 space-y-3">{seriesBooks.map((book) => <li key={book.id}><a className="block rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-rose-400/40" href={`/ksiazki/${book.id}`}><span className="text-white/40">{book.order}. </span>{book.title}</a></li>)}</ol>
      </article>
    </SubpageLayout>
  );
}
