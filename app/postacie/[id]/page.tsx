import type { Metadata } from "next";
import { notFound } from "next/navigation";
import characters from "@/data/characters.json";
import { entityMetadata, siteUrl } from "@/lib/seo";
import { SubpageLayout } from "@/components/SubpageLayout";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return characters.map((character) => ({ id: character.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const character = characters.find((item) => item.id === id);
  if (!character) return { title: "Nie znaleziono postaci" };
  return entityMetadata({
    title: character.name,
    description: `Profil postaci ${character.name} w Mrozoversum. Seria: ${character.series}.`,
    path: `/postacie/${character.id}`,
    imageAlt: `Postać ${character.name}`
  });
}

export default async function CharacterPage({ params }: Props) {
  const { id } = await params;
  const character = characters.find((item) => item.id === id);
  if (!character) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: character.name,
    description: character.description,
    url: `${siteUrl}/postacie/${character.id}`
  };

  return (
    <SubpageLayout className="character-entity-page">
      <article className="mx-auto max-w-3xl">
        <p className="mt-12 font-mono text-xs uppercase tracking-[0.25em] text-rose-300/70">{character.series}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{character.name}</h1>
        <p className="mt-3 text-sm uppercase tracking-[0.16em] text-white/45">{character.role}</p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{character.description}</p>
        <p className="mt-8 text-sm text-white/45">Debiut: {character.debut}</p>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </article>
    </SubpageLayout>
  );
}
