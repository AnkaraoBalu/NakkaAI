import type pg from "pg";

// Runs `work` in one transaction on one pooled connection. If the rollback
// itself fails, the connection is broken and is discarded, not reused.
export async function inTransaction<T>(
  db: pg.Pool,
  work: (client: pg.PoolClient) => Promise<T>,
): Promise<T> {
  const client = await db.connect();
  let broken = false;
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {
      broken = true;
    });
    throw error;
  } finally {
    client.release(broken);
  }
}
