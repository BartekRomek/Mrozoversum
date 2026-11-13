"use client";

import Link from "next/link";
import { Heart, LogOut, Upload, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import booksData from "@/data/books.json";
import charactersData from "@/data/characters.json";
import { ProjectCopyright } from "@/components/ProjectCopyright";
import { SubpageLayout } from "@/components/SubpageLayout";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";
import { assetPath } from "@/lib/assetPath";
import { characterIdentity } from "@/lib/characters";
import type { Book, Character } from "@/lib/types";

export function AccountPage() {
  const { configured, loading, user, bookStatuses, characterFavorites, uploadAvatar, signOut } = useSupabaseAuth();
  const [uploadError, setUploadError] = useState("");
  const books = booksData as Book[];
  const characters = charactersData as Character[];
  const favoriteBooks = books.filter((book) => bookStatuses[book.id]?.isFavorite);
  const favoriteCharacters = useMemo(() => Object.values(characterFavorites).map((favorite) => {
    const character = characters.find((item) => characterIdentity(item) === favorite.characterKey);
    return character ? { favorite, character } : null;
  }).filter((item): item is { favorite: typeof characterFavorites[string]; character: Character } => Boolean(item)), [characterFavorites, characters]);

  return <SubpageLayout>
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20">
      <section className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-rose-300/70">Konto użytkownika</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">MOJE MROZOVERSUM</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/55">Zapisuj ulubione książki i bohaterów oraz wracaj do nich w jednym miejscu.</p>
      </section>

      {!configured ? <Panel>Logowanie nie jest jeszcze skonfigurowane.</Panel> : loading ? <Panel>Sprawdzanie sesji…</Panel> : !user ? <Panel><UserRound className="mx-auto text-rose-300" size={24} /><p className="mt-3">Zaloguj się przez ikonę konta w nagłówku, aby korzystać z ulubionych.</p></Panel> : <>
        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-rose-300/30 bg-rose-500/10 text-xl font-bold text-rose-100">{user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Zdjęcie profilowe" className="h-full w-full object-cover" /> : user.email?.charAt(0).toUpperCase()}</div><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Zalogowano jako</p><p className="mt-1 text-white/85">{user.email}</p></div></div>
            <label className="settings-reset cursor-pointer"><Upload size={16} /> Zmień zdjęcie<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; setUploadError(""); const result = await uploadAvatar(file); if (result.error) setUploadError(result.error); }} /></label>
          </div>
          {uploadError && <p className="mt-3 text-sm text-rose-300">{uploadError}</p>}
          <button type="button" onClick={() => void signOut()} className="settings-reset mt-5"><LogOut size={16} /> Wyloguj</button>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <FavoriteSection title="Ulubione książki" count={favoriteBooks.length}>
            {favoriteBooks.length ? favoriteBooks.map((book) => <Link key={book.id} href={`/ksiazki/${book.id}/`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3 transition hover:border-white/20"><img src={assetPath(book.cover)} alt="" className="h-16 w-11 rounded-md object-cover" /><span className="font-semibold text-white/85">{book.title}</span></Link>) : <Empty>Nie masz jeszcze ulubionych książek.</Empty>}
          </FavoriteSection>
          <FavoriteSection title="Ulubieni bohaterowie" count={favoriteCharacters.length}>
            {favoriteCharacters.length ? favoriteCharacters.map(({ favorite, character }) => <Link key={favorite.characterKey} href={`/postacie/${character.id}/`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3 transition hover:border-white/20"><div className="h-16 w-12 overflow-hidden rounded-md bg-black/20">{character.avatar && <img src={assetPath(character.avatar)} alt="" className="h-full w-full object-cover" />}</div><span className="font-semibold text-white/85">{favorite.characterName}</span></Link>) : <Empty>Nie masz jeszcze ulubionych bohaterów.</Empty>}
          </FavoriteSection>
        </div>
      </>}
      <ProjectCopyright />
    </main>
  </SubpageLayout>;
}

function Panel({ children }: { children: React.ReactNode }) { return <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center text-white/55">{children}</div>; }
function FavoriteSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) { return <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7"><div className="flex items-end justify-between border-b border-white/10 pb-4"><h2 className="text-xl font-semibold text-white">{title}</h2><span className="font-mono text-xs text-white/35">{count}</span></div><div className="mt-4 grid gap-3">{children}</div></section>; }
function Empty({ children }: { children: React.ReactNode }) { return <p className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-white/40">{children}</p>; }
