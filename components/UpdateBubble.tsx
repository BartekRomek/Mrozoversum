"use client";

import { Bell, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { currentVersion, updates } from "@/lib/updates";

const LAST_READ_VERSION_KEY = "mrozoversum-last-read-version";

export function UpdateBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastReadVersion, setLastReadVersion] = useState<string | null>(null);

  useEffect(() => {
    setLastReadVersion(window.localStorage.getItem(LAST_READ_VERSION_KEY));
  }, []);

  const hasUnreadUpdate = lastReadVersion !== currentVersion;

  const handleOpen = () => {
    setIsOpen((open) => !open);
    setLastReadVersion(currentVersion);
    window.localStorage.setItem(LAST_READ_VERSION_KEY, currentVersion);
  };

  return (
    <div className="fixed bottom-[4.25rem] right-3 z-[70] sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-label="Historia aktualizacji"
          className="mb-3 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-rose-300/20 bg-[#090a0f]/95 text-white shadow-2xl shadow-black/60 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-rose-300/75">
                Aktualizacje
              </p>
              <h2 className="mt-1 text-sm font-semibold text-white">Co nowego?</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Zamknij historię aktualizacji"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/55 transition hover:border-white/25 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-[min(60vh,28rem)] overflow-y-auto px-4 py-2">
            {updates.map((update) => (
              <article key={update.version} className="border-b border-white/10 py-4 last:border-0">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                    v{update.version}
                  </h3>
                  <time className="font-mono text-[10px] text-white/35">{update.date}</time>
                </div>
                <p className="mt-2 text-sm font-medium text-white/85">{update.title}</p>
                <ul className="mt-2 space-y-1.5 text-xs leading-5 text-white/55">
                  {update.changes.map((change) => (
                    <li key={change} className="flex gap-2">
                      <ChevronRight className="mt-0.5 shrink-0 text-rose-300/70" size={13} />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? "Zamknij" : "Otwórz"} aktualizacje, wersja ${currentVersion}`}
        className="group relative flex h-10 items-center gap-1.5 rounded-full border border-white/15 bg-[#090a0f]/90 px-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-white/75 shadow-xl shadow-black/40 backdrop-blur-xl transition hover:border-rose-300/50 hover:text-white sm:h-12 sm:gap-2 sm:px-4 sm:text-xs sm:tracking-[0.12em]"
      >
        <Bell size={14} className="text-rose-300/85 transition group-hover:rotate-[-8deg] sm:h-[15px] sm:w-[15px]" />
        <span>v{currentVersion}</span>
        {hasUnreadUpdate && (
          <span
            aria-label="Nowa aktualizacja"
            className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#090a0f] bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
          />
        )}
      </button>
    </div>
  );
}
