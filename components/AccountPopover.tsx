"use client";

import { LogIn, LogOut, UserRound, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";

function GoogleIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z" />
    <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75Z" />
    <path fill="#FBBC05" d="M6.54 13.84A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.84V7.63H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.37l3.24-2.53Z" />
    <path fill="#EA4335" d="M12 6.13c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.2 14.63 2.25 12 2.25A9.75 9.75 0 0 0 3.3 7.63l3.24 2.53C7.31 7.85 9.46 6.13 12 6.13Z" />
  </svg>;
}

export function AccountPopover({ autoOpen = false, responsive = "all", className = "", triggerClassName, onOpenChange }: { autoOpen?: boolean; responsive?: "all" | "desktop" | "mobile"; className?: string; triggerClassName?: string; onOpenChange?: (open: boolean) => void }) {
  const { configured, loading, user, signIn, signInWithGoogle, resetPassword, signUp, resendConfirmation, signOut, isAdmin, adminUserCount } = useSupabaseAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageIsSuccess, setMessageIsSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmationPending, setConfirmationPending] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const isVisibleVariant = responsive === "all" || (responsive === "desktop" ? isDesktop : !isDesktop);
    if (autoOpen && isVisibleVariant && !loading && !user) {
      setOpen(true);
      onOpenChange?.(true);
    }
  }, [autoOpen, loading, user, onOpenChange, responsive]);

  const submit = async (mode: "login" | "signup", event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setBusy(true);
    setMessage("");
    setMessageIsSuccess(false);
    setConfirmationPending(false);
    const result = mode === "login" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (result.error) {
      setConfirmationPending(mode === "login" && /confirm|potwierdz/i.test(result.error));
      setMessage(result.error);
      return;
    }
    setPassword("");
    setMessageIsSuccess(true);
    const needsConfirmation = mode === "signup" && "needsConfirmation" in result && Boolean(result.needsConfirmation);
    setConfirmationPending(needsConfirmation);
    setMessage(needsConfirmation
      ? "Sprawdź skrzynkę e-mail, aby potwierdzić konto."
      : "Zalogowano.");
  };

  const signInGoogle = async () => {
    setBusy(true);
    setMessage("");
    setMessageIsSuccess(false);
    const result = await signInWithGoogle();
    if (result.error) {
      setBusy(false);
      setMessage(result.error);
    }
  };

  const sendPasswordReset = async () => {
    if (!email.trim()) {
      setMessage("Wpisz adres e-mail, aby zresetować hasło.");
      setMessageIsSuccess(false);
      return;
    }

    setBusy(true);
    setMessage("");
    setMessageIsSuccess(false);
    const result = await resetPassword(email.trim());
    setBusy(false);
    setMessage(result.error ?? "Wysłaliśmy wiadomość z linkiem do resetu hasła.");
    setMessageIsSuccess(!result.error);
  };

  const setPopoverOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return <div className={`relative shrink-0 ${className}`}>
    <button type="button" onClick={() => { setPopoverOpen(!open); setMessage(""); }} aria-expanded={open} aria-label="Otwórz konto użytkownika" className={`${triggerClassName ?? (responsive === "mobile" ? "flex w-full items-center gap-3 rounded-xl border border-white/10 px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/75 transition hover:bg-white/[0.06] hover:text-white" : "group flex shrink-0 items-center gap-1 rounded-lg border border-transparent px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/65 transition hover:border-white/10 hover:bg-white/[0.06] hover:text-white sm:gap-1.5 sm:px-2.5 sm:text-[10px] lg:px-3 lg:text-[11px]")} ${open ? "invisible" : ""}`}>
      <UserRound size={responsive === "mobile" ? 16 : 14} className="transition group-hover:text-white" />
      <span>Konto</span>
      {user && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#090a0f] bg-emerald-400" />}
    </button>

    {open && <section className={responsive === "mobile" ? "fixed left-1/2 top-[50dvh] z-[70] max-h-[calc(100dvh-2rem)] w-[min(22rem,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-[#090a0f]/95 p-4 text-white shadow-2xl shadow-black/60 backdrop-blur-xl" : "fixed right-3 top-16 z-[70] w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-white/10 bg-[#090a0f]/95 p-4 text-white shadow-2xl shadow-black/60 backdrop-blur-xl lg:absolute lg:right-0 lg:top-[calc(100%+0.75rem)]"}>
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3"><div><p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-rose-300/70">Konto</p><h2 className="mt-1 text-sm font-semibold text-white">Mrozoversum</h2></div><button type="button" onClick={() => setPopoverOpen(false)} aria-label="Zamknij konto" className="text-white/45 transition hover:text-white"><X size={16} /></button></div>
      {!configured ? <p className="pt-4 text-sm leading-6 text-white/55">Logowanie nie jest jeszcze skonfigurowane.</p> : loading ? <p className="pt-4 text-sm text-white/55">Sprawdzanie sesji…</p> : user ? <div className="pt-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-rose-300/30 bg-rose-500/10 text-sm font-bold text-rose-100">{user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="" className="h-full w-full object-cover" /> : user.email?.charAt(0).toUpperCase()}</div><p className="min-w-0 break-all text-sm text-white/75">{user.email}</p></div>{isAdmin && <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] px-3 py-2"><span className="rounded-full border border-amber-300/35 bg-amber-300/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.12)]">ADMIN</span>{adminUserCount !== null && <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-amber-100/65">{adminUserCount} użytkowników</span>}</div>}<Link href="/konto/" onClick={() => setPopoverOpen(false)} className="settings-reset mt-3 w-full">Moje konto</Link><button type="button" disabled={busy} onClick={async () => { setBusy(true); const result = await signOut(); setBusy(false); setMessage(result.error ?? "Wylogowano."); }} className="settings-reset mt-2"><LogOut size={16} /> Wyloguj</button></div> : <div className="pt-4"><button type="button" disabled={busy} onClick={() => void signInGoogle()} className="settings-reset w-full justify-center"><GoogleIcon size={16} /> Kontynuuj z Google</button><div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-white/30"><span className="h-px flex-1 bg-white/10" /> lub <span className="h-px flex-1 bg-white/10" /></div><form className="settings-auth-form" onSubmit={(event) => void submit("login", event)}><label><span>E-mail</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="twoj@email.pl" /></label><label><span>Hasło</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} placeholder="minimum 6 znaków" /></label><div className="flex flex-wrap gap-2"><button type="submit" disabled={busy} className="settings-reset"><LogIn size={16} /> Zaloguj</button><button type="button" disabled={busy} onClick={() => { const form = document.querySelector<HTMLFormElement>(".settings-auth-form"); if (form) void submit("signup"); }} className="settings-reset">Załóż konto</button></div></form></div>}
      {!user && configured && !loading && <button type="button" disabled={busy} onClick={() => void sendPasswordReset()} className="mt-3 w-full text-left text-xs text-white/45 underline-offset-4 transition hover:text-rose-200 hover:underline">Zresetuj hasło</button>}
      {message && <p className={`mt-3 text-sm ${messageIsSuccess ? "text-emerald-300" : "text-rose-300"}`}>{message}</p>}
    </section>}
  </div>;
}
