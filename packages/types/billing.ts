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

// GET /api/billing/pricing: Pro's price for the public pricing page (no sign-in).
// `prices` is null until the admin has set Pro's monthly price.
export interface PublicPricing {
  prices: BillingSummary["prices"];
}
