import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import type { Identity, IdentityProvider } from "@nakka/types/users";
import { DATABASE, TABLES } from "../../common/database/constants.js";

// A Google/GitHub account as reported by Clerk.
export interface ProviderAccount {
  provider: IdentityProvider;
  providerUserId: string;
  email: string | null;
}

interface IdentityRow {
  id: string;
  user_id: string;
  provider: IdentityProvider;
  provider_user_id: string;
  email: string | null;
  created_at: Date;
}

@Injectable()
export class IdentitiesRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  // Which user (if any) already owns each of these provider accounts.
  async owners(accounts: ProviderAccount[]): Promise<Map<string, string>> {
    if (!accounts.length) return new Map();
    const { rows } = await this.db.query<IdentityRow>(
      `SELECT * FROM ${TABLES.USER_IDENTITIES}
       WHERE (provider, provider_user_id) IN (
         SELECT * FROM unnest($1::text[], $2::text[])
       )`,
      [accounts.map((a) => a.provider), accounts.map((a) => a.providerUserId)],
    );
    return new Map(
      rows.map((row) => [
        `${row.provider}:${row.provider_user_id}`,
        row.user_id,
      ]),
    );
  }

  // Connects accounts to a user; ones already connected are left as they are.
  async connect(
    userId: string,
    clerkUserId: string,
    accounts: ProviderAccount[],
  ) {
    for (const account of accounts) {
      await this.db.query(
        `INSERT INTO ${TABLES.USER_IDENTITIES}
           (user_id, provider, provider_user_id, clerk_user_id, email)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (provider, provider_user_id) DO NOTHING`,
        [
          userId,
          account.provider,
          account.providerUserId,
          clerkUserId,
          account.email,
        ],
      );
    }
  }

  async listForUser(userId: string): Promise<Identity[]> {
    const { rows } = await this.db.query<IdentityRow>(
      `SELECT * FROM ${TABLES.USER_IDENTITIES} WHERE user_id = $1 ORDER BY created_at`,
      [userId],
    );
    return rows.map((row) => ({
      id: row.id,
      provider: row.provider,
      email: row.email,
      createdAt: row.created_at.toISOString(),
    }));
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const { rowCount } = await this.db.query(
      `DELETE FROM ${TABLES.USER_IDENTITIES} WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
    return Boolean(rowCount);
  }
}

export const accountKey = (account: ProviderAccount) =>
  `${account.provider}:${account.providerUserId}`;
