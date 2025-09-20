import 'dotenv/config';
import type { Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    driver: "durable-sqlite",
    dialect: "sqlite",
    dbCredentials: {
        url: process.env.DB_FILE_NAME!,
    }
} satisfies Config;