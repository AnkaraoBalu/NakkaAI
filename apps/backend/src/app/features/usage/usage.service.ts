import { Injectable } from "@nestjs/common";
import type { MyUsage } from "@nakka/types/usage";
import { PlansRepository } from "../plans/plans.repository.js";
import { PlansService } from "../plans/plans.service.js";
import {
  lastDays,
  UsageReportsRepository,
  withoutCost,
} from "./usage-reports.repository.js";

// The website's Usage page: the user's plan, allowance windows and history.
@Injectable()
export class UsageService {
  constructor(
    private readonly plans: PlansRepository,
    private readonly planWindows: PlansService,
    private readonly reports: UsageReportsRepository,
  ) {}

  async forUser(userId: string, days: number): Promise<MyUsage> {
    const plan = await this.plans.planFor(userId);
    const range = lastDays(days);
    const [windows, models, totals, daily, byModel] = await Promise.all([
      this.planWindows.windowsFor(userId, plan),
      this.plans.models(plan.id),
      this.reports.totals(range, userId),
      this.reports.daily(range, userId),
      this.reports.byModel(range, userId),
    ]);
    return {
      plan: { id: plan.id, name: plan.name, endsAt: plan.endsAt?.toISOString() ?? null },
      windows,
      models: models.map((model) => ({ id: model.modelId, provider: model.provider })),
      days,
      totals: withoutCost(totals),
      daily: daily.map(withoutCost),
      byModel: byModel.map(withoutCost),
    };
  }
}
