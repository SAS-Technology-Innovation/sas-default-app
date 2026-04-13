import type { Config } from "drizzle-kit"

const url = process.env.DATABASE_URL ?? "file:./dev.db"
const isRemote = !url.startsWith("file:")

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: isRemote ? "turso" : "sqlite",
  dbCredentials: {
    url,
    ...(isRemote && process.env.DATABASE_AUTH_TOKEN
      ? { authToken: process.env.DATABASE_AUTH_TOKEN }
      : {}),
  },
} satisfies Config
