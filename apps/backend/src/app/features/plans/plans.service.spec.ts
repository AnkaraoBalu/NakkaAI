import { describe, expect, it, vi } from "vitest";
import { PlansService, percentUsed, windowsFor } from "./plans.service.js";
import type { PlansRepository } from "./plans.repository.js";

const HOUR = 60 * 60 * 1000;
// $3 per 5 hours, $25 per week, in micro-dollars.
const plan = {
  id: "pro",
  name: "Pro",
  windows: [
    { id: "5h", label: "5-hour", limit: 3_000_000, duration_hours: 5 },
    { id: "week", label: "Weekly", limit: 25_000_000, duration_hours: 168 },
  ],
};

function setup(usage: Map<string, { used: number; resetsAt: Date }>) {
  const repository = { usage: vi.fn(async () => usage) };
  return { service: new PlansService(repository as unknown as PlansRepository), repository };
}

describe("allowance windows", () => {
  it("shows users the percent used, never the dollars", async () => {
    const resetsAt = new Date("2030-01-01T05:00:00Z");
    const { service } = setup(new Map([["5h", { used: 1_020_000, resetsAt }]]));
    const [fiveHour] = await service.windowsFor("u1", plan);
    expect(fiveHour).toEqual({
      id: "5h", label: "5-hour", used: 34, limit: 100, resetsAt: resetsAt.toISOString(),
    });
  });

  it("gives admins the spend behind the percentage", async () => {
    const { service } = setup(new Map([["week", { used: 5_000_000, resetsAt: new Date() }]]));
    const [, week] = await service.spendFor("u1", plan);
    expect(week).toMatchObject({ used: 20, limit: 100, spentMicros: 5_000_000, limitMicros: 25_000_000 });
  });

  it("shows an unstarted window as empty, resetting one full duration from now", async () => {
    const { service } = setup(new Map());
    const before = Date.now();
    const [, week] = await service.windowsFor("u1", plan);
    expect(week!.used).toBe(0);
    const resets = Date.parse(week!.resetsAt!);
    expect(resets).toBeGreaterThanOrEqual(before + 168 * HOUR);
    expect(resets).toBeLessThanOrEqual(Date.now() + 168 * HOUR);
  });

  it("doesn't query usage for a plan without windows", async () => {
    const { service, repository } = setup(new Map());
    expect(await service.windowsFor("u1", { ...plan, windows: [] })).toEqual([]);
    expect(repository.usage).not.toHaveBeenCalled();
  });

  it("reaches 100% only when the window is really used up, and stays there", () => {
    expect(percentUsed(2_999_999, 3_000_000)).toBe(99);
    expect(percentUsed(3_000_000, 3_000_000)).toBe(100);
    expect(percentUsed(3_400_000, 3_000_000)).toBe(100);
    expect(percentUsed(0, 3_000_000)).toBe(0);
  });
});

describe("Free credit and premium cap", () => {
  const free = {
    id: "free",
    name: "Free",
    windows: [{ id: "credit", label: "Free credit", limit: 250_000, duration_hours: null }],
  };

  it("shows a one-time credit without a reset time", async () => {
    const { service } = setup(new Map([["credit", { used: 125_000, resetsAt: new Date(8.64e15) }]]));
    const [credit] = await service.windowsFor("u1", free);
    expect(credit).toEqual({ id: "credit", label: "Free credit", used: 50, limit: 100 });
    expect(credit).not.toHaveProperty("resetsAt");
  });

  it("counts premium models against the premium cap, others only against the rest", () => {
    const windows = [
      { id: "5h", label: "5-hour", limit: 1, duration_hours: 5 },
      { id: "week-premium", label: "Premium weekly", limit: 1, duration_hours: 168, premium_only: true },
    ];
    expect(windowsFor(windows, { premium: true }).map((w) => w.id)).toEqual(["5h", "week-premium"]);
    expect(windowsFor(windows, { premium: false }).map((w) => w.id)).toEqual(["5h"]);
  });
});
