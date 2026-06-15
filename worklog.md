---

Task: PostgreSQL compatibility cleanup

Current database:

- Provider: PostgreSQL
- ORM: Prisma
- Hosted database: Vercel Prisma Postgres
- Prisma schema datasource: `anirah_advisory_PRISMA_DATABASE_URL`

Notes:

- The project was previously migrated through MySQL/MariaDB during development.
- MySQL runtime dependencies, scripts, fallback URLs, native types, and migrations have been removed.
- Use `npm run dev` for local Next.js development.
- Use `npx prisma db push` or the PostgreSQL baseline migration for schema synchronization.
