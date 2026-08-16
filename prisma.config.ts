import { defineConfig } from "prisma/config";

try {
    process.loadEnvFile();
} catch {
    // .env not present; fall back to existing process.env
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
