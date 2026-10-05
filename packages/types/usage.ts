// What a signed-in user sees on the website's Usage page (GET /api/usage).
import type { UsageWindow } from "./extension.js";
import type { Provider } from "./plans.js";

export interface UsageTotals {
  requests: number;
  // Uncached input tokens.
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
}

export interface DailyUsage extends UsageTotals {
  // YYYY-MM-DD (UTC).
  date: string;
}

export interface ModelUsage extends UsageTotals {
  modelId: string;
  provider: Provider;
}

export interface MyUsage {
  plan: { id: string; name: string; endsAt: string | null };
  // The same windows the VS Code extension shows (GET /account):
  // `used` is the percent used, out of `limit` 100.
  windows: UsageWindow[];
  models: { id: string; provider: Provider }[];
  days: number;
  totals: UsageTotals;
  daily: DailyUsage[];
  byModel: ModelUsage[];
}
