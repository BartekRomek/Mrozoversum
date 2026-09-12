import type { Metadata } from "next";
import { notFound } from "next/navigation";
import books from "@/data/books.json";
import { seriesLabels } from "@/lib/catalog";
import { entityMetadata, siteUrl } from "@/lib/seo";
import { SubpageLayout } from "@/components/SubpageLayout";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return books.filter((book) => !book.id.includes("-axis-")).map((book) => ({ id: book.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = books.find((item) => item.id === id && !item.id.includes("-axis-"));
  if (!book) return { title: "Nie znaleziono książki" };

  return entityMetadata({
    title: book.title,
    description: `Informacje o książce ${book.title} z serii ${seriesLabels[book.series as keyof typeof seriesLabels]}. Odkryj jej miejsce na mapie Mrozoversum.`,
    path: `/ksiazki/${book.id}`,
    imageAlt: `Okładka książki ${book.title}`
  });
}

export default async function BookPage({ params }: Props) {
  const { id } = await params;
  const book = books.find((item) => item.id === id && !item.id.includes("-axis-"));
  if (!book) notFound();

  const series = seriesLabels[book.series as keyof typeof seriesLabels];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: book.description,
    inLanguage: "pl-PL",
    genre: (book as { genre?: string }).genre,
    datePublished: book.year?.toString(),
    url: `${siteUrl}/ksiazki/${book.id}`
  };

  return (
    <SubpageLayout className="book-entity-page">
      <article className="mx-auto max-w-3xl">
        <p className="mt-12 font-mono text-xs uppercase tracking-[0.25em] text-rose-300/70">{series}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{book.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{book.description}</p>
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Meta label="Seria" value={series} />
          <Meta label="Rok" value={book.year ?? "—"} />
          <Meta label="Tom" value={(book as { volume?: string | number }).volume ?? book.order} />
          <Meta label="Pewność" value={`${book.certainty}%`} />
        </dl>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </article>
    </SubpageLayout>
  );
}

function Meta({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><dt className="text-[10px] uppercase tracking-[0.16em] text-white/40">{label}</dt><dd className="mt-2 text-sm font-semibold text-white/85">{value}</dd></div>;
}
