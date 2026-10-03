import { createHash, randomBytes } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import { DATABASE, TABLES } from "../../common/database/constants.js";
import { authConfig, type AuthConfig } from "./auth.config.js";

// 'web' for the website, 'extension' for the VS Code extension.
export type TokenClient = "web" | "extension";

export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

// last_used_at is refreshed at most this often, so reads don't all become writes.
const TOUCH_INTERVAL_MS = 5 * 60 * 1000;

// Opaque bearer tokens kept in auth_tokens. Only a SHA-256 hash is stored.
@Injectable()
export class SessionService {
  constructor(
    @Inject(DATABASE) private readonly db: pg.Pool,
    @Inject(authConfig.KEY) private readonly config: AuthConfig,
  ) {}

  async create(userId: string, client: TokenClient = "web") {
    const token = randomBytes(32).toString("base64url");
    const ttl =
      client === "extension"
        ? this.config.extensionTokenTtlMs
        : this.config.sessionTtlMs;
    const expiresAt = new Date(Date.now() + ttl);
    await this.db.query(
      `INSERT INTO ${TABLES.AUTH_TOKENS} (user_id, token_hash, client, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [userId, hashToken(token), client, expiresAt],
    );
    return { token, expiresAt };
  }

  // The user the token belongs to, or null if it's unknown, revoked or expired.
  async resolve(token: string): Promise<string | null> {
    const { rows } = await this.db.query<{
      id: string;
      user_id: string;
      last_used_at: Date;
    }>(
      `SELECT id, user_id, last_used_at FROM ${TABLES.AUTH_TOKENS}
       WHERE token_hash = $1
         AND revoked_at IS NULL
         AND (expires_at IS NULL OR expires_at > now())`,
      [hashToken(token)],
    );
    const row = rows[0];
    if (!row) return null;
    if (Date.now() - row.last_used_at.getTime() > TOUCH_INTERVAL_MS) {
      await this.db.query(
        `UPDATE ${TABLES.AUTH_TOKENS} SET last_used_at = now() WHERE id = $1`,
        [row.id],
      );
    }
    return row.user_id;
  }

  async hasActiveSession(userId: string): Promise<boolean> {
    const { rowCount } = await this.db.query(
      `SELECT 1 FROM ${TABLES.AUTH_TOKENS}
       WHERE user_id = $1
         AND revoked_at IS NULL
         AND (expires_at IS NULL OR expires_at > now())
       LIMIT 1`,
      [userId],
    );
    return Boolean(rowCount);
  }

  async revoke(token: string): Promise<void> {
    await this.db.query(
      `UPDATE ${TABLES.AUTH_TOKENS} SET revoked_at = now()
       WHERE token_hash = $1 AND revoked_at IS NULL`,
      [hashToken(token)],
    );
  }
}
