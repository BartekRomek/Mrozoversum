"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Paperclip, Send, X } from "lucide-react";
import { usePageScroll } from "@/components/usePageScroll";

const categories = ["Błąd techniczny", "Błędne informacje", "Brakujące informacje", "Problem z postacią", "Problem z relacją", "Problem z książką", "Inne"];

export function BugReportPage({ onBack }: { onBack?: () => void }) {
  usePageScroll();
  const [error, setError] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const back = onBack ? <button type="button" onClick={onBack} className="support-back"><ArrowLeft size={18} /> Wróć do mapy</button> : <a href="/" className="support-back"><ArrowLeft size={18} /> Wróć do mapy</a>;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) { setError("Uzupełnij wszystkie wymagane pola."); form.reportValidity(); return; }
    setError("");
  };
  const chooseFile = (file: File | undefined) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type)) { setError("Dozwolone są pliki JPG, JPEG, PNG, WEBP i PDF."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Załącznik może mieć maksymalnie 5 MB."); return; }
    setError(""); setAttachment(file);
  };
  return <main className="bug-report-page mobile-page-scroll min-h-screen overflow-x-hidden bg-[#08090d] px-5 py-8 text-[#f4f1ea] sm:px-8 sm:py-12"><div className="mx-auto max-w-3xl">{back}<header className="mt-12"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-rose-300/70">Kontakt</p><h1 className="mt-3 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">Zgłoś błąd</h1><p className="mt-5 max-w-2xl text-base leading-7 text-white/60">Znalazłeś błąd, nieścisłość lub brakujące informacje? Daj mi znać. Każde zgłoszenie pomaga rozwijać Mrozoversum.</p></header>
    <form onSubmit={submit} className="report-form mt-10"><Field label="Imię i nazwisko" name="name" required /><Field label="Seria" name="series" required /><Field label="Postać" name="character" required /><label><span>Typ zgłoszenia</span><select name="category" defaultValue={categories[0]}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><Field label="Adres e-mail" name="email" type="email" hint="Opcjonalnie, jeśli chcesz otrzymać odpowiedź." /><label><span>Dodatkowe informacje</span><textarea name="extra" rows={4} /></label><label><span>Opis błędu</span><textarea name="description" rows={7} required /></label><label><span>Załącz plik (opcjonalnie)</span><input name="attachment" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => chooseFile(event.target.files?.[0])} /></label>{attachment && <div className="report-file"><Paperclip size={15} /><span>{attachment.name} · {(attachment.size / 1024 / 1024).toFixed(2)} MB</span><button type="button" onClick={() => setAttachment(null)} aria-label="Usuń załącznik"><X size={15} /></button></div>}<button type="submit" className="report-submit" disabled><Send size={16} /> Wyślij zgłoszenie</button><p className="report-status">Wysyłka zgłoszeń będzie dostępna wkrótce.</p>{error && <p className="report-error">{error}</p>}</form>
  </div></main>;
}

function Field({ label, name, type = "text", required, hint }: { label: string; name: string; type?: string; required?: boolean; hint?: string }) { return <label><span>{label}{required ? " *" : ""}</span>{hint && <small>{hint}</small>}<input name={name} type={type} required={required} /></label>; }
