import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import { DATABASE, TABLES } from "../../common/database/constants.js";
import type { Provider } from "./provider-keys.config.js";

export interface ProviderKeyRow {
  provider: Provider;
  encryptedKey: string;
  last4: string;
  updatedAt: Date;
  updatedBy: string | null; // the admin's name
  lastCheckedAt: Date | null;
  lastCheckOk: boolean | null;
  lastCheckError: string | null;
}

@Injectable()
export class ProviderKeysRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  async list(): Promise<ProviderKeyRow[]> {
    const { rows } = await this.db.query<{
      provider: Provider;
      encrypted_key: string;
      last4: string;
      updated_at: Date;
      updated_by: string | null;
      last_checked_at: Date | null;
      last_check_ok: boolean | null;
      last_check_error: string | null;
    }>(
      `SELECT k.provider, k.encrypted_key, k.last4, k.updated_at, a.name AS updated_by,
              k.last_checked_at, k.last_check_ok, k.last_check_error
       FROM ${TABLES.PROVIDER_KEYS} k
       LEFT JOIN ${TABLES.ADMIN_USERS} a ON a.id = k.updated_by`,
    );
    return rows.map((row) => ({
      provider: row.provider,
      encryptedKey: row.encrypted_key,
      last4: row.last4,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      lastCheckedAt: row.last_checked_at,
      lastCheckOk: row.last_check_ok,
      lastCheckError: row.last_check_error,
    }));
  }

  async encryptedKey(provider: Provider): Promise<string | null> {
    const { rows } = await this.db.query<{ encrypted_key: string }>(
      `SELECT encrypted_key FROM ${TABLES.PROVIDER_KEYS} WHERE provider = $1`,
      [provider],
    );
    return rows[0]?.encrypted_key ?? null;
  }

  // A new key starts with no test result.
  async save(
    provider: Provider,
    encryptedKey: string,
    last4: string,
    adminId: string,
  ): Promise<void> {
    await this.db.query(
      `INSERT INTO ${TABLES.PROVIDER_KEYS} (provider, encrypted_key, last4, updated_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (provider) DO UPDATE SET
         encrypted_key = EXCLUDED.encrypted_key,
         last4 = EXCLUDED.last4,
         updated_by = EXCLUDED.updated_by,
         updated_at = now(),
         last_checked_at = NULL,
         last_check_ok = NULL,
         last_check_error = NULL`,
      [provider, encryptedKey, last4, adminId],
    );
  }

  async remove(provider: Provider): Promise<boolean> {
    const { rowCount } = await this.db.query(
      `DELETE FROM ${TABLES.PROVIDER_KEYS} WHERE provider = $1`,
      [provider],
    );
    return Boolean(rowCount);
  }

  async saveCheck(provider: Provider, ok: boolean, error: string | null) {
    await this.db.query(
      `UPDATE ${TABLES.PROVIDER_KEYS}
       SET last_checked_at = now(), last_check_ok = $2, last_check_error = $3
       WHERE provider = $1`,
      [provider, ok, error],
    );
  }
}
