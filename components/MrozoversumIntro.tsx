"use client";

import { useEffect, useState } from "react";
import { getKonfrontacjaCountdown } from "@/lib/konfrontacja";

export function MrozoversumIntro({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [showFeature, setShowFeature] = useState(true);

  useEffect(() => {
    const updateFeature = () => setShowFeature(getKonfrontacjaCountdown() > 0);
    updateFeature();
    const featureTimer = window.setInterval(updateFeature, 1000);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const duration = reduceMotion ? 0 : 3300;
    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(featureTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="mrozoversum-intro" aria-label="Mrozoversum">
      <div className="mrozoversum-intro__content">
        <h1>MROZOVERSUM</h1>
        <div className="mrozoversum-intro__accent" />
        {showFeature && (
          <strong className="mrozoversum-intro__feature">KONFRONTACJA NADCHODZI</strong>
        )}
        <p>Jedno wielkie uniwersum Remigiusza Mroza</p>
      </div>
    </div>
  );
}
