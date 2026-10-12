import { Injectable } from "@nestjs/common";
import type { WindowSpend } from "@nakka/types/admin";
import type { UsageWindow } from "@nakka/types/extension";
import {
  PlansRepository,
  type Plan,
  type PlanModel,
  type PlanWindow,
  type WindowUsage,
} from "./plans.repository.js";

const HOUR = 60 * 60 * 1000;

// Percent of a window used, like Claude Code shows it. Rounded down, so 100%
// means the window really is used up.
export const percentUsed = (spent: number, limit: number) =>
  limit > 0 ? Math.min(100, Math.floor((spent / limit) * 100)) : 0;

// What a window has spent, from its usage row. A row of the wrong kind (the
// window was a one-time credit and now resets, or the other way round) or one
// that resets later than the window's length allows (the window was shortened)
// is left over from an earlier setup and counts as nothing; the next request
// replaces it (see UsageRepository.record).
export function spentIn(window: PlanWindow, row: WindowUsage | undefined): number {
  if (!row) return 0;
  if (window.duration_hours === null) return row.resetsAt === null ? row.used : 0;
  if (row.resetsAt === null) return 0;
  if (row.resetsAt.getTime() > Date.now() + window.duration_hours * HOUR) return 0;
  return row.used;
}

// The windows a request on this model counts against: all of them, except
// that premium-only windows count premium models only.
export const windowsFor = (windows: PlanWindow[], model: Pick<PlanModel, "premium">) =>
  windows.filter((window) => !window.premium_only || model.premium);

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
      const row = usage.get(window.id);
      const spent = spentIn(window, row);
      const current = spent > 0 ? row : undefined;
      return {
        id: window.id,
        label: window.label,
        used: percentUsed(spent, window.limit),
        limit: 100,
        // A one-time credit never resets. A window that hasn't started yet
        // would reset this long after first use.
        ...(window.duration_hours === null
          ? {}
          : {
              resetsAt: (
                current?.resetsAt ??
                new Date(Date.now() + window.duration_hours * HOUR)
              ).toISOString(),
            }),
        spentMicros: spent,
        limitMicros: window.limit,
      };
    });
  }
}
