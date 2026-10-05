import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import { DATABASE, TABLES } from "../../common/database/constants.js";
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

@Injectable()
export class UsageRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  // One row per answered AI request, and its cost added to every allowance
  // window. A window whose reset time has passed starts again from this request.
  async record(usage: UsageRecord, windows: PlanWindow[]) {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
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
           VALUES ($1, $2, $3, now() + make_interval(hours => $4))
           ON CONFLICT (user_id, window_id) DO UPDATE SET
             used = CASE WHEN w.resets_at <= now() THEN EXCLUDED.used
                         ELSE w.used + EXCLUDED.used END,
             resets_at = CASE WHEN w.resets_at <= now() THEN EXCLUDED.resets_at
                              ELSE w.resets_at END`,
          [usage.userId, window.id, usage.costMicros, window.duration_hours],
        );
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
