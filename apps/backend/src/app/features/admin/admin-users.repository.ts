import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import type { AdminUserRow } from "@nakka/types/admin";
import type { SignedInWith } from "@nakka/types/users";
import { DATABASE, TABLES } from "../../common/database/constants.js";
import { activePlanSql } from "../plans/plans.repository.js";

interface Row {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  signed_in_with: SignedInWith;
  plan_id: string;
  plan_name: string | null;
  plan_ends_at: Date | null;
  created_at: Date;
  last_active_at: Date | null;
  total: string;
}

// Users with their current plan, as the admin Users page lists them.
const SELECT = `
  SELECT u.id, u.email, u.first_name, u.last_name, u.username, u.signed_in_with,
         ap.plan_id, p.name AS plan_name, s.current_period_end AS plan_ends_at,
         u.created_at,
         (SELECT max(t.last_used_at) FROM ${TABLES.AUTH_TOKENS} t WHERE t.user_id = u.id)
           AS last_active_at,
         count(*) OVER () AS total
  FROM ${TABLES.USERS} u
  CROSS JOIN LATERAL (SELECT ${activePlanSql("u.id")} AS plan_id) ap
  LEFT JOIN ${TABLES.PLANS} p ON p.id = ap.plan_id
  LEFT JOIN ${TABLES.SUBSCRIPTIONS} s ON s.user_id = u.id AND s.plan_id = ap.plan_id`;

// Searched text is matched literally: % and _ aren't wildcards.
const likePattern = (text: string) => `%${text.replace(/[\\%_]/g, "\\$&")}%`;

const toRow = (row: Row): AdminUserRow => ({
  id: row.id,
  email: row.email,
  name: `${row.first_name} ${row.last_name}`.trim(),
  username: row.username,
  signedInWith: row.signed_in_with,
  planId: row.plan_id,
  planName: row.plan_name ?? row.plan_id,
  planEndsAt: row.plan_ends_at?.toISOString() ?? null,
  createdAt: row.created_at.toISOString(),
  lastActiveAt: row.last_active_at?.toISOString() ?? null,
});

@Injectable()
export class AdminUsersRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  // Newest first; search matches email, username or name.
  async list(
    search: string,
    page: number,
    pageSize: number,
  ): Promise<{ items: AdminUserRow[]; total: number }> {
    const { rows } = await this.db.query<Row>(
      `${SELECT}
       WHERE $1 = ''
          OR u.email ILIKE $2 OR u.username ILIKE $2
          OR (u.first_name || ' ' || u.last_name) ILIKE $2
       ORDER BY u.created_at DESC, u.id
       LIMIT $3 OFFSET $4`,
      [search, likePattern(search), pageSize, (page - 1) * pageSize],
    );
    return { items: rows.map(toRow), total: Number(rows[0]?.total ?? 0) };
  }

  async find(userId: string): Promise<AdminUserRow | null> {
    const { rows } = await this.db.query<Row>(`${SELECT} WHERE u.id = $1`, [userId]);
    return rows[0] ? toRow(rows[0]) : null;
  }

  async counts(): Promise<{ total: number; paid: number; newLast7Days: number }> {
    const { rows } = await this.db.query<{ total: string; paid: string; new_7d: string }>(
      `SELECT count(*) AS total,
              count(*) FILTER (WHERE ${activePlanSql("u.id")} <> 'free') AS paid,
              count(*) FILTER (WHERE u.created_at > now() - interval '7 days') AS new_7d
       FROM ${TABLES.USERS} u`,
    );
    return {
      total: Number(rows[0]?.total ?? 0),
      paid: Number(rows[0]?.paid ?? 0),
      newLast7Days: Number(rows[0]?.new_7d ?? 0),
    };
  }
}
