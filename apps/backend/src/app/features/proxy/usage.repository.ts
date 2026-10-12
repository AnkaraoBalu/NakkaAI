import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import { DATABASE, TABLES } from "../../common/database/constants.js";
import { inTransaction } from "../../common/database/transaction.js";
import type { PlanWindow } from "../plans/plans.repository.js";

export interface UsageRecord {
  userId: string;
  modelId: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  // What the request cost us, in micro-dollars.
  costMicros: number;
}

// A row starts over when its window has reset, or when it is left over from an
// earlier setup of the window: the wrong kind (one-time credit vs resetting) or
// resetting later than the window's current length allows. $4 is the window's
// duration_hours (null for a one-time credit). Matches spentIn in plans.service.
const STALE = `(w.resets_at <= now()
  OR ($4::int IS NULL) <> (w.resets_at = 'infinity')
  OR ($4::int IS NOT NULL AND w.resets_at > now() + make_interval(hours => $4::int)))`;

@Injectable()
export class UsageRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  // One row per answered AI request, and its cost added to every allowance
  // window it counts against (see windowsFor in plans.service). A window whose reset time has
  // passed starts again from this request; a one-time credit never resets.
  async record(usage: UsageRecord, windows: PlanWindow[]) {
    return inTransaction(this.db, async (client) => {
      await client.query(
        `INSERT INTO ${TABLES.USAGE_EVENTS}
           (user_id, model_id, provider, input_tokens, output_tokens,
            cache_read_tokens, cache_write_tokens, cost_micros)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          usage.userId,
          usage.modelId,
          usage.provider,
          usage.inputTokens,
          usage.outputTokens,
          usage.cacheReadTokens,
          usage.cacheWriteTokens,
          usage.costMicros,
        ],
      );
      for (const window of windows) {
        await client.query(
          `INSERT INTO ${TABLES.USAGE_WINDOWS} AS w (user_id, window_id, used, resets_at)
           VALUES ($1, $2, $3, CASE WHEN $4::int IS NULL THEN 'infinity'::timestamptz
                                    ELSE now() + make_interval(hours => $4::int) END)
           ON CONFLICT (user_id, window_id) DO UPDATE SET
             used = CASE WHEN ${STALE} THEN EXCLUDED.used
                         ELSE w.used + EXCLUDED.used END,
             resets_at = CASE WHEN ${STALE} THEN EXCLUDED.resets_at
                              ELSE w.resets_at END`,
          [usage.userId, window.id, usage.costMicros, window.duration_hours],
        );
      }
    });
  }
}
