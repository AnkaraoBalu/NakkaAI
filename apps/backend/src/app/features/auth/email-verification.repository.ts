import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import { DATABASE, TABLES } from "../../common/database/constants.js";

export interface EmailVerification {
  email: string;
  codeHash: string;
  attempts: number;
  expiresAt: Date;
  lastSentAt: Date;
  verifiedAt: Date | null;
  verificationTokenHash: string | null;
  tokenExpiresAt: Date | null;
}

interface Row {
  email: string;
  code_hash: string;
  attempts: number;
  expires_at: Date;
  last_sent_at: Date;
  verified_at: Date | null;
  verification_token_hash: string | null;
  token_expires_at: Date | null;
}

const toVerification = (row: Row): EmailVerification => ({
  email: row.email,
  codeHash: row.code_hash,
  attempts: row.attempts,
  expiresAt: row.expires_at,
  lastSentAt: row.last_sent_at,
  verifiedAt: row.verified_at,
  verificationTokenHash: row.verification_token_hash,
  tokenExpiresAt: row.token_expires_at,
});

@Injectable()
export class EmailVerificationRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  async find(email: string): Promise<EmailVerification | null> {
    const { rows } = await this.db.query<Row>(
      `SELECT * FROM ${TABLES.EMAIL_VERIFICATIONS} WHERE email = $1`,
      [email],
    );
    return rows[0] ? toVerification(rows[0]) : null;
  }

  // Starts (or restarts) verification with a fresh code.
  async upsertCode(email: string, codeHash: string, expiresAt: Date) {
    await this.db.query(
      `INSERT INTO ${TABLES.EMAIL_VERIFICATIONS} (email, code_hash, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET
         code_hash = EXCLUDED.code_hash,
         expires_at = EXCLUDED.expires_at,
         attempts = 0,
         last_sent_at = now(),
         verified_at = NULL,
         verification_token_hash = NULL,
         token_expires_at = NULL`,
      [email, codeHash, expiresAt],
    );
  }

  async recordFailedAttempt(email: string) {
    await this.db.query(
      `UPDATE ${TABLES.EMAIL_VERIFICATIONS} SET attempts = attempts + 1 WHERE email = $1`,
      [email],
    );
  }

  async markVerified(email: string, tokenHash: string, tokenExpiresAt: Date) {
    await this.db.query(
      `UPDATE ${TABLES.EMAIL_VERIFICATIONS}
       SET verified_at = now(), verification_token_hash = $2, token_expires_at = $3
       WHERE email = $1`,
      [email, tokenHash, tokenExpiresAt],
    );
  }

  async delete(email: string) {
    await this.db.query(
      `DELETE FROM ${TABLES.EMAIL_VERIFICATIONS} WHERE email = $1`,
      [email],
    );
  }
}
