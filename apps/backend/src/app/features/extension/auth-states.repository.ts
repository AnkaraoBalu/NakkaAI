import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import { DATABASE, TABLES } from "../../common/database/constants.js";

export interface AuthState {
  state: string;
  redirectUri: string;
  createdAt: Date;
  usedAt: Date | null;
}

@Injectable()
export class AuthStatesRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  // Saves the attempt (a refresh of the /auth page sends the same state again).
  async save(state: string, redirectUri: string): Promise<AuthState> {
    await this.db.query(
      `INSERT INTO ${TABLES.AUTH_STATES} (state, redirect_uri) VALUES ($1, $2)
       ON CONFLICT (state) DO NOTHING`,
      [state, redirectUri],
    );
    const { rows } = await this.db.query<{
      state: string;
      redirect_uri: string;
      created_at: Date;
      used_at: Date | null;
    }>(`SELECT * FROM ${TABLES.AUTH_STATES} WHERE state = $1`, [state]);
    const row = rows[0];
    return {
      state: row.state,
      redirectUri: row.redirect_uri,
      createdAt: row.created_at,
      usedAt: row.used_at,
    };
  }

  // Marks the state used, once. Returns its redirect, or null if it's unknown,
  // already used or older than maxAgeMs.
  async consume(state: string, maxAgeMs: number): Promise<string | null> {
    const { rows } = await this.db.query<{ redirect_uri: string }>(
      `UPDATE ${TABLES.AUTH_STATES} SET used_at = now()
       WHERE state = $1
         AND used_at IS NULL
         AND created_at > now() - ($2 * interval '1 millisecond')
       RETURNING redirect_uri`,
      [state, maxAgeMs],
    );
    return rows[0]?.redirect_uri ?? null;
  }

  // Housekeeping: attempts older than a day are never useful.
  async deleteStale() {
    await this.db.query(
      `DELETE FROM ${TABLES.AUTH_STATES} WHERE created_at < now() - interval '1 day'`,
    );
  }
}
