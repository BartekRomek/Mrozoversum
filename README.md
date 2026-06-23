# Mrozoversum

Interaktywna mapa chronologii i powiązań pomiędzy seriami książek Remigiusza Mroza. Aplikacja działa na Next.js 15, TypeScript, Tailwind CSS i React Flow, a dane pobiera z lokalnych plików JSON.

## Funkcje

- Oś czasu oparta na książkach serii Chyłka.
- Osobne grupy dla serii Chyłka, Forst, Langer, Behawiorysta i Zaorski.
- Linie relacji dla typów `cameo`, `wzmianka` i `crossover`.
- Zoom, przesuwanie mapy, minimapa i kontrolki React Flow.
- Wyszukiwanie książek, filtrowanie po seriach oraz filtrowanie po typie relacji.
- Panel boczny z okładką, opisem, serią, powiązaniami i poziomem pewności danych.
- Ciemny, responsywny interfejs inspirowany thrillerami i kryminałami.

## Struktura

```txt
app/
  globals.css
  layout.tsx
  page.tsx
components/
  BookDetailsPanel.tsx
  BookNode.tsx
  FilterBar.tsx
  MrozoversumMap.tsx
data/
  books.json
  connections.json
lib/
  catalog.ts
  types.ts
public/
  covers/
    mrozoversum-cover.svg
```

## Dane

Książki znajdują się w `data/books.json`, a relacje w `data/connections.json`.

Przykład książki:

```json
{
  "id": "kasacja",
  "title": "Kasacja",
  "series": "Chylka",
  "cover": "/covers/mrozoversum-cover.svg",
  "description": "Początek osi Chyłki...",
  "certainty": 100,
  "order": 1,
  "year": 2015
}
```

Przykład relacji:

```json
{
  "source": "trawers",
  "target": "inwigilacja",
  "type": "cameo",
  "certainty": 85,
  "note": "Przykładowe miejsce na krótkie przecięcie osi Forsta i Chyłki."
}
```

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

## Produkcyjny build

```bash
npm run build
npm run start
```
