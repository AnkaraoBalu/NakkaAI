// What a signed-in user sees on the website (GET /api/usage): their plan and
// how much of each allowance window is used, like Claude Code's usage screen.
// Never request counts, tokens or costs.
import type { UsageWindow } from "./extension.js";

// Tokens summed over some period. Used by the admin reports.
export interface UsageTotals {
  requests: number;
  // Uncached input tokens.
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
}

export interface MyUsage {
  plan: { id: string; name: string; endsAt: string | null };
  // The same windows the VS Code extension shows (GET /account):
  // `used` is the percent used, out of `limit` 100.
  windows: UsageWindow[];
}
