// Plans, their models and their allowance windows. Shared by the proxy, the
// user's Usage page and the admin Plans page.

export type Provider = "anthropic" | "openai" | "google" | "xai" | "fuelix";

// One allowance window, e.g. { id: "5h", label: "5-hour", limit: 3_000_000, duration_hours: 5 }.
// Like Claude Code's limits, it measures cost, not requests: `limit` is what
// requests in the window may cost us, in micro-dollars (3_000_000 = $3).
// Stored as-is in plans.windows (jsonb), hence the snake_case field.
// `duration_hours: null` never resets: a one-time credit (the Free plan's).
// `premium_only` windows count only the plan's premium models, like Claude's
// separate weekly Opus limit.
export interface PlanWindow {
  id: string;
  label: string;
  limit: number;
  duration_hours: number | null;
  premium_only?: boolean;
}

// What the admin used to work out a paid plan's budgets (Plans page calculator).
export interface PlanPricing {
  // What the user pays per month, in rupees.
  monthlyPriceInr: number;
  // Share of the price kept as margin, 0–90.
  marginPercent: number;
  // Rupees per US dollar, for provider costs.
  inrPerUsd: number;
  // Full 5-hour sessions that fit in the weekly budget.
  sessionsPerWeek: number;
  // Share of the weekly budget premium models may use, 0–100.
  premiumSharePercent: number;
}

export interface Plan {
  id: string;
  name: string;
  windows: PlanWindow[];
  pricing?: PlanPricing | null;
}

export interface PlanModel {
  // What the user sees and the extension sends, e.g. "gpt-5.5".
  modelId: string;
  provider: Provider;
  // The name sent to the provider; usually the same as modelId.
  upstreamModel: string;
  // What the provider charges us, in US dollars per million tokens. Cache
  // prices that are null are charged at the input price.
  inputPrice: number;
  outputPrice: number;
  cacheReadPrice: number | null;
  cacheWritePrice: number | null;
  // Counts against the plan's premium-only window too (e.g. Opus-class models).
  premium: boolean;
}
