# ETAP 1: Instalacja zależności
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# ETAP 2: Budowanie aplikacji
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ustawiamy zmienną środowiskową wyłączającą telemetrię Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ETAP 3: Uruchomienie aplikacji (ostateczny lekki obraz)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Dodajemy użytkownika non-root ze względów bezpieczeństwa
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Kopiujemy tylko niezbędne pliki z etapu budowania
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]