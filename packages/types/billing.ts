export type BillingCycle = "monthly" | "yearly";

export interface BillingPayment {
  id: string;
  cycle: BillingCycle;
  amountPaise: number;
  currency: "INR";
  orderId: string | null;
  paymentId: string | null;
  method: string | null;
  status: "pending" | "paid" | "failed";
  createdAt: string;
  paidAt: string | null;
  accessUntil: string | null;
}

export interface BillingSummary {
  plan: { id: string; name: string; endsAt: string | null };
  prices: { monthlyPaise: number; yearlyPaise: number; currency: "INR" } | null;
  checkoutEnabled: boolean;
  payments: BillingPayment[];
}
