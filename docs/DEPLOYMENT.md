# Uwagi wdrożeniowe 1.1

Projekt ma `output: "export"`, więc główna aplikacja i strony encji są statyczne. `app/api/newsletter/route.ts` wymaga runtime'u serwerowego i nie jest częścią zwykłego katalogu eksportu statycznego. Jeśli newsletter ma działać produkcyjnie, endpoint trzeba uruchomić jako osobną funkcję/serverless route albo wdrożyć aplikację bez `output: "export"`.

Wymagane zmienne dla newslettera:

- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`

Nie wpisuj ich do repozytorium. Bez nich UI poprawnie otrzyma odpowiedź 503, ale nie zapisze adresu.

Nagłówki bezpieczeństwa, monitoring hostingu i automatyczne backupy muszą być ustawione na warstwie CDN/hostingu; szczegóły są w `docs/SECURITY.md`, `docs/MONITORING.md` i `docs/BACKUP.md`.
