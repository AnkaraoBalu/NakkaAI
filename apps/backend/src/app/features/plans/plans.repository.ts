import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import type { Plan, PlanModel, PlanWindow, Provider } from "@nakka/types/plans";
import { DATABASE, TABLES } from "../../common/database/constants.js";

export type { Plan, PlanModel, PlanWindow };

export const DEFAULT_PLAN = "free";

// The plan a user is on: a live subscription (active or past due, not past its
// end date), otherwise Free. The one definition every query uses; `userId` is
// the SQL expression for the user's id.
export const activePlanSql = (userId: string) =>
  `COALESCE(
     (SELECT s.plan_id FROM ${TABLES.SUBSCRIPTIONS} s
      WHERE s.user_id = ${userId}
        AND s.status IN ('active', 'past_due')
        AND (s.current_period_end IS NULL OR s.current_period_end > now())),
     '${DEFAULT_PLAN}')`;

// plan_models columns as stored; numeric prices arrive as strings.
export interface PlanModelRow {
  model_id: string;
  provider: Provider;
  upstream_model: string;
  input_price: string | number;
  output_price: string | number;
  cache_read_price: string | number | null;
  cache_write_price: string | number | null;
}

export const MODEL_COLUMNS =
  "model_id, provider, upstream_model, input_price, output_price, cache_read_price, cache_write_price";

export const toPlanModel = (row: PlanModelRow): PlanModel => ({
  modelId: row.model_id,
  provider: row.provider,
  upstreamModel: row.upstream_model,
  inputPrice: Number(row.input_price),
  outputPrice: Number(row.output_price),
  cacheReadPrice: row.cache_read_price === null ? null : Number(row.cache_read_price),
  cacheWritePrice: row.cache_write_price === null ? null : Number(row.cache_write_price),
});

export interface ActivePlan extends Plan {
  // When a time-limited plan ends; null for Free or no end date.
  endsAt: Date | null;
}

@Injectable()
export class PlansRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  async planFor(userId: string): Promise<ActivePlan> {
    const { rows } = await this.db.query<Plan & { ends_at: Date | null }>(
      `SELECT p.id, p.name, p.windows,
              (SELECT s.current_period_end FROM ${TABLES.SUBSCRIPTIONS} s
               WHERE s.user_id = $1 AND s.plan_id = p.id) AS ends_at
       FROM ${TABLES.PLANS} p
       WHERE p.id = ${activePlanSql("$1")}`,
      [userId],
    );
    const row = rows[0];
    if (!row) return { id: DEFAULT_PLAN, name: "Free", windows: [], endsAt: null };
    return { id: row.id, name: row.name, windows: row.windows, endsAt: row.ends_at };
  }

  async list(): Promise<Plan[]> {
    const { rows } = await this.db.query<Plan>(
      `SELECT id, name, windows FROM ${TABLES.PLANS}
       ORDER BY id = '${DEFAULT_PLAN}' DESC, id`,
    );
    return rows;
  }

  async exists(planId: string): Promise<boolean> {
    const { rowCount } = await this.db.query(
      `SELECT 1 FROM ${TABLES.PLANS} WHERE id = $1`,
      [planId],
    );
    return Boolean(rowCount);
  }

  async update(planId: string, name: string, windows: PlanWindow[]): Promise<void> {
    await this.db.query(
      `UPDATE ${TABLES.PLANS} SET name = $2, windows = $3 WHERE id = $1`,
      [planId, name, JSON.stringify(windows)],
    );
  }

  async models(planId: string): Promise<PlanModel[]> {
    return (await this.modelsByPlan([planId])).get(planId) ?? [];
  }

  async modelsByPlan(planIds: string[]): Promise<Map<string, PlanModel[]>> {
    const { rows } = await this.db.query<PlanModelRow & { plan_id: string }>(
      `SELECT plan_id, ${MODEL_COLUMNS} FROM ${TABLES.PLAN_MODELS}
       WHERE plan_id = ANY($1) ORDER BY sort_order, model_id`,
      [planIds],
    );
    const byPlan = new Map<string, PlanModel[]>(planIds.map((id) => [id, []]));
    for (const row of rows) byPlan.get(row.plan_id)?.push(toPlanModel(row));
    return byPlan;
  }

  // Replaces the plan's model list; the order given becomes the display order.
  async setModels(planId: string, models: PlanModel[]): Promise<void> {
    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
      await client.query(`DELETE FROM ${TABLES.PLAN_MODELS} WHERE plan_id = $1`, [planId]);
      for (const [index, model] of models.entries()) {
        await client.query(
          `INSERT INTO ${TABLES.PLAN_MODELS}
             (plan_id, model_id, provider, upstream_model, sort_order,
              input_price, output_price, cache_read_price, cache_write_price)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            planId,
            model.modelId,
            model.provider,
            model.upstreamModel,
            index,
            model.inputPrice,
            model.outputPrice,
            model.cacheReadPrice,
            model.cacheWritePrice,
          ],
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

  // How many users are on each plan right now (everyone else is on Free).
  async subscriberCounts(): Promise<Map<string, number>> {
    const { rows } = await this.db.query<{ plan_id: string; users: string }>(
      `SELECT ${activePlanSql("u.id")} AS plan_id, count(*) AS users
       FROM ${TABLES.USERS} u GROUP BY 1`,
    );
    return new Map(rows.map((row) => [row.plan_id, Number(row.users)]));
  }

  // Current spend per window, in micro-dollars; rows whose reset time has
  // passed count as empty.
  async usage(
    userId: string,
  ): Promise<Map<string, { used: number; resetsAt: Date }>> {
    const { rows } = await this.db.query<{
      window_id: string;
      used: string;
      resets_at: Date;
    }>(
      `SELECT window_id, used, resets_at FROM ${TABLES.USAGE_WINDOWS}
       WHERE user_id = $1 AND resets_at > now()`,
      [userId],
    );
    return new Map(
      rows.map((row) => [
        row.window_id,
        { used: Number(row.used), resetsAt: row.resets_at },
      ]),
    );
  }
}
