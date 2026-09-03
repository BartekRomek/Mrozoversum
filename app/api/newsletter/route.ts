import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return NextResponse.json({ error: "Zapisy newslettera nie są jeszcze skonfigurowane." }, { status: 503 });
  const body = await request.json() as { email?: string; enabled?: boolean };
  const email = body.email?.trim() || "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Podaj poprawny adres e-mail." }, { status: 400 });
  const contactUrl = `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`;
  const response = body.enabled
    ? await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ email, unsubscribed: false }) })
    : await fetch(contactUrl, { method: "PATCH", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ unsubscribed: true }) });
  if (!response.ok) return NextResponse.json({ error: "Nie udało się zapisać do newslettera." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
