"use client";

import { useEffect, useState } from "react";

const LAUNCH_DATE = new Date("2026-09-10T18:00:00+02:00");

const ADMIN_CODE = "MROZOVERSUM2026";

export function LaunchCountdown({
  children
}: {
  children: React.ReactNode;
}) {
  const [isLaunched, setIsLaunched] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const difference = LAUNCH_DATE.getTime() - Date.now();

      if (difference <= 0) {
        setIsLaunched(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
          (difference / (1000 * 60)) % 60
        ),
        seconds: Math.floor(
          (difference / 1000) % 60
        )
      });
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAdminAccess = () => {
    if (code === ADMIN_CODE) {
      setIsPreview(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      const next = prev + 1;

      if (next >= 5) {
        setShowAdmin(true);
        return 0;
      }

      return next;
    });
  };

  if (isLaunched || isPreview) {
    return <>{children}</>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#07080c] px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.14),transparent_55%)]" />

      <div className="relative z-10 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.45em] text-rose-300/70">
          Premiera już za
        </p>

        <h1
          onClick={handleLogoClick}
          className="mb-12 cursor-default select-none text-5xl font-black tracking-tight sm:text-7xl"
        >
          MROZOVERSUM
        </h1>

        <div className="flex justify-center gap-3 sm:gap-6">
          <TimeBox value={timeLeft.days} label="dni" />
          <TimeBox value={timeLeft.hours} label="godzin" />
          <TimeBox value={timeLeft.minutes} label="minut" />
          <TimeBox value={timeLeft.seconds} label="sekund" />
        </div>

        <div className="mx-auto mt-10 h-px w-48 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

        {showAdmin && (
          <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAdminAccess();
                }
              }}
              placeholder="Kod dostępu"
              className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-center font-mono text-sm text-white outline-none transition placeholder:text-white/20 focus:border-rose-500/50"
              autoFocus
            />

            <button
              onClick={handleAdminAccess}
              className="rounded-xl bg-rose-600 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider transition hover:bg-rose-500"
            >
              Wejdź
            </button>

            {error && (
              <p className="font-mono text-xs text-rose-400">
                Nieprawidłowy kod dostępu
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function TimeBox({
  value,
  label
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="min-w-[70px] sm:min-w-[110px]">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-5 backdrop-blur">
        <div className="font-mono text-3xl font-bold sm:text-5xl">
          {String(value).padStart(2, "0")}
        </div>
      </div>

      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
    </div>
  );
}