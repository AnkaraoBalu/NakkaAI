import type { BillingCycle } from "@nakka/types/billing";

// Billing yearly pays 12 months at 20% off. The website's pricing page shows the
// same numbers, because both read them from here.
const YEARLY_PRICE_FACTOR = 12 * 0.8;

export interface ProPrices {
  monthlyPaise: number;
  yearlyPaise: number;
  currency: "INR";
}

// What a billing cycle costs, in paise, for a monthly price in rupees.
export function cyclePaise(monthlyRupees: number, cycle: BillingCycle): number {
  return Math.round(monthlyRupees * (cycle === "yearly" ? YEARLY_PRICE_FACTOR : 1) * 100);
}

// The Pro prices from the plan's saved monthly price, or null while none is set.
export function proPrices(monthlyRupees: unknown): ProPrices | null {
  const rupees = Number(monthlyRupees ?? 0);
  if (!Number.isFinite(rupees) || rupees < 1) return null;
  return {
    monthlyPaise: cyclePaise(rupees, "monthly"),
    yearlyPaise: cyclePaise(rupees, "yearly"),
    currency: "INR",
  };
}
