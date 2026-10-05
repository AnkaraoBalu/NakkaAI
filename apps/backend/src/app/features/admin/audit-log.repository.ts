import { Inject, Injectable, Logger } from "@nestjs/common";
import type pg from "pg";
import type { AuditEntry } from "@nakka/types/admin";
import { DATABASE, TABLES } from "../../common/database/constants.js";

// Who changed what on the admin dashboard. Never given key material.
@Injectable()
export class AuditLogRepository {
  private readonly logger = new Logger(AuditLogRepository.name);

  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  // A failed audit write must not undo the change it describes.
  async record(
    adminId: string,
    action: string,
    target: string | null,
    details: Record<string, unknown> = {},
  ): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO ${TABLES.ADMIN_AUDIT_LOG} (admin_id, action, target, details)
         VALUES ($1, $2, $3, $4)`,
        [adminId, action, target, JSON.stringify(details)],
      );
    } catch (error) {
      this.logger.error(`Couldn't record ${action}: ${(error as Error).message}`);
    }
  }

  async recent(limit: number): Promise<AuditEntry[]> {
    const { rows } = await this.db.query<{
      id: string;
      admin_name: string | null;
      action: string;
      target: string | null;
      details: Record<string, unknown>;
      created_at: Date;
    }>(
      `SELECT l.id, a.name AS admin_name, l.action, l.target, l.details, l.created_at
       FROM ${TABLES.ADMIN_AUDIT_LOG} l
       LEFT JOIN ${TABLES.ADMIN_USERS} a ON a.id = l.admin_id
       ORDER BY l.created_at DESC, l.id DESC
       LIMIT $1`,
      [limit],
    );
    return rows.map((row) => ({
      id: String(row.id),
      adminName: row.admin_name,
      action: row.action,
      target: row.target,
      details: row.details,
      createdAt: row.created_at.toISOString(),
    }));
  }
}
