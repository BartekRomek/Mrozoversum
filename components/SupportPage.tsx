"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Coffee,
  Heart,
  Sparkles
} from "lucide-react";

import { usePageScroll } from "@/components/usePageScroll";
import { assetPath } from "@/lib/assetPath";

type SupportPageProps = {
  onBack?: () => void;
};

export function SupportPage({ onBack }: SupportPageProps) {
  usePageScroll();

  const backControl = onBack ? (
    <button
      type="button"
      onClick={onBack}
      className="group flex items-center gap-3 text-white/65 transition hover:text-white"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition group-hover:border-rose-400/35 group-hover:bg-rose-500/10">
        <ArrowLeft size={18} />
      </span>

      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
        Wróć do mapy
      </span>
    </button>
  ) : (
    <Link
      href="/"
      className="group flex items-center gap-3 text-white/65 transition hover:text-white"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition group-hover:border-rose-400/35 group-hover:bg-rose-500/10">
        <ArrowLeft size={18} />
      </span>

      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
        Wróć do mapy
      </span>
    </Link>
  );

  return (
    <main className="support-page mobile-page-scroll min-h-screen overflow-x-hidden bg-[#08090d] text-[#f4f1ea]">

      {/* TŁO */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(225,29,72,0.17),transparent_34rem),radial-gradient(circle_at_85%_18%,rgba(184,134,11,0.09),transparent_28rem)]" />

      {/* HEADER */}
      <header className="relative border-b border-white/10 bg-[#08090d]/80 backdrop-blur-2xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
          {backControl}

          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300/70">
            Mrozoversum
          </span>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20">

        {/* HERO */}
        <section className="mx-auto max-w-3xl text-center">

          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-rose-300/70">
            Wsparcie projektu
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.12)] sm:text-6xl">
            Postaw kawę twórcy
          </h1>

          <div className="mx-auto mt-6 h-px w-40 bg-gradient-to-r from-transparent via-rose-400 to-transparent shadow-[0_0_16px_rgba(244,63,94,0.6)]" />

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
            Mrozoversum powstało z potrzeby uporządkowania świata, który z
            każdą kolejną książką staje się coraz większy. To projekt tworzony
            po godzinach z pasji do technologii, dobrych historii i twórczości
            Remigiusza Mroza.
          </p>

        </section>


        {/* GŁÓWNA SEKCJA */}
        <section className="mt-14 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">

          {/* LEWA KOLUMNA */}
          <div className="flex h-full flex-col gap-4">

            {/* ZDJĘCIE */}
            <div className="relative min-h-[500px] flex-1 overflow-hidden rounded-3xl border border-white/10 bg-[#0d0f15] shadow-2xl shadow-black/40">

              <div className="absolute inset-0 z-10 bg-gradient-to-br from-rose-500/10 via-transparent to-black/30" />

              <img
                src={assetPath("image/creator.png")}
                alt="Bartek Romek – twórca Mrozoversum"
                className="relative h-full w-full object-cover object-center"
              />

            </div>


            {/* OSOBNY BLOK Z NAZWISKIEM */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.045] to-white/[0.015] px-7 py-6 text-center shadow-xl shadow-black/20">

              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Bartek Romek
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/50">
                Twórca Mrozoversum
              </p>

            </div>

          </div>


          {/* PRAWA KOLUMNA */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-2xl shadow-black/30 sm:p-8">

            <div className="flex items-center gap-3 text-rose-300">
              <BookOpen size={19} />

              <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em]">
                Kilka słów ode mnie
              </h2>
            </div>


            <p className="mt-6 text-lg leading-8 text-white/75 sm:text-xl">
              Mrozoversum nie powstało dlatego, że brakowało kolejnej strony o
              książkach. Powstało dlatego, że sam chciałem w końcu zobaczyć cały
              ten świat w jednym miejscu.
            </p>


            <p className="mt-5 text-sm leading-7 text-white/50">
              Od samego początku obiecałem sobie jedno — Mrozoversum będzie
              projektem w 100% darmowym i dostępnym dla każdego. Nie chcę
              zamykać wiedzy, ciekawostek i powiązań między książkami za
              paywallem ani zasypywać strony reklamami.
            </p>


            <p className="mt-5 text-sm leading-7 text-white/50">
              Projekt tworzę po godzinach, z czystej fascynacji światem
              wykreowanym przez Remigiusza Mroza.
            </p>


            <p className="mt-5 text-sm leading-7 text-white/50">
              Utrzymanie strony, domeny i infrastruktury oczywiście generuje
              koszty. Jeśli uważasz, że Mrozoversum jest wartościowym projektem
              i chcesz pomóc mi rozwijać go dalej, możesz postawić mi symboliczną
              kawę.
            </p>


            {/* KARTY */}
            <div className="mt-10 grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/8 bg-black/15 p-4">

                <Sparkles
                  size={17}
                  className="text-rose-300/80"
                />

                <h3 className="mt-4 text-sm font-semibold text-white/80">
                  Pomysł
                </h3>

                <p className="mt-1 text-xs leading-5 text-white/40">
                  Zobaczyć różne historie jako jedną, połączoną uniwersum.
                </p>

              </div>


              <div className="rounded-2xl border border-white/8 bg-black/15 p-4">

                <BookOpen
                  size={17}
                  className="text-rose-300/80"
                />

                <h3 className="mt-4 text-sm font-semibold text-white/80">
                  Historia
                </h3>

                <p className="mt-1 text-xs leading-5 text-white/40">
                  Projekt, który z prostego pomysłu zaczął rosnąć w całe
                  uniwersum.
                </p>

              </div>


              <div className="rounded-2xl border border-white/8 bg-black/15 p-4">

                <Heart
                  size={17}
                  className="text-rose-300/80"
                />

                <h3 className="mt-4 text-sm font-semibold text-white/80">
                  Przyszłość
                </h3>

                <p className="mt-1 text-xs leading-5 text-white/40">
                  Kolejne książki, postacie, relacje i pomysły, których jeszcze
                  tu nie ma.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* WSPARCIE */}
        <section className="mx-auto mt-5 max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 sm:p-10">

          <div className="grid gap-8 sm:grid-cols-3 sm:items-center">

            <div className="sm:col-span-2">

              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-rose-300/70">
                Wsparcie
              </p>

              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Pomóż rozwijać Mrozoversum
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/55">
                Każda wpłata pomaga utrzymać projekt przy życiu i daje mi jeszcze
                większą motywację do dalszej pracy.
              </p>

            </div>


            <div className="sm:text-right">

              <a
                href="https://buycoffee.to/bartekromek"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-rose-300/25 bg-rose-500/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-rose-100 shadow-[0_0_30px_rgba(225,29,72,0.14)] transition hover:border-rose-300/50 hover:bg-rose-500/25 sm:w-auto"
              >
                <Coffee size={19} />
                Postaw kawę
              </a>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}