"use client";

import { useEffect, type CSSProperties } from "react";
import { Award, X } from "lucide-react";
import { assetPath } from "@/lib/assetPath";
import { badgeById } from "@/data/badges";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";

const confettiColors = ["#f43f5e", "#facc15", "#f8fafc", "#fb7185", "#f59e0b", "#cbd5e1"];
const confetti = Array.from({ length: 34 }, (_, index) => {
  const angle = (index / 34) * Math.PI * 2;
  const distance = 130 + ((index * 47) % 170);
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 45,
    rotation: 180 + ((index * 71) % 360),
    delay: (index % 7) * 35,
    color: confettiColors[index % confettiColors.length]
  };
});

function ConfettiBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {confetti.map((piece, index) => (
        <span
          key={index}
          className="achievement-confetti"
          style={{
            "--confetti-x": `${piece.x}px`,
            "--confetti-y": `${piece.y}px`,
            "--confetti-rotation": `${piece.rotation}deg`,
            "--confetti-delay": `${piece.delay}ms`,
            backgroundColor: piece.color
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

export function SeriesAchievementOverlay() {
  const { seriesAchievement, badgeAchievement, dismissSeriesAchievement, dismissBadgeAchievement } = useSupabaseAuth();
  const achievement = seriesAchievement ?? badgeAchievement;
  const badge = badgeAchievement ? badgeById[badgeAchievement.badgeId] : null;
  const dismiss = () => {
    dismissSeriesAchievement();
    dismissBadgeAchievement();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!achievement) return null;

  return (
    <div className="achievement-backdrop fixed inset-0 z-[200] grid place-items-center bg-black/75 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Nowe osiągnięcie" onClick={dismiss}>
      <div className="achievement-card relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#0c0d12] p-8 text-center shadow-2xl shadow-black/60" onClick={(event) => event.stopPropagation()}>
        <ConfettiBurst />
        <button type="button" onClick={dismiss} className="absolute right-4 top-4 z-10 rounded-full border border-white/10 p-2 text-white/55 transition hover:text-white" aria-label="Zamknij"><X size={18} /></button>
        <p className="relative z-10 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-rose-300/75">{badge ? "Nowa odznaka" : "Nowy status serii"}</p>
        {seriesAchievement && <>
          <div className="achievement-seal relative z-10 mx-auto mt-7 flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] shadow-lg" style={{ color: seriesAchievement.levelColor }}>
            {seriesAchievement.iconPath ? <span className="h-12 w-12 bg-current" style={{ WebkitMaskImage: `url(${assetPath(seriesAchievement.iconPath)})`, maskImage: `url(${assetPath(seriesAchievement.iconPath)})`, maskRepeat: "no-repeat", maskPosition: "center", maskSize: "contain" }} /> : <Award size={48} strokeWidth={1.5} />}
          </div>
          <h2 className="relative z-10 mt-6 text-3xl font-extrabold tracking-tight text-white">{seriesAchievement.label}</h2>
          <p className="relative z-10 mt-2 text-lg font-semibold" style={{ color: seriesAchievement.levelColor }}>{seriesAchievement.levelLabel}</p>
          <p className="relative z-10 mt-4 font-mono text-xs uppercase tracking-[0.18em] text-white/45">{seriesAchievement.readCount} / {seriesAchievement.totalCount} książek · {seriesAchievement.percentage}%</p>
        </>}
        {badge && <div className="relative z-10 mt-6 flex items-center gap-4 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-3 text-left">
          <img src={assetPath(badge.icon)} alt="" className="h-16 w-16 object-contain" />
          <div><p className="text-sm font-bold text-white">{badge.name}</p><p className="mt-1 text-xs leading-relaxed text-white/55">{badge.description}</p></div>
        </div>}
        <button type="button" onClick={dismiss} className="relative z-10 mt-8 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Kontynuuj</button>
      </div>
    </div>
  );
}
