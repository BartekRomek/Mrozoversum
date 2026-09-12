"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    trackEvent("app_error", { error_type: "render_error" });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-6 text-center text-white">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-rose-300/70">Błąd aplikacji</p>
        <h1 className="mt-3 text-3xl font-bold">Nie udało się załadować tego widoku.</h1>
        <button className="mt-6 rounded-xl border border-rose-400/30 px-5 py-3 text-sm" onClick={() => reset()}>Spróbuj ponownie</button>
      </div>
    </main>
  );
}
