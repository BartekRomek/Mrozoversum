# Monitoring i błędy produkcyjne

Repo nie zawiera obecnie zewnętrznego error trackera ani dostawcy logów. W 1.1 dodano lekką granicę błędów `app/error.tsx`, która pokazuje bezpieczny ekran odzyskiwania i wysyła do istniejącego GA4 wyłącznie typ błędu. Dodano także prawdziwy ekran 404 z `noindex`.

To nie zastępuje monitoringu serwerowego. Dla statycznego eksportu najprostszy kolejny krok to włączenie monitoringu błędów JavaScript na CDN/hostingu albo Sentry z release name ustawianym na numer wersji. Nie dodano SDK ani sekretów bez wyboru dostawcy i konfiguracji środowiska.

W GA4 dostępne są już zdarzenia: `map_open`, `search`, `book_open`, `related_entity_open`, `filter_change`, `filters_reset` oraz `app_error`. Nie zawierają treści książek, spoilerów ani adresów e-mail.
