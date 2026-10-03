import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import { DATABASE, TABLES } from "../../common/database/constants.js";

export interface PlanWindow {
  id: string;
  label: string;
  limit: number;
  duration_hours: number;
}

export interface Plan {
  id: string;
  name: string;
  windows: PlanWindow[];
}

export interface PlanModel {
  modelId: string;
  provider: string;
  upstreamModel: string;
}

const DEFAULT_PLAN = "free";

@Injectable()
export class PlansRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  // The user's plan: an active (or past-due) subscription, otherwise "free".
  async planFor(userId: string): Promise<Plan> {
    const { rows } = await this.db.query<Plan>(
      `SELECT p.id, p.name, p.windows FROM ${TABLES.PLANS} p
       WHERE p.id = COALESCE(
         (SELECT plan_id FROM ${TABLES.SUBSCRIPTIONS}
          WHERE user_id = $1 AND status IN ('active', 'past_due')),
         $2)`,
      [userId, DEFAULT_PLAN],
    );
    return rows[0] ?? { id: DEFAULT_PLAN, name: "Free", windows: [] };
  }

  async models(planId: string): Promise<PlanModel[]> {
    const { rows } = await this.db.query<{
      model_id: string;
      provider: string;
      upstream_model: string;
    }>(
      `SELECT model_id, provider, upstream_model FROM ${TABLES.PLAN_MODELS}
       WHERE plan_id = $1 ORDER BY sort_order, model_id`,
      [planId],
    );
    return rows.map((row) => ({
      modelId: row.model_id,
      provider: row.provider,
      upstreamModel: row.upstream_model,
    }));
  }

  // Current counts per window; rows whose reset time has passed count as empty.
  async usage(
    userId: string,
  ): Promise<Map<string, { used: number; resetsAt: Date }>> {
    const { rows } = await this.db.query<{
      window_id: string;
      used: number;
      resets_at: Date;
    }>(
      `SELECT window_id, used, resets_at FROM ${TABLES.USAGE_WINDOWS}
       WHERE user_id = $1 AND resets_at > now()`,
      [userId],
    );
    return new Map(
      rows.map((row) => [
        row.window_id,
        { used: row.used, resetsAt: row.resets_at },
      ]),
    );
  }
}
