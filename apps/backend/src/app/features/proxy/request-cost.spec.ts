import { describe, expect, it } from "vitest";
import { estimateTokens, hasPrices, requestCostMicros } from "./request-cost.js";

// Opus-like prices: $15 in, $75 out, $1.50 cache read, $18.75 cache write per 1M.
const opus = { inputPrice: 15, outputPrice: 75, cacheReadPrice: 1.5, cacheWritePrice: 18.75 };
const mini = { inputPrice: 0.15, outputPrice: 0.6, cacheReadPrice: null, cacheWritePrice: null };
const tokens = (input: number, output: number, cacheRead = 0, cacheWrite = 0) => ({
  inputTokens: input,
  outputTokens: output,
  cacheReadTokens: cacheRead,
  cacheWriteTokens: cacheWrite,
});

describe("request cost", () => {
  it("weights each kind of token by the model's price", () => {
    // 1000×15 + 500×75 + 20000×1.5 + 2000×18.75 = 15000 + 37500 + 30000 + 37500
    expect(requestCostMicros(tokens(1000, 500, 20_000, 2000), opus)).toBe(120_000);
  });

  it("makes the same request far cheaper on a small model", () => {
    const same = tokens(1000, 500);
    expect(requestCostMicros(same, opus)).toBe(52_500);
    expect(requestCostMicros(same, mini)).toBe(450);
  });

  it("charges cache tokens at the input price when no cache price is set", () => {
    expect(requestCostMicros(tokens(0, 0, 1000, 1000), mini)).toBe(300);
  });

  it("rounds up so any tokens count, and nothing costs nothing", () => {
    expect(requestCostMicros(tokens(1, 0), mini)).toBe(1);
    expect(requestCostMicros(tokens(0, 0), opus)).toBe(0);
  });

  it("needs input and output prices before a model can be used", () => {
    expect(hasPrices(opus)).toBe(true);
    expect(hasPrices({ ...opus, outputPrice: 0 })).toBe(false);
  });

  it("estimates unreported usage from the request size", () => {
    expect(estimateTokens(Buffer.alloc(4001)).inputTokens).toBe(1001);
  });
});
