# ReligiousLiberty.TV Reader

Production-ready starter built with Next.js App Router + TypeScript + Tailwind + Prisma SQLite.

## Features
- Discover latest posts scraped from ReligiousLiberty.TV list pages with caching, rate limits, robots.txt checks, and graceful degradation on 403/429.
- Topic browsing from archive/search page with category-page fallback.
- Share links with UTM tracking + internal short redirects (`/r/:shortid`) + click analytics.
- Double-opt in email capture flow via SMTP (MailHog in local compose).
- Scheduler for daily/instant reminder jobs via node-cron.
- Optional web push endpoint behind `ENABLE_WEB_PUSH` flag.
- Admin analytics dashboard + CSV export protected by env password.
- Dynamic OG image endpoint (`/og?title=...&date=...`).

## Local setup
1. Copy env:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize db:
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```
4. Run app:
   ```bash
   npm run dev
   ```

## One-command local run
```bash
docker-compose up --build
```

## Running scraper
```bash
npm run scrape
```
The app auto-runs scraper and serves cached data if upstream blocks fetches.

## Tests
```bash
npm run test:unit
npm run test:e2e
```

## Deploy notes
- Run a persistent process for scheduler (or external cron hitting `/api/scrape`).
- Configure SMTP for real email delivery.
- Set `ADMIN_PASSWORD` and web push VAPID keys if enabling push.
- SQLite is local; for scale migrate Prisma datasource to Postgres.
