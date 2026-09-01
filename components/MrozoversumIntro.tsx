"use client";

import { useEffect, useState } from "react";

export function MrozoversumIntro({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const duration = reduceMotion ? 0 : 3300;
    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="mrozoversum-intro" aria-label="Mrozoversum">
      <div className="mrozoversum-intro__content">
        <h1>MROZOVERSUM</h1>
        <div className="mrozoversum-intro__accent" />
        <p>Jedno wielkie uniwersum Remigiusza Mroza</p>
      </div>
    </div>
  );
}
