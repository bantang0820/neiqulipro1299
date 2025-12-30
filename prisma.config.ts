import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
    // directUrl is not yet typed in some versions but needed for Supabase migration via config if using pooled connection
    // However, Prisma 7 config might handle this differently. 
    // If directUrl property isn't supported here, we might need to rely on DATABASE_URL being the direct one for migration.
  },
});
