import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import { DATABASE, TABLES } from "../../common/database/constants.js";
import { inTransaction } from "../../common/database/transaction.js";

export type BillingCycle = "monthly" | "yearly";

export interface BillingPayment {
  id: string;
  cycle: BillingCycle;
  amountPaise: number;
  currency: string;
  orderId: string | null;
  paymentId: string | null;
  method: string | null;
  status: "pending" | "paid" | "failed";
  createdAt: string;
  paidAt: string | null;
  accessUntil: string | null;
}

@Injectable()
export class BillingRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  async createPending(userId: string, amountPaise: number, cycle: BillingCycle): Promise<string> {
    const { rows } = await this.db.query<{ id: string }>(
      `INSERT INTO ${TABLES.BILLING_PAYMENTS} (user_id, plan_id, billing_cycle, amount_paise)
       VALUES ($1, 'pro', $2, $3) RETURNING id`,
      [userId, cycle, amountPaise],
    );
    return rows[0].id;
  }

  async setOrder(id: string, orderId: string): Promise<void> {
    await this.db.query(
      `UPDATE ${TABLES.BILLING_PAYMENTS} SET razorpay_order_id = $2 WHERE id = $1 AND status = 'pending'`,
      [id, orderId],
    );
  }

  async failPending(orderId: string): Promise<void> {
    await this.db.query(
      `UPDATE ${TABLES.BILLING_PAYMENTS} SET status = 'failed'
       WHERE razorpay_order_id = $1 AND status = 'pending'`,
      [orderId],
    );
  }

  async failById(id: string): Promise<void> {
    await this.db.query(
      `UPDATE ${TABLES.BILLING_PAYMENTS} SET status = 'failed' WHERE id = $1 AND status = 'pending'`,
      [id],
    );
  }

  async orderForUser(userId: string, orderId: string): Promise<{ amountPaise: number; status: string } | null> {
    const { rows } = await this.db.query<{ amount_paise: string; status: string }>(
      `SELECT amount_paise, status FROM ${TABLES.BILLING_PAYMENTS}
       WHERE user_id = $1 AND razorpay_order_id = $2`,
      [userId, orderId],
    );
    return rows[0] ? { amountPaise: Number(rows[0].amount_paise), status: rows[0].status } : null;
  }

  async complete(
    orderId: string,
    paymentId: string,
    method: string | null,
    amountPaise: number,
    currency: string,
    expectedUserId: string | null = null,
  ): Promise<{ accessUntil: string }> {
    return inTransaction(this.db, async (client) => {
      const { rows } = await client.query<{
        id: string; user_id: string; plan_id: string; amount_paise: string;
        billing_cycle: BillingCycle; status: string; access_until: Date | null;
      }>(
        `SELECT id, user_id, plan_id, amount_paise, billing_cycle, status, access_until
         FROM ${TABLES.BILLING_PAYMENTS} WHERE razorpay_order_id = $1
           AND ($2::uuid IS NULL OR user_id = $2) FOR UPDATE`,
        [orderId, expectedUserId],
      );
      const payment = rows[0];
      if (!payment || Number(payment.amount_paise) !== amountPaise || payment.plan_id !== "pro" || currency !== "INR") {
        throw new Error("Payment does not match a billing order");
      }
      if (payment.status === "paid" && payment.access_until) {
        return { accessUntil: payment.access_until.toISOString() };
      }
      if (payment.status !== "pending") throw new Error("This billing order is not pending");

      // Serialize renewals for this account, including when it has no active row yet.
      await client.query(`SELECT id FROM ${TABLES.USERS} WHERE id = $1 FOR UPDATE`, [payment.user_id]);
      const subscription = await client.query<{ current_period_end: Date | null }>(
        `SELECT current_period_end FROM ${TABLES.SUBSCRIPTIONS}
         WHERE user_id = $1 AND status IN ('active', 'past_due') AND current_period_end > now()
         FOR UPDATE`, [payment.user_id],
      );
      const currentEnd = subscription.rows[0]?.current_period_end ?? null;
      const interval = payment.billing_cycle === "yearly" ? "1 year" : "1 month";
      const { rows: endRows } = await client.query<{ end_at: Date }>(
        `SELECT (GREATEST(COALESCE($1::timestamptz, now()), now()) + $2::interval) AS end_at`,
        [currentEnd, interval],
      );
      const endAt = endRows[0].end_at;
      await client.query(
        `INSERT INTO ${TABLES.SUBSCRIPTIONS} (user_id, plan_id, status, current_period_end, stripe_customer_id, stripe_subscription_id)
         VALUES ($1, 'pro', 'active', $2, NULL, NULL)
         ON CONFLICT (user_id) DO UPDATE SET plan_id = 'pro', status = 'active',
           current_period_end = EXCLUDED.current_period_end, updated_at = now()`,
        [payment.user_id, endAt],
      );
      await client.query(
        `UPDATE ${TABLES.BILLING_PAYMENTS}
         SET status = 'paid', razorpay_payment_id = $2, payment_method = $3, paid_at = now(), access_until = $4
         WHERE id = $1`,
        [payment.id, paymentId, method, endAt],
      );
      return { accessUntil: endAt.toISOString() };
    });
  }

  async history(userId: string): Promise<BillingPayment[]> {
    const { rows } = await this.db.query<{
      id: string; billing_cycle: BillingCycle; amount_paise: string; currency: string;
      razorpay_order_id: string | null; razorpay_payment_id: string | null; payment_method: string | null;
      status: BillingPayment["status"]; created_at: Date; paid_at: Date | null; access_until: Date | null;
    }>(
      `SELECT id, billing_cycle, amount_paise, currency, razorpay_order_id, razorpay_payment_id,
              payment_method, status, created_at, paid_at, access_until
       FROM ${TABLES.BILLING_PAYMENTS} WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId],
    );
    return rows.map((row) => ({
      id: row.id, cycle: row.billing_cycle, amountPaise: Number(row.amount_paise), currency: row.currency,
      orderId: row.razorpay_order_id, paymentId: row.razorpay_payment_id, method: row.payment_method,
      status: row.status, createdAt: row.created_at.toISOString(), paidAt: row.paid_at?.toISOString() ?? null,
      accessUntil: row.access_until?.toISOString() ?? null,
    }));
  }
}
