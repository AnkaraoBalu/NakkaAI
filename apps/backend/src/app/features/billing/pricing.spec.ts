import { describe, expect, it } from "vitest";
import { cyclePaise, proPrices } from "./pricing.js";

describe("Pro prices", () => {
  it("₹999 a month is ₹9,590.40 a year (12 months at 20% off), in paise", () => {
    expect(proPrices(999)).toEqual({ monthlyPaise: 99_900, yearlyPaise: 959_040, currency: "INR" });
  });

  it("charges exactly what it shows", () => {
    expect(cyclePaise(999, "monthly")).toBe(proPrices(999)!.monthlyPaise);
    expect(cyclePaise(999, "yearly")).toBe(proPrices(999)!.yearlyPaise);
    expect(cyclePaise(1699, "yearly")).toBe(proPrices(1699)!.yearlyPaise);
  });

  it("has no price until one is set", () => {
    for (const value of [undefined, null, 0, 0.5, "abc", NaN, Infinity]) {
      expect(proPrices(value)).toBeNull();
    }
    expect(proPrices("999")?.monthlyPaise).toBe(99_900);
  });
});
