# Booking MVP (Auto stundenweise, Segelboot tageweise)

Next.js (App Router) + Prisma + Postgres + Auth.js + Stripe (Checkout) minimaler Starter.

## Schnellstart

```bash
# 1) Repo klonen & deps
pnpm i   # oder npm i / yarn

# 2) .env anlegen
cp .env.example .env
# trage deine Postgres / Auth / Stripe Werte ein

# 3) Prisma & DB
npx prisma generate
npx prisma migrate dev --name init
# (fügt auch den no_overlap-Constraint per SQL hinzu)

# 4) Seed (Demo-Ressourcen Auto & Boot)
npm run db:seed

# 5) Dev-Server
npm run dev
```

App läuft dann auf http://localhost:3000

## Auth
- Auth.js E‑Mail (Magic Link) vorbereitet. Für Prod kannst du OAuth (Google, GitHub) ergänzen.
- Adapter: Prisma.

## Stripe
- Checkout-Beispiel: `POST /api/checkout`. In `STRIPE_PRICE_*` die Product-Preise hinterlegen.
- Webhook: `POST /api/stripe/webhook` bestätigt Buchung.

## Verfügbarkeits-Engine
- Quelle: `bookings` + `blackouts` (und `buffer_before/after` aus `rules`).
- Postgres-Constraint verhindert Überschneidungen atomar:
```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE "Booking"
  ADD CONSTRAINT "no_overlap"
  EXCLUDE USING gist (
    "resourceId" WITH =,
    tstzrange("startTs","endTs",'[]') WITH &&
  )
  WHERE ("status" = 'confirmed');
```

## Deployment
- Vercel (Next.js) + Supabase (Postgres).
- Setze ENV Variablen im Vercel-Projekt. `DATABASE_URL` muss auf die Supabase-DB zeigen.
- `npx prisma migrate deploy` beim Build.

## Struktur
- `src/app` App Router (Home, Login, Dashboard)
- `src/app/api` Endpunkte (availability, book, checkout, stripe webhook)
- `prisma/schema.prisma` Datenmodell
- `prisma/migrations` enthält SQL für Exclusion-Constraint
```

