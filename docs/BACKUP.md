# Backup danych Mrozoversum

Dane merytoryczne pozostają w repozytorium w katalogu `data/`. Do ręcznego backupu uruchom:

```bash
npm run backup -- ./backups/2026-09-12
```

Skrypt kopiuje `books.json`, `characters.json`, `connections.json` oraz katalog `data/appearances/`. Tworzy również `manifest.json` z datą i sumami SHA-256 trzech głównych plików.

Odtworzenie polega na skopiowaniu zawartości backupu z powrotem do katalogu `data/`, po uprzednim zachowaniu bieżącej wersji. Nie uruchamiaj skryptu z niezaufaną ścieżką docelową.

Automatyczny backup nie został włączony, ponieważ repo nie wskazuje usługi storage ani harmonogramu wdrożeniowego. Zalecane minimum: regularny backup repozytorium do prywatnego zdalnego repo oraz kopia katalogu `backups/` poza serwerem aplikacji.
