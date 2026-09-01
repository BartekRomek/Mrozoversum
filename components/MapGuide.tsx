"use client";

import { useEffect, useState } from "react";
import { BookOpen, CircleDot, GitBranch, Link2, Move, X } from "lucide-react";
import { relationColors } from "@/lib/catalog";

const GUIDE_STORAGE_KEY = "mrozoversum-hide-guide";

type MapGuideProps = {
  openRequest: number;
  introComplete: boolean;
};

const guideSections = [
  {
    icon: BookOpen,
    color: "#f4f1ea",
    title: "KSIĄŻKA",
    text: "Kliknij książkę, aby zobaczyć jej szczegóły, opis, informacje oraz powiązania."
  },
  {
    icon: CircleDot,
    color: relationColors.kontynuacja,
    title: "KONTYNUACJA",
    text: "Bezpośrednia kontynuacja historii lub wątku postaci w kolejnej książce."
  },
  {
    icon: CircleDot,
    color: relationColors.wzmianka,
    title: "WZMIANKA",
    text: "Postać nie pojawia się bezpośrednio w wydarzeniach książki, ale zostaje wspomniana przez innych bohaterów."
  },
  {
    icon: CircleDot,
    color: relationColors.crossover,
    title: "CROSSOVER",
    text: "Postać odgrywa istotną rolę w książce należącej do innej serii niż jej główna seria."
  },
  {
    icon: CircleDot,
    color: relationColors.epizod,
    title: "EPIZOD",
    text: "Postać pojawia się w historii epizodycznie, bez istotnego wpływu na główny wątek."
  },
  {
    icon: GitBranch,
    color: relationColors.zmiana_serii,
    title: "ZMIANA GŁÓWNEJ SERII",
    text: "Postać przechodzi do innej serii i od tego momentu staje się ona jej główną serią."
  },
  {
    icon: Link2,
    color: relationColors.crossover,
    title: "RELACJE",
    text: "Klikaj w linie łączące relacje między seriami, aby zobaczyć, czego dotyczy dane powiązanie oraz które postacie biorą w nim udział."
  },
  {
    icon: Move,
    color: "#f4f1ea",
    title: "MAPA",
    text: "Przesuwaj mapę, aby poruszać się po uniwersum."
  }
];

export function MapGuide({ openRequest, introComplete }: MapGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [openMode, setOpenMode] = useState<"auto" | "manual">("auto");
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (!introComplete || window.localStorage.getItem(GUIDE_STORAGE_KEY) === "true") return;

    const timeoutId = window.setTimeout(() => {
      setOpenMode("auto");
      setDontShowAgain(false);
      setIsOpen(true);
    }, 450);
    return () => window.clearTimeout(timeoutId);
  }, [introComplete]);

  useEffect(() => {
    if (openRequest > 0) {
      setOpenMode("manual");
      setDontShowAgain(window.localStorage.getItem(GUIDE_STORAGE_KEY) === "true");
      setIsClosing(false);
      setIsOpen(true);
    }
  }, [openRequest]);

  const closeGuide = () => {
    if (dontShowAgain) {
      window.localStorage.setItem(GUIDE_STORAGE_KEY, "true");
    } else {
      window.localStorage.removeItem(GUIDE_STORAGE_KEY);
    }
    setIsClosing(true);
    window.setTimeout(() => setIsOpen(false), 260);
  };

  if (!isOpen) return null;

  return (
    <div className={`map-guide${isClosing ? " map-guide--closing" : ""}`} role="dialog" aria-modal="true" aria-labelledby="map-guide-title">
      <section className="map-guide__panel">
        <button
          type="button"
          onClick={closeGuide}
          className="map-guide__close"
          aria-label="Zamknij instrukcję"
        >
          <X size={20} />
        </button>

        <div className="map-guide__intro">
          <p className="map-guide__eyebrow">MROZOVERSUM</p>
          <h2 id="map-guide-title">JAK KORZYSTAĆ Z MAPY?</h2>
          <p className="map-guide__subtitle">Poznaj najważniejsze interakcje Mrozoversum.</p>
        </div>

        <div className="map-guide__sections">
          {guideSections.map(({ icon: Icon, color, title, text }) => (
            <div className="map-guide__item" key={title}>
              <div className="map-guide__icon" style={{ color, borderColor: `${color}44` }}>
                <Icon size={18} strokeWidth={1.8} />
              </div>
              <div className="map-guide__copy">
                <h3 style={{ color }}>{title}</h3>
                <p>{text}</p>
                {title === "MAPA" && <p>Przybliżaj i oddalaj, aby zobaczyć więcej szczegółów.</p>}
              </div>
            </div>
          ))}
        </div>

        <label className="map-guide__remember">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(event) => setDontShowAgain(event.target.checked)}
          />
          <span>Nie pokazuj ponownie</span>
        </label>

        <button type="button" onClick={closeGuide} className="map-guide__confirm">
          {openMode === "manual" ? "ZAMKNIJ" : "ROZUMIEM"}
        </button>
      </section>
    </div>
  );
}
