// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./backend/db/schema/*",
    out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
