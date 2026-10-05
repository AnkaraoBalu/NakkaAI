import type { PlanModel } from "@nakka/types/plans";
import type { TokenCounts } from "./usage-meter.js";

export type ModelPrices = Pick<
  PlanModel,
  "inputPrice" | "outputPrice" | "cacheReadPrice" | "cacheWritePrice"
>;

// A model can be used only once its input and output prices are set.
export const hasPrices = (model: ModelPrices) =>
  model.inputPrice > 0 && model.outputPrice > 0;

// What a request cost us, in micro-dollars. Prices are dollars per million
// tokens, which is the same as micro-dollars per token. Rounded up, so a
// request with any tokens always counts.
export function requestCostMicros(tokens: TokenCounts, model: ModelPrices): number {
  const cost =
    tokens.inputTokens * model.inputPrice +
    tokens.outputTokens * model.outputPrice +
    tokens.cacheReadTokens * (model.cacheReadPrice ?? model.inputPrice) +
    tokens.cacheWriteTokens * (model.cacheWritePrice ?? model.inputPrice);
  return Math.ceil(cost);
}

// When a provider reports no usage at all, charge the request body as input
// (about 4 characters per token) so nothing is ever free by accident.
export function estimateTokens(body: Buffer): TokenCounts {
  return {
    inputTokens: Math.ceil(body.length / 4),
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
  };
}
