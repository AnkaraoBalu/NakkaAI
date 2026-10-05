// Plans, their models and their allowance windows. Shared by the proxy, the
// user's Usage page and the admin Plans page.

export type Provider = "anthropic" | "openai" | "google" | "xai";

// One allowance window, e.g. { id: "5h", label: "5-hour", limit: 3_000_000, duration_hours: 5 }.
// Like Claude Code's limits, it measures cost, not requests: `limit` is what
// requests in the window may cost us, in micro-dollars (3_000_000 = $3).
// Stored as-is in plans.windows (jsonb), hence the snake_case field.
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
}
