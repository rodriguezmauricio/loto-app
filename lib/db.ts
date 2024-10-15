import { createPool } from "@vercel/postgres";

const db = createPool({
  connectionString: process.env.POSTGRESS_URL,
});

export { db };
