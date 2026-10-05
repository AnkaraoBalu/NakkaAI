import { Injectable } from "@nestjs/common";
import type { WindowSpend } from "@nakka/types/admin";
import type { UsageWindow } from "@nakka/types/extension";
import { PlansRepository, type Plan } from "./plans.repository.js";

const HOUR = 60 * 60 * 1000;

// Percent of a window used, like Claude Code shows it. Rounded down, so 100%
// means the window really is used up.
export const percentUsed = (spent: number, limit: number) =>
  limit > 0 ? Math.min(100, Math.floor((spent / limit) * 100)) : 0;

// Allowance windows as users see them. The VS Code extension (GET /account),
// the website's Usage page and the admin user page all use this, so they agree.
@Injectable()
export class PlansService {
  constructor(private readonly plans: PlansRepository) {}

  // Percent used (`limit` is always 100): users never see dollar amounts.
  async windowsFor(userId: string, plan: Plan): Promise<UsageWindow[]> {
    return (await this.spendFor(userId, plan)).map(
      ({ spentMicros: _spent, limitMicros: _limit, ...window }) => window,
    );
  }

  // The same windows with what was spent, for admins.
  async spendFor(userId: string, plan: Plan): Promise<WindowSpend[]> {
    if (!plan.windows.length) return [];
    const usage = await this.plans.usage(userId);
    return plan.windows.map((window) => {
      const current = usage.get(window.id);
      const spent = current?.used ?? 0;
      return {
        id: window.id,
        label: window.label,
        used: percentUsed(spent, window.limit),
        limit: 100,
        // A window that hasn't started yet would reset this long after first use.
        resetsAt: (
          current?.resetsAt ??
          new Date(Date.now() + window.duration_hours * HOUR)
        ).toISOString(),
        spentMicros: spent,
        limitMicros: window.limit,
      };
    });
  }
}
