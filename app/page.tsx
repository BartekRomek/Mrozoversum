"use client";

import { LaunchCountdown } from "@/components/LaunchCountdown";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import connections from "@/data/connections.json";
import books from "@/data/books.json";
import characters from "@/data/characters.json";

import { MrozoversumMap } from "@/components/MrozoversumMap";
import { MrozoversumIntro } from "@/components/MrozoversumIntro";
import { SupportPage } from "@/components/SupportPage";
import { SettingsPage } from "@/components/SettingsPage";
import { BugReportPage } from "@/components/BugReportPage";
const CharacterAlbum = dynamic(
  () => import("@/components/CharacterAlbum").then((module) => module.CharacterAlbum),
  { ssr: false, loading: () => <div className="min-h-screen bg-[#08090c]" /> }
);

import type { Book, BookConnection, Character } from "@/lib/types";

export default function Home() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  const [activeView, setActiveView] = useState<
    "map" | "support" | "settings" | "bug-report" | "characters"
  >("map");

  useEffect(() => {
    document.documentElement.dataset.mrozoversumTheme =
      window.localStorage.getItem("mrozoversum-theme") === "light"
        ? "light"
        : "dark";
  }, []);

  return (
    <LaunchCountdown>
      <main
        className={
          activeView === "map"
            ? "min-h-screen overflow-hidden"
            : "min-h-screen"
        }
      >
        {/* MAPA */}
        <div
          className={
            activeView === "map"
              ? ""
              : "pointer-events-none invisible fixed inset-0 z-0"
          }
          aria-hidden={activeView !== "map"}
        >
          <div className="mrozoversum-app-shell flex h-[100dvh] flex-col overflow-hidden">
            <div className="mrozoversum-map-enter min-h-0 flex-1">
              <MrozoversumMap
                books={books as Book[]}
                connections={connections as BookConnection[]}
                characters={characters as Character[]}
                introComplete={isIntroComplete}
                onOpenSupport={() => setActiveView("support")}
                onOpenSettings={() => setActiveView("settings")}
                onOpenBugReport={() => setActiveView("bug-report")}
                onOpenCharacters={() => setActiveView("characters")}
              />
            </div>

            <MrozoversumIntro
              onComplete={() => setIsIntroComplete(true)}
            />
          </div>
        </div>

        {/* WSPARCIE */}
        {activeView === "support" ? (
          <div className="relative z-10">
            <SupportPage onBack={() => setActiveView("map")} />
          </div>
        ) : activeView === "settings" ? (
          /* USTAWIENIA */
          <div className="relative z-10">
            <SettingsPage onBack={() => setActiveView("map")} />
          </div>
        ) : activeView === "characters" ? (
          /* BOHATEROWIE */
          <div className="relative z-10">
            <CharacterAlbum
              onBack={() => setActiveView("map")}
            />
          </div>
        ) : activeView === "bug-report" ? (
          /* ZGŁOŚ BŁĄD */
          <div className="relative z-10">
            <BugReportPage onBack={() => setActiveView("map")} />
          </div>
        ) : null}
      </main>
    </LaunchCountdown>
  );
}
