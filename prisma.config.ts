import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations take session-level Postgres advisory locks, which are
    // unreliable through PgBouncer (-pooler endpoints). Prefer the direct
    // database URL for any prisma CLI command touching the database.
    url:
      process.env.MIGRATE_DATABASE_URL ??
      process.env.DATABASE_URL ??
      undefined,
  } as never,
});
