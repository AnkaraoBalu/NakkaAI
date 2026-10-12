import { describe, expect, it } from "vitest";
import { InFlightLimiter } from "./in-flight.js";

describe("in-flight limiter", () => {
  it("lets each user run up to the cap, and frees a slot on release", () => {
    const limiter = new InFlightLimiter();
    expect(limiter.tryAcquire("a", 2)).toBe(true);
    expect(limiter.tryAcquire("a", 2)).toBe(true);
    expect(limiter.tryAcquire("a", 2)).toBe(false);
    expect(limiter.tryAcquire("b", 2)).toBe(true);
    limiter.release("a");
    expect(limiter.tryAcquire("a", 2)).toBe(true);
  });
});
