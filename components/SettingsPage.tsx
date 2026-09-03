"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, Bell, Map, Moon, RotateCcw, Sun } from "lucide-react";

const THEME_KEY = "mrozoversum-theme";
const DEFAULTS = { light: false, newsletter: false, newsletterEmail: "", rememberPosition: false, autoZoom: false };
type Settings = typeof DEFAULTS;

const settingRows = [
  { key: "rememberPosition" as const, title: "Zapamiętaj ostatnią pozycję mapy", description: "Przygotowanie do zapamiętywania ostatniego widoku mapy." },
  { key: "autoZoom" as const, title: "Automatyczne przybliżenie po otwarciu", description: "Przygotowanie do automatycznego dopasowania widoku mapy." }
];

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  const values = { ...DEFAULTS };
  try {
    const stored = JSON.parse(window.localStorage.getItem("mrozoversum-settings") || "{}");
    ["light", "newsletter", "rememberPosition", "autoZoom"].forEach((key) => { if (typeof stored[key] === "boolean") (values as Record<string, boolean | string>)[key] = stored[key]; });
    if (typeof stored.newsletterEmail === "string") values.newsletterEmail = stored.newsletterEmail;
    values.light = window.localStorage.getItem(THEME_KEY) === "light";
  } catch { /* localStorage may be unavailable */ }
  return values;
}

function saveSettings(settings: Settings) {
  window.localStorage.setItem("mrozoversum-settings", JSON.stringify(settings));
  window.localStorage.setItem(THEME_KEY, settings.light ? "light" : "dark");
  document.documentElement.dataset.mrozoversumTheme = settings.light ? "light" : "dark";
}

export function SettingsPage({ onBack }: { onBack?: () => void }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [resetMessage, setResetMessage] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => { saveSettings(settings); }, [settings]);

  const update = (key: "light" | "newsletter" | "rememberPosition" | "autoZoom") => setSettings((current) => ({ ...current, [key]: !current[key] }));
  const saveNewsletter = async () => {
    if (settings.newsletter && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.newsletterEmail)) {
      setNewsletterMessage("Włączony newsletter wymaga poprawnego adresu e-mail.");
      return;
    }
    setNewsletterMessage("Zapisywanie…");
    try {
      const response = await fetch("/admin/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: settings.newsletterEmail, enabled: settings.newsletter }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Nie udało się zapisać ustawień.");
      saveSettings(settings);
      setNewsletterMessage("Ustawienia newslettera zostały zapisane.");
    } catch (saveError) { setNewsletterMessage(saveError instanceof Error ? saveError.message : "Nie udało się zapisać ustawień."); }
  };
  const reset = () => {
    if (!window.confirm("Czy na pewno zresetować ustawienia?")) return;
    window.localStorage.removeItem("mrozoversum-settings");
    window.localStorage.removeItem(THEME_KEY);
    window.localStorage.removeItem("mrozoversum-hide-guide");
    document.documentElement.dataset.mrozoversumTheme = "dark";
    setSettings(DEFAULTS);
    setResetMessage("Ustawienia zostały zresetowane.");
  };

  const back = onBack ? <button type="button" onClick={onBack} className="support-back"><ArrowLeft size={18} /> Wróć do mapy</button> : <a href="/" className="support-back"><ArrowLeft size={18} /> Wróć do mapy</a>;
  return <main className="settings-page min-h-screen overflow-x-hidden bg-[#08090d] px-5 py-8 text-[#f4f1ea] sm:px-8 sm:py-12">
    <div className="mx-auto max-w-3xl">{back}<header className="mt-12"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-rose-300/70">Preferencje</p><h1 className="mt-3 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">Ustawienia</h1></header>
      <section className="settings-section mt-10"><div className="settings-section__title"><Sun size={18} /><h2>Wygląd</h2></div><SettingToggle title="Tryb jasny" description="Jasna wersja interfejsu zachowująca charakter Mrozoversum." checked={settings.light} onChange={() => update("light")} icon={settings.light ? <Sun size={18} /> : <Moon size={18} />} /></section>
      <section className="settings-section"><div className="settings-section__title"><Bell size={18} /><h2>Newsletter</h2></div><SettingToggle title="Chcę otrzymywać newsletter" description="Otrzymuj informacje o nowych postaciach, relacjach, książkach i aktualizacjach Mrozoversum." checked={settings.newsletter} onChange={() => update("newsletter")} />{settings.newsletter && <div className="settings-newsletter"><label><span>Adres e-mail</span><input type="email" value={settings.newsletterEmail} onChange={(event) => setSettings((current) => ({ ...current, newsletterEmail: event.target.value }))} placeholder="twoj@email.pl" /></label><button type="button" onClick={saveNewsletter} className="settings-reset">Zapisz ustawienia</button></div>}{newsletterMessage && <p className="mt-3 text-sm text-rose-300">{newsletterMessage}</p>}</section>
      <section className="settings-section"><div className="settings-section__title"><Map size={18} /><h2>Mapa</h2></div>{settingRows.map(({ key, ...row }) => <SettingToggle key={key} {...row} checked={settings[key]} onChange={() => update(key)} />)}</section>
      <section className="settings-section"><div className="settings-section__title"><RotateCcw size={18} /><h2>Dane i preferencje</h2></div><button type="button" onClick={reset} className="settings-reset"><RotateCcw size={16} /> Zresetuj ustawienia</button>{resetMessage && <p className="mt-3 text-sm text-rose-300">{resetMessage}</p>}</section>
    </div>
  </main>;
}

function SettingToggle({ title, description, checked, onChange, icon }: { title: string; description: string; checked: boolean; onChange: () => void; icon?: ReactNode }) {
  return <label className="settings-toggle"><span className="min-w-0 flex-1"><strong>{title}</strong><small>{description}</small></span>{icon}<input type="checkbox" checked={checked} onChange={onChange} /><span className="settings-switch" aria-hidden="true"><span /></span></label>;
}
