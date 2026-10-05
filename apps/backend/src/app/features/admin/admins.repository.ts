import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import type { AdminAccount, AdminProfile } from "@nakka/types/admin";
import { DATABASE, TABLES } from "../../common/database/constants.js";

export interface AdminWithPassword extends AdminProfile {
  passwordHash: string;
}

export interface NewAdmin {
  name: string;
  email: string;
  passwordHash: string;
}

const UNIQUE_VIOLATION = "23505";
// Serialises "create the first admin" so two people can't both become it.
const FIRST_ADMIN_LOCK = 4_242_001;

interface AccountRow {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  last_login_at: Date | null;
}

const toAccount = (row: AccountRow): AdminAccount => ({
  id: row.id,
  name: row.name,
  email: row.email,
  createdAt: row.created_at.toISOString(),
  lastLoginAt: row.last_login_at?.toISOString() ?? null,
});

// Admin accounts and their sessions. Kept apart from users and auth_tokens.
@Injectable()
export class AdminsRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  async findByEmail(email: string): Promise<AdminWithPassword | null> {
    const { rows } = await this.db.query<{
      id: string;
      name: string;
      email: string;
      password_hash: string;
    }>(
      `SELECT id, name, email, password_hash FROM ${TABLES.ADMIN_USERS}
       WHERE lower(email) = lower($1)`,
      [email],
    );
    const row = rows[0];
    return row
      ? { id: row.id, name: row.name, email: row.email, passwordHash: row.password_hash }
      : null;
  }

  async exists(): Promise<boolean> {
    const { rowCount } = await this.db.query(
      `SELECT 1 FROM ${TABLES.ADMIN_USERS} LIMIT 1`,
    );
    return Boolean(rowCount);
  }

  // Creates the first admin, or returns null if one already exists.
  async createFirst(admin: NewAdmin): Promise<AdminProfile | null> {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT pg_advisory_xact_lock($1)", [FIRST_ADMIN_LOCK]);
      const { rows } = await client.query<AdminProfile>(
        `INSERT INTO ${TABLES.ADMIN_USERS} (name, email, password_hash)
         SELECT $1, $2, $3
         WHERE NOT EXISTS (SELECT 1 FROM ${TABLES.ADMIN_USERS})
         RETURNING id, name, email`,
        [admin.name, admin.email, admin.passwordHash],
      );
      await client.query("COMMIT");
      return rows[0] ?? null;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Returns null if an admin already has this email (any case).
  async create(admin: NewAdmin): Promise<AdminAccount | null> {
    try {
      const { rows } = await this.db.query<AccountRow>(
        `INSERT INTO ${TABLES.ADMIN_USERS} (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, created_at, last_login_at`,
        [admin.name, admin.email, admin.passwordHash],
      );
      return toAccount(rows[0]!);
    } catch (error) {
      if ((error as { code?: string }).code === UNIQUE_VIOLATION) return null;
      throw error;
    }
  }

  async list(): Promise<AdminAccount[]> {
    const { rows } = await this.db.query<AccountRow>(
      `SELECT id, name, email, created_at, last_login_at
       FROM ${TABLES.ADMIN_USERS} ORDER BY created_at, email`,
    );
    return rows.map(toAccount);
  }

  async passwordHash(id: string): Promise<string | null> {
    const { rows } = await this.db.query<{ password_hash: string }>(
      `SELECT password_hash FROM ${TABLES.ADMIN_USERS} WHERE id = $1`,
      [id],
    );
    return rows[0]?.password_hash ?? null;
  }

  // New password; every other session of this admin is signed out.
  async setPassword(id: string, passwordHash: string, keepTokenHash: string) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `UPDATE ${TABLES.ADMIN_USERS} SET password_hash = $2 WHERE id = $1`,
        [id, passwordHash],
      );
      await client.query(
        `UPDATE ${TABLES.ADMIN_TOKENS} SET revoked_at = now()
         WHERE admin_id = $1 AND token_hash <> $2 AND revoked_at IS NULL`,
        [id, keepTokenHash],
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<AdminProfile | null> {
    const { rows } = await this.db.query<AdminProfile>(
      `SELECT id, name, email FROM ${TABLES.ADMIN_USERS} WHERE id = $1`,
      [id],
    );
    return rows[0] ?? null;
  }

  async markLoggedIn(id: string): Promise<void> {
    await this.db.query(
      `UPDATE ${TABLES.ADMIN_USERS} SET last_login_at = now() WHERE id = $1`,
      [id],
    );
  }

  async createToken(adminId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.db.query(
      `INSERT INTO ${TABLES.ADMIN_TOKENS} (admin_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [adminId, tokenHash, expiresAt],
    );
  }

  // The admin the token belongs to, or null if it's unknown, revoked or expired.
  async resolveToken(tokenHash: string): Promise<string | null> {
    const { rows } = await this.db.query<{ admin_id: string }>(
      `UPDATE ${TABLES.ADMIN_TOKENS} SET last_used_at = now()
       WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()
       RETURNING admin_id`,
      [tokenHash],
    );
    return rows[0]?.admin_id ?? null;
  }

  async revokeToken(tokenHash: string): Promise<void> {
    await this.db.query(
      `UPDATE ${TABLES.ADMIN_TOKENS} SET revoked_at = now()
       WHERE token_hash = $1 AND revoked_at IS NULL`,
      [tokenHash],
    );
  }
}
