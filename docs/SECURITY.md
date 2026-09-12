# Nagłówki bezpieczeństwa

Mrozoversum używa `output: "export"`, więc Next.js generuje statyczne pliki i nie może samodzielnie ustawić nagłówków HTTP na docelowym hostingu. Nie dodaję pozornej konfiguracji, która mogłaby nie działać po eksporcie.

Na CDN/hostingu ustaw:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy: frame-ancestors 'none'; object-src 'none'; base-uri 'self'`

CSP trzeba rozszerzyć o `https://www.googletagmanager.com` i `https://www.google-analytics.com` oraz ewentualne źródła fontów, jeśli hosting wdraża restrykcyjną politykę skryptów. Przed włączeniem pełnej CSP należy sprawdzić raporty naruszeń, ponieważ aplikacja korzysta z Google Analytics i inline JSON-LD.
