"use client";

import { LogIn, LogOut, UserRound, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";

export function AccountPopover() {
  const { configured, loading, user, signIn, signUp, signOut } = useSupabaseAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>, mode: "login" | "signup") => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const result = mode === "login" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (result.error) {
      setMessage(result.error);
      return;
    }
    setPassword("");
    setMessage(mode === "signup" && "needsConfirmation" in result && result.needsConfirmation
      ? "Sprawdź skrzynkę e-mail, aby potwierdzić konto."
      : "Zalogowano.");
  };

  return <div className="relative shrink-0">
    <button type="button" onClick={() => { setOpen((value) => !value); setMessage(""); }} aria-expanded={open} aria-label="Otwórz konto użytkownika" className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_28px_rgba(0,0,0,0.18)] transition hover:border-rose-400/35 hover:bg-rose-500/10 hover:text-rose-50 lg:h-10 lg:w-10">
      <UserRound size={17} className="transition group-hover:text-rose-200" />
      {user && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#090a0f] bg-emerald-400" />}
    </button>

    {open && <section className="fixed right-3 top-16 z-[70] w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-white/10 bg-[#090a0f]/95 p-4 text-white shadow-2xl shadow-black/60 backdrop-blur-xl lg:absolute lg:right-0 lg:top-[calc(100%+0.75rem)]">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3"><div><p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-rose-300/70">Konto</p><h2 className="mt-1 text-sm font-semibold text-white">Mrozoversum</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Zamknij konto" className="text-white/45 transition hover:text-white"><X size={16} /></button></div>
      {!configured ? <p className="pt-4 text-sm leading-6 text-white/55">Logowanie nie jest jeszcze skonfigurowane.</p> : loading ? <p className="pt-4 text-sm text-white/55">Sprawdzanie sesji…</p> : user ? <div className="pt-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-rose-300/30 bg-rose-500/10 text-sm font-bold text-rose-100">{user.user_metadata?.avatar_url ? <img src={user.user_metadata.avatar_url} alt="" className="h-full w-full object-cover" /> : user.email?.charAt(0).toUpperCase()}</div><p className="min-w-0 break-all text-sm text-white/75">{user.email}</p></div><Link href="/konto/" onClick={() => setOpen(false)} className="settings-reset mt-3 w-full"><UserRound size={16} /> Konto i ulubione</Link><button type="button" disabled={busy} onClick={async () => { setBusy(true); const result = await signOut(); setBusy(false); setMessage(result.error ?? "Wylogowano."); }} className="settings-reset mt-2"><LogOut size={16} /> Wyloguj</button></div> : <form className="settings-auth-form pt-4" onSubmit={(event) => void submit(event, "login")}><label><span>E-mail</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="twoj@email.pl" /></label><label><span>Hasło</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} placeholder="minimum 6 znaków" /></label><div className="flex flex-wrap gap-2"><button type="submit" disabled={busy} className="settings-reset"><LogIn size={16} /> Zaloguj</button><button type="button" disabled={busy} onClick={() => { const form = document.querySelector<HTMLFormElement>(".settings-auth-form"); if (form) void submit({ preventDefault: () => undefined } as FormEvent<HTMLFormElement>, "signup"); }} className="settings-reset">Załóż konto</button></div></form>}
      {message && <p className="mt-3 text-sm text-rose-300">{message}</p>}
    </section>}
  </div>;
}
