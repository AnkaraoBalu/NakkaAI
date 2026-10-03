import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import { DATABASE, TABLES } from "../../common/database/constants.js";
import type { PlanWindow } from "../extension/plans.repository.js";

export interface ProxyAccess {
  userId: string;
  tokenId: string;
  touch: boolean; // last_used_at is stale enough to refresh
  plan: { id: string; name: string; windows: PlanWindow[] };
  model: { modelId: string; provider: string; upstreamModel: string } | null;
  // Live counts per window (rows whose reset time has passed are left out).
  usage: { windowId: string; used: number; resetsAt: Date }[];
}

const DEFAULT_PLAN = "free";

// Everything an AI request needs to know, in one database round trip:
// whose token, which plan, whether the model is on it, and current usage.
@Injectable()
export class ProxyRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  async access(
    tokenHash: string,
    modelId: string,
  ): Promise<ProxyAccess | null> {
    const { rows } = await this.db.query<{
      user_id: string;
      token_id: string;
      touch: boolean;
      plan_id: string | null;
      plan_name: string | null;
      windows: PlanWindow[] | null;
      model: {
        model_id: string;
        provider: string;
        upstream_model: string;
      } | null;
      usage: { window_id: string; used: number; resets_at: string }[];
    }>(
      `WITH token AS (
         SELECT id, user_id, last_used_at < now() - interval '5 minutes' AS touch
         FROM ${TABLES.AUTH_TOKENS}
         WHERE token_hash = $1 AND revoked_at IS NULL
           AND (expires_at IS NULL OR expires_at > now())
       ),
       plan AS (
         SELECT p.* FROM ${TABLES.PLANS} p, token
         WHERE p.id = COALESCE(
           (SELECT plan_id FROM ${TABLES.SUBSCRIPTIONS} s
            WHERE s.user_id = token.user_id AND s.status IN ('active', 'past_due')),
           $3)
       )
       SELECT token.user_id, token.id AS token_id, token.touch,
              plan.id AS plan_id, plan.name AS plan_name, plan.windows,
              (SELECT row_to_json(m) FROM ${TABLES.PLAN_MODELS} m
               WHERE m.plan_id = plan.id AND m.model_id = $2) AS model,
              (SELECT COALESCE(json_agg(w), '[]'::json) FROM ${TABLES.USAGE_WINDOWS} w
               WHERE w.user_id = token.user_id AND w.resets_at > now()) AS usage
       FROM token LEFT JOIN plan ON true`,
      [tokenHash, modelId, DEFAULT_PLAN],
    );
    const row = rows[0];
    if (!row) return null;
    return {
      userId: row.user_id,
      tokenId: row.token_id,
      touch: row.touch,
      plan: {
        id: row.plan_id ?? DEFAULT_PLAN,
        name: row.plan_name ?? "Free",
        windows: row.windows ?? [],
      },
      model: row.model && {
        modelId: row.model.model_id,
        provider: row.model.provider,
        upstreamModel: row.model.upstream_model,
      },
      usage: row.usage.map((w) => ({
        windowId: w.window_id,
        used: w.used,
        resetsAt: new Date(w.resets_at),
      })),
    };
  }

  // Fire-and-forget: don't make the AI request wait for this write.
  touchToken(tokenId: string) {
    this.db
      .query(
        `UPDATE ${TABLES.AUTH_TOKENS} SET last_used_at = now() WHERE id = $1`,
        [tokenId],
      )
      .catch(() => undefined);
  }
}
