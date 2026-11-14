"use client";

import Link from "next/link";
import { Award, Heart, LogOut, Upload, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import booksData from "@/data/books.json";
import { ProjectCopyright } from "@/components/ProjectCopyright";
import { SubpageLayout } from "@/components/SubpageLayout";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";
import { assetPath } from "@/lib/assetPath";
import type { Book } from "@/lib/types";
import { getSeriesProgress } from "@/lib/seriesProgress";
import { badgeById, type BadgeDefinition } from "@/data/badges";
import type { UserBadge } from "@/lib/supabase/badges";

export function AccountPage() {
  const { configured, loading, user, bookStatuses, badges, uploadAvatar, signOut, isAdmin, adminUserCount } = useSupabaseAuth();
  const [uploadError, setUploadError] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<{ badge: UserBadge; definition: BadgeDefinition } | null>(null);
  const books = booksData as Book[];
  const favoriteBooks = books.filter((book) => bookStatuses[book.id]?.isFavorite);
  const seriesStatuses = getSeriesProgress(books, bookStatuses).filter((status) => status.level !== "started");
  const earnedBadges = badges.map((badge) => ({ badge, definition: badgeById[badge.badgeId] })).filter((item): item is { badge: typeof badges[number]; definition: NonNullable<typeof badgeById[string]> } => Boolean(item.definition));
  const badgeBookTitles = useMemo(() => new Map(books.map((book) => [book.id, book.title])), [books]);

  return <SubpageLayout>
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20">
      <section className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-rose-300/70">Konto użytkownika</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">MOJE MROZOVERSUM</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/55">Zapisuj ulubione książki i wracaj do nich w jednym miejscu.</p>
      </section>

      {!configured ? <Panel>Logowanie nie jest jeszcze skonfigurowane.</Panel> : loading ? <Panel>Sprawdzanie sesji…</Panel> : !user ? <Panel><UserRound className="mx-auto text-rose-300" size={24} /><p className="mt-3">Zaloguj się przez ikonę konta w nagłówku, aby korzystać z ulubionych.</p></Panel> : <>
        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-rose-300/30 bg-rose-500/10 text-xl font-bold text-rose-100">{user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="Zdjęcie profilowe" className="h-full w-full object-cover" /> : user.email?.charAt(0).toUpperCase()}</div><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Zalogowano jako</p><p className="mt-1 text-white/85">{user.email}</p>{isAdmin && <div className="mt-3 flex flex-wrap items-center gap-2"><span className="inline-flex rounded-full border border-amber-300/35 bg-amber-300/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.12)]">ADMIN</span>{adminUserCount !== null && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber-100/60">{adminUserCount} zarejestrowanych użytkowników</span>}</div>}</div></div>
            <label className="settings-reset cursor-pointer"><Upload size={16} /> Zmień zdjęcie<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; setUploadError(""); const result = await uploadAvatar(file); if (result.error) setUploadError(result.error); }} /></label>
          </div>
          {uploadError && <p className="mt-3 text-sm text-rose-300">{uploadError}</p>}
          <button type="button" onClick={() => void signOut()} className="settings-reset mt-5"><LogOut size={16} /> Wyloguj</button>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <FavoriteSection title="Ulubione książki" count={favoriteBooks.length}>
            {favoriteBooks.length ? favoriteBooks.map((book) => <Link key={book.id} href={`/ksiazki/${book.id}/`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3 transition hover:border-white/20"><img src={assetPath(book.cover)} alt="" className="h-16 w-11 rounded-md object-cover" /><span className="font-semibold text-white/85">{book.title}</span></Link>) : <Empty>Nie masz jeszcze ulubionych książek.</Empty>}
          </FavoriteSection>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <FavoriteSection title="Statusy serii" count={seriesStatuses.length}>
            {seriesStatuses.length ? seriesStatuses.map((status) => <div key={status.series} className={`series-status-card series-status-card--${status.level} rounded-xl border border-white/10 bg-white/[0.025] p-4`}>
              <div className="flex items-center gap-3">
                <div className={`series-status-icon series-status-icon--${status.level} flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]`} style={{ color: status.color }} aria-label={`${status.label}: ${status.levelLabel}`}>
                  {status.iconPath ? <span className="h-6 w-6 bg-current" style={{ WebkitMaskImage: `url(${assetPath(status.iconPath)})`, maskImage: `url(${assetPath(status.iconPath)})`, maskRepeat: "no-repeat", maskPosition: "center", maskSize: "contain" }} /> : <Award size={22} />}
                </div>
                <div className="min-w-0 flex-1"><p className="font-semibold text-white/90">{status.label}</p><p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: status.color }}>{status.levelLabel} · {status.percentage}% przeczytanych książek</p></div>
                <span className="font-mono text-xs text-white/45">{status.percentage}%</span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full transition-all" style={{ width: `${status.percentage}%`, backgroundColor: status.color }} /></div>
              <p className="mt-2 text-xs text-white/40">{status.readCount} z {status.totalCount} książek</p>
            </div>) : <Empty>Oznacz książki jako przeczytane, aby budować statusy serii.</Empty>}
          </FavoriteSection>
          <FavoriteSection title="Moje odznaki" count={earnedBadges.length}>
            {earnedBadges.length ? earnedBadges.map(({ badge, definition }) => <button key={badge.badgeId} type="button" onClick={() => setSelectedBadge({ badge, definition })} className="flex min-h-[88px] w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3 text-left transition-colors hover:border-rose-300/35 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70">
              <img src={assetPath(definition.icon)} alt={definition.name} className="h-16 w-16 object-contain" /><span><span className="block font-semibold text-white/90">{definition.name}</span><span className="mt-1 block text-xs leading-5 text-white/45">{definition.description}</span></span>
            </button>) : <Empty>Odznaki pojawią się tutaj po spełnieniu warunków.</Empty>}
          </FavoriteSection>
        </div>
      </>}
      <ProjectCopyright />
      {selectedBadge && <BadgeDetailsModal badge={selectedBadge.badge} definition={selectedBadge.definition} bookTitle={badgeBookTitles.get(selectedBadge.definition.bookId)} onClose={() => setSelectedBadge(null)} />}
    </main>
  </SubpageLayout>;
}

