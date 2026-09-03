"use client";

import { useEffect, useState } from "react";
import connections from "@/data/connections.json";
import books from "@/data/books.json";
import characters from "@/data/characters.json"; // Dodaj import
import { MrozoversumMap } from "@/components/MrozoversumMap";
import { MrozoversumIntro } from "@/components/MrozoversumIntro";
import { SupportPage } from "@/components/SupportPage";
import { SettingsPage } from "@/components/SettingsPage";
import { BugReportPage } from "@/components/BugReportPage";
import type { Book, BookConnection, Character } from "@/lib/types";

export default function Home() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [activeView, setActiveView] = useState<"map" | "support" | "settings" | "bug-report">("map");

  useEffect(() => {
    document.documentElement.dataset.mrozoversumTheme =
      window.localStorage.getItem("mrozoversum-theme") === "light" ? "light" : "dark";
  }, []);

  return (
    <main className={activeView === "map" ? "min-h-screen overflow-hidden" : "min-h-screen"}>
      <div className={activeView === "map" ? "" : "pointer-events-none invisible fixed inset-0 z-0"} aria-hidden={activeView !== "map"}>
        <>
          <div className="mrozoversum-map-enter">
            <MrozoversumMap
              books={books as Book[]}
              connections={connections as BookConnection[]}
              characters={characters as Character[]} // Przekaż postacie
              introComplete={isIntroComplete}
              onOpenSupport={() => setActiveView("support")}
              onOpenSettings={() => setActiveView("settings")}
              onOpenBugReport={() => setActiveView("bug-report")}
            />
          </div>
          <MrozoversumIntro onComplete={() => setIsIntroComplete(true)} />
        </>
      </div>
      {activeView === "support" ? (
        <div className="relative z-10"><SupportPage onBack={() => setActiveView("map")} /></div>
      ) : activeView === "settings" ? (
        <div className="relative z-10"><SettingsPage onBack={() => setActiveView("map")} /></div>
      ) : (
        activeView === "bug-report" && <div className="relative z-10"><BugReportPage onBack={() => setActiveView("map")} /></div>
      )}
    </main>
  );
}
