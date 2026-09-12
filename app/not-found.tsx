import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nie znaleziono strony", robots: { index: false, follow: false } };

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-6 text-center text-white"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-rose-300/70">404</p><h1 className="mt-3 text-3xl font-bold">Nie znaleziono strony.</h1><a className="support-back mt-6" href="/">← Wróć do mapy</a></div></main>;
}
