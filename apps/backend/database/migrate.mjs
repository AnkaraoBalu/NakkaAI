// Applies database/migrations/*.sql in name order, each once, each in a transaction.
// Usage: yarn workspace @nakka/backend db:migrate
import { readdir, readFile } from "node:fs/promises";
import pg from "pg";

const dir = new URL("./migrations/", import.meta.url);
const client = new pg.Client({
  enableChannelBinding: process.env.PGCHANNELBINDING === "require",
});

await client.connect();
try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       text        PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`);
  const { rows } = await client.query("SELECT name FROM schema_migrations");
  const applied = new Set(rows.map((row) => row.name));
  const pending = (await readdir(dir))
    .filter((file) => file.endsWith(".sql") && !applied.has(file))
    .sort();

  for (const file of pending) {
    const sql = await readFile(new URL(file, dir), "utf8");
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(`applied ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`${file} failed: ${error.message}`);
    }
  }
  if (!pending.length) console.log("database is up to date");
} finally {
  await client.end();
}
