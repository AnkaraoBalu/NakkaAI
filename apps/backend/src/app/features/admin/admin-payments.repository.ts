import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import type { AdminPaymentRow, AdminPaymentTotals } from "@nakka/types/admin";
import type { BillingCycle, BillingPayment } from "@nakka/types/billing";
import { DATABASE, TABLES } from "../../common/database/constants.js";

interface Row {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  billing_cycle: BillingCycle;
  amount_paise: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  payment_method: string | null;
  status: BillingPayment["status"];
  created_at: Date;
  paid_at: Date | null;
  access_until: Date | null;
  total: string;
}

// Searched text is matched literally: % and _ aren't wildcards.
const likePattern = (text: string) => `%${text.replace(/[\\%_]/g, "\\$&")}%`;

const toRow = (row: Row): AdminPaymentRow => ({
  id: row.id,
  userId: row.user_id,
  email: row.email,
  name: `${row.first_name} ${row.last_name}`.trim(),
  cycle: row.billing_cycle,
  amountPaise: Number(row.amount_paise),
  currency: "INR",
  orderId: row.razorpay_order_id,
  paymentId: row.razorpay_payment_id,
  method: row.payment_method,
  status: row.status,
  createdAt: row.created_at.toISOString(),
  paidAt: row.paid_at?.toISOString() ?? null,
  accessUntil: row.access_until?.toISOString() ?? null,
});

// Every Razorpay checkout across all users, for the admin Payments page.
@Injectable()
export class AdminPaymentsRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  // Newest first; an empty status lists every status.
  async list(
    search: string,
    status: string,
    page: number,
    pageSize: number,
  ): Promise<{ items: AdminPaymentRow[]; total: number }> {
    const { rows } = await this.db.query<Row>(
      `SELECT b.id, b.user_id, u.email, u.first_name, u.last_name, b.billing_cycle, b.amount_paise,
              b.razorpay_order_id, b.razorpay_payment_id, b.payment_method, b.status,
              b.created_at, b.paid_at, b.access_until, count(*) OVER () AS total
       FROM ${TABLES.BILLING_PAYMENTS} b
       JOIN ${TABLES.USERS} u ON u.id = b.user_id
       WHERE ($1 = '' OR b.status = $1)
         AND ($2 = '' OR u.email ILIKE $3 OR (u.first_name || ' ' || u.last_name) ILIKE $3
              OR b.razorpay_order_id ILIKE $3 OR b.razorpay_payment_id ILIKE $3)
       ORDER BY b.created_at DESC, b.id
       LIMIT $4 OFFSET $5`,
      [status, search, likePattern(search), pageSize, (page - 1) * pageSize],
    );
    return { items: rows.map(toRow), total: Number(rows[0]?.total ?? 0) };
  }

  async totals(): Promise<AdminPaymentTotals> {
    const { rows } = await this.db.query<{
      revenue: string; revenue_30d: string; paid: string; failed: string; pending: string; paying_users: string;
    }>(
      `SELECT COALESCE(sum(amount_paise) FILTER (WHERE status = 'paid'), 0) AS revenue,
              COALESCE(sum(amount_paise) FILTER (WHERE status = 'paid' AND paid_at > now() - interval '30 days'), 0)
                AS revenue_30d,
              count(*) FILTER (WHERE status = 'paid') AS paid,
              count(*) FILTER (WHERE status = 'failed') AS failed,
              count(*) FILTER (WHERE status = 'pending') AS pending,
              count(DISTINCT user_id) FILTER (WHERE status = 'paid') AS paying_users
       FROM ${TABLES.BILLING_PAYMENTS}`,
    );
    const row = rows[0];
    return {
      revenuePaise: Number(row.revenue),
      revenueLast30DaysPaise: Number(row.revenue_30d),
      paid: Number(row.paid),
      failed: Number(row.failed),
      pending: Number(row.pending),
      payingUsers: Number(row.paying_users),
    };
  }
}
