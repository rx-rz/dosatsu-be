import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DB_URL!
  },
  dialect: 'postgresql',
  schema: './src/db/schema.ts' ,
  verbose: true
})

