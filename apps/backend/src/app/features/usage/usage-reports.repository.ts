import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import type { Provider } from "@nakka/types/plans";
import type { CostedDay, CostedModel, CostedTotals, TopUser } from "@nakka/types/admin";
import { DATABASE, TABLES } from "../../common/database/constants.js";

// Inclusive range of UTC days, "YYYY-MM-DD".
export interface DayRange {
  from: string;
  to: string;
}

// Read-only reports over usage_events, with what the requests cost us. userId
// narrows a report to one user (Usage page, admin user page); null covers
// everyone (admin reports).
const EVENTS = `
  SELECT * FROM ${TABLES.USAGE_EVENTS}
  WHERE created_at >= ($1::date)::timestamp AT TIME ZONE 'UTC'
    AND created_at <  ($2::date + 1)::timestamp AT TIME ZONE 'UTC'
    AND ($3::uuid IS NULL OR user_id = $3)`;

const SUMS = `
  count(e.id)::int AS requests,
  COALESCE(sum(e.input_tokens), 0)::bigint AS input_tokens,
  COALESCE(sum(e.output_tokens), 0)::bigint AS output_tokens,
  COALESCE(sum(e.cache_read_tokens), 0)::bigint AS cache_read_tokens,
  COALESCE(sum(e.cache_write_tokens), 0)::bigint AS cache_write_tokens,
  COALESCE(sum(e.cost_micros), 0)::bigint AS cost_micros`;

interface SumRow {
  requests: number;
  input_tokens: string;
  output_tokens: string;
  cache_read_tokens: string;
  cache_write_tokens: string;
  cost_micros: string;
}

const toTotals = (row: SumRow | undefined): CostedTotals => ({
  requests: row?.requests ?? 0,
  inputTokens: Number(row?.input_tokens ?? 0),
  outputTokens: Number(row?.output_tokens ?? 0),
  cacheReadTokens: Number(row?.cache_read_tokens ?? 0),
  cacheWriteTokens: Number(row?.cache_write_tokens ?? 0),
  costMicros: Number(row?.cost_micros ?? 0),
});

// Users see their tokens, never what they cost us.
export const withoutCost = <T extends CostedTotals>({
  costMicros: _cost,
  ...rest
}: T): Omit<T, "costMicros"> => rest;

@Injectable()
export class UsageReportsRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  async totals(range: DayRange, userId: string | null): Promise<CostedTotals> {
    const { rows } = await this.db.query<SumRow>(
      `SELECT ${SUMS} FROM (${EVENTS}) e`,
      [range.from, range.to, userId],
    );
    return toTotals(rows[0]);
  }

  // One entry per day in the range, including days with no requests.
  async daily(range: DayRange, userId: string | null): Promise<CostedDay[]> {
    const { rows } = await this.db.query<SumRow & { date: string }>(
      `SELECT to_char(d.day, 'YYYY-MM-DD') AS date, ${SUMS}
       FROM generate_series($1::date, $2::date, interval '1 day') AS d(day)
       LEFT JOIN (${EVENTS}) e
         ON (e.created_at AT TIME ZONE 'UTC')::date = d.day::date
       GROUP BY d.day ORDER BY d.day`,
      [range.from, range.to, userId],
    );
    return rows.map((row) => ({ date: row.date, ...toTotals(row) }));
  }

  async byModel(range: DayRange, userId: string | null): Promise<CostedModel[]> {
    const { rows } = await this.db.query<SumRow & { model_id: string; provider: Provider }>(
      `SELECT e.model_id, e.provider, ${SUMS} FROM (${EVENTS}) e
       GROUP BY e.model_id, e.provider ORDER BY requests DESC, e.model_id`,
      [range.from, range.to, userId],
    );
    return rows.map((row) => ({
      modelId: row.model_id,
      provider: row.provider,
      ...toTotals(row),
    }));
  }

  async byProvider(range: DayRange): Promise<({ provider: Provider } & CostedTotals)[]> {
    const { rows } = await this.db.query<SumRow & { provider: Provider }>(
      `SELECT e.provider, ${SUMS} FROM (${EVENTS}) e
       GROUP BY e.provider ORDER BY requests DESC`,
      [range.from, range.to, null],
    );
    return rows.map((row) => ({ provider: row.provider, ...toTotals(row) }));
  }

  async topUsers(range: DayRange, limit: number): Promise<TopUser[]> {
    const { rows } = await this.db.query<SumRow & { user_id: string; email: string }>(
      `SELECT e.user_id, u.email, ${SUMS} FROM (${EVENTS}) e
       JOIN ${TABLES.USERS} u ON u.id = e.user_id
       GROUP BY e.user_id, u.email
       ORDER BY cost_micros DESC, requests DESC
       LIMIT $4`,
      [range.from, range.to, null, limit],
    );
    return rows.map((row) => ({
      userId: row.user_id,
      email: row.email,
      ...toTotals(row),
    }));
  }
}

const DAY = 24 * 60 * 60 * 1000;
const isoDay = (date: Date) => date.toISOString().slice(0, 10);

// The last `days` UTC days, ending today.
export function lastDays(days: number, now = new Date()): DayRange {
  return { from: isoDay(new Date(now.getTime() - (days - 1) * DAY)), to: isoDay(now) };
}