function BadgeDetailsModal({ badge, definition, bookTitle, onClose }: { badge: UserBadge; definition: BadgeDefinition; bookTitle?: string; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const earnedDate = new Date(badge.earnedAt);
  const hasEarnedDate = !Number.isNaN(earnedDate.getTime());

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" role="presentation" onClick={onClose}>
    <div role="dialog" aria-modal="true" aria-labelledby="badge-details-title" className="badge-details-modal relative w-full max-w-lg overflow-y-auto rounded-3xl border border-rose-300/20 bg-[#101014] p-6 shadow-[0_0_80px_rgba(190,24,93,0.18)] sm:p-8" onClick={(event) => event.stopPropagation()}>
      <button type="button" onClick={onClose} aria-label="Zamknij szczegóły odznaki" className="absolute right-4 top-4 flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 text-white/55 transition-colors hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"><X size={20} /></button>
      <div className="flex flex-col items-center text-center">
        <div className="flex h-40 w-40 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.025] p-4 shadow-[0_0_40px_rgba(190,24,93,0.12)] sm:h-48 sm:w-48"><img src={assetPath(definition.icon)} alt={definition.name} className="h-full w-full object-contain" /></div>
        <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-rose-300/70">Odznaka zdobyta</p>
        <h2 id="badge-details-title" className="mt-3 text-3xl font-extrabold tracking-tight text-white">{definition.name}</h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-white/60">{definition.description}</p>
      </div>
      <div className="mt-7 grid gap-3 text-sm">
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Przyznano za</p><p className="mt-2 text-white/80">{bookTitle ? `Przeczytanie książki „${bookTitle}”.` : "Spełnienie warunku odznaki."}</p></div>
        {hasEarnedDate && <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Zdobyto</p><p className="mt-2 text-white/80">{new Intl.DateTimeFormat("pl-PL", { dateStyle: "long" }).format(earnedDate)}</p></div>}
      </div>
    </div>
  </div>;
}

function Panel({ children }: { children: React.ReactNode }) { return <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center text-white/55">{children}</div>; }
function FavoriteSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) { return <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7"><div className="flex items-end justify-between border-b border-white/10 pb-4"><h2 className="text-xl font-semibold text-white">{title}</h2><span className="font-mono text-xs text-white/35">{count}</span></div><div className="mt-4 grid gap-3">{children}</div></section>; }
function Empty({ children }: { children: React.ReactNode }) { return <p className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-white/40">{children}</p>; }
