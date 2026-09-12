"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type SubpageLayoutProps = {
  children: React.ReactNode;
  onBack?: () => void;
  className?: string;
};

export function SubpageLayout({ children, onBack, className = "" }: SubpageLayoutProps) {
  const backControl = onBack ? (
    <button type="button" onClick={onBack} className="subpage-layout__back">
      <span className="subpage-layout__back-icon"><ArrowLeft size={18} /></span>
      <span>Wróć do mapy</span>
    </button>
  ) : (
    <Link href="/" className="subpage-layout__back">
      <span className="subpage-layout__back-icon"><ArrowLeft size={18} /></span>
      <span>Wróć do mapy</span>
    </Link>
  );

  return (
    <main className={`subpage-layout mobile-page-scroll min-h-screen overflow-x-hidden text-[#f4f1ea] ${className}`}>
      <div className="subpage-layout__glow pointer-events-none fixed inset-0" />
      <header className="subpage-layout__header relative z-10 border-b border-white/10 bg-[#08090d]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-full w-full max-w-[1500px] items-center justify-between gap-4 px-5 sm:px-8">
          {backControl}
          <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-rose-300/70">
            Mrozoversum
          </span>
        </div>
      </header>
      <div className="relative z-10">{children}</div>
    </main>
  );
}
