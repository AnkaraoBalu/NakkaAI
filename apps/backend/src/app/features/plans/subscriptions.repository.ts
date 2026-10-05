import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import { DATABASE, TABLES } from "../../common/database/constants.js";

// Plans are assigned by an admin for now; a payment gateway would write here too.
@Injectable()
export class SubscriptionsRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  async assign(
    userId: string,
    planId: string,
    endsAt: Date | null,
    adminId: string,
  ): Promise<void> {
    await this.db.query(
      `INSERT INTO ${TABLES.SUBSCRIPTIONS}
         (user_id, plan_id, status, current_period_end, assigned_by)
       VALUES ($1, $2, 'active', $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET
         plan_id = EXCLUDED.plan_id,
         status = 'active',
         current_period_end = EXCLUDED.current_period_end,
         assigned_by = EXCLUDED.assigned_by,
         updated_at = now()`,
      [userId, planId, endsAt, adminId],
    );
  }

  // Back to Free. The row stays as a record of the last paid plan.
  async cancel(userId: string, adminId: string): Promise<void> {
    await this.db.query(
      `UPDATE ${TABLES.SUBSCRIPTIONS}
       SET status = 'canceled', assigned_by = $2, updated_at = now()
       WHERE user_id = $1`,
      [userId, adminId],
    );
  }
}
