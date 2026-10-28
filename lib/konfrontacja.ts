export const KONFRONTACJA_RELEASE_AT = "2026-11-12T00:00:00+01:00";

export function getKonfrontacjaCountdown() {
  return Math.max(0, Date.parse(KONFRONTACJA_RELEASE_AT) - Date.now());
}

export function formatKonfrontacjaCountdown(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}
