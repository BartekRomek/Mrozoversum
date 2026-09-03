"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Coffee, Heart, Sparkles } from "lucide-react";
import { usePageScroll } from "@/components/usePageScroll";

type SupportPageProps = { onBack?: () => void };

export function SupportPage({ onBack }: SupportPageProps) {
  usePageScroll();

  const backControl = onBack ? (
    <button type="button" onClick={onBack} className="group flex items-center gap-3 text-white/65 transition hover:text-white">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition group-hover:border-rose-400/35 group-hover:bg-rose-500/10"><ArrowLeft size={18} /></span>
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">Wróć do mapy</span>
    </button>
  ) : (
    <Link href="/" className="group flex items-center gap-3 text-white/65 transition hover:text-white">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition group-hover:border-rose-400/35 group-hover:bg-rose-500/10"><ArrowLeft size={18} /></span>
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">Wróć do mapy</span>
    </Link>
  );

  return (
    <main className="support-page mobile-page-scroll min-h-screen overflow-x-hidden bg-[#08090d] text-[#f4f1ea]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(225,29,72,0.17),transparent_34rem),radial-gradient(circle_at_85%_18%,rgba(184,134,11,0.09),transparent_28rem)]" />
      <header className="relative border-b border-white/10 bg-[#08090d]/80 backdrop-blur-2xl"><div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8 sm:py-7">{backControl}<span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300/70">Mrozoversum</span></div></header>
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20">
        <section className="mx-auto max-w-3xl text-center"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-rose-300/70">Wsparcie projektu</p><h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.12)] sm:text-6xl">Postaw kawę twórcy</h1><div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-rose-400 to-transparent shadow-[0_0_16px_rgba(244,63,94,0.6)]" /><p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">Miejsce na historię projektu, kilka słów od twórcy i dalszy rozwój uniwersum. Ta przestrzeń będzie rosła razem z Mrozoversum.</p></section>
        <section className="mt-14 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch"><div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1b111a] via-[#0e1016] to-[#08090d] p-6 shadow-2xl shadow-black/40 sm:p-8"><div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" /><div className="relative flex h-full flex-col justify-between"><div><span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">Twórca projektu</span><div className="mt-6 flex h-48 items-center justify-center rounded-2xl border border-rose-300/15 bg-black/20 shadow-[inset_0_0_50px_rgba(225,29,72,0.08)]"><div className="flex h-24 w-24 items-center justify-center rounded-full border border-rose-300/20 bg-rose-500/10 text-rose-200 shadow-[0_0_35px_rgba(225,29,72,0.2)]"><span className="font-serif text-4xl italic">B</span></div></div></div><div className="mt-8"><h2 className="text-2xl font-bold text-white">Bartek Rómek</h2><p className="mt-2 text-sm leading-6 text-white/50">Zdjęcie twórcy pojawi się tutaj wkrótce.</p></div></div></div><div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-2xl shadow-black/30 sm:p-8"><div className="flex items-center gap-3 text-rose-300"><BookOpen size={19} /><h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em]">Kilka słów ode mnie</h2></div><p className="mt-6 text-lg leading-8 text-white/75 sm:text-xl">Mrozoversum to projekt tworzony z fascynacji opowieściami, bohaterami i połączeniami, które wyłaniają się między książkami.</p><p className="mt-5 text-sm leading-7 text-white/50">Tutaj znajdzie się osobista wiadomość do osób, które odwiedzają mapę, odkrywają kolejne serie i pomagają rozwijać ten projekt.</p><div className="mt-10 grid gap-3 sm:grid-cols-3">{[[Sparkles,"Pomysł","Skąd wzięła się mapa"],[BookOpen,"Historia","Jak powstawał projekt"],[Heart,"Przyszłość","Dokąd zmierza uniwersum"]].map(([Icon,title,text])=>{const IconComponent=Icon as typeof Sparkles;return <div key={title as string} className="rounded-2xl border border-white/8 bg-black/15 p-4"><IconComponent size={17} className="text-rose-300/80" /><h3 className="mt-4 text-sm font-semibold text-white/80">{title as string}</h3><p className="mt-1 text-xs leading-5 text-white/40">{text as string}</p></div>;})}</div></div></section>
        <section className="mx-auto mt-5 max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 sm:p-10"><div className="grid gap-8 sm:grid-cols-3 sm:items-center"><div className="sm:col-span-2"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-rose-300/70">Wsparcie</p><h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Pomóż rozwijać Mrozoversum</h2><p className="mt-4 text-sm leading-7 text-white/55">Jeśli mapa jest dla Ciebie ciekawa i chcesz dołożyć swoją cegiełkę do jej dalszego rozwoju, możesz postawić mi symboliczną kawę.</p></div><div className="sm:text-right"><a href="https://buycoffee.to/bartekromek" target="_blank" rel="noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-rose-300/25 bg-rose-500/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-rose-100 shadow-[0_0_30px_rgba(225,29,72,0.14)] transition hover:border-rose-300/50 hover:bg-rose-500/25 sm:w-auto"><Coffee size={19} />Postaw kawę</a></div></div></section>
      </div>
    </main>
  );
}
