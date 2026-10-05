import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { AdminPlan } from "@nakka/types/admin";
import type { PlanModel, PlanPricing, PlanWindow } from "@nakka/types/plans";
import { PlansRepository } from "../plans/plans.repository.js";
import { AuditLogRepository } from "./audit-log.repository.js";

// Plans, their allowance windows and models, as edited on the admin page.
@Injectable()
export class AdminPlansService {
  constructor(
    private readonly plans: PlansRepository,
    private readonly audit: AuditLogRepository,
  ) {}

  async list(): Promise<AdminPlan[]> {
    const plans = await this.plans.list();
    const [models, counts] = await Promise.all([
      this.plans.modelsByPlan(plans.map((plan) => plan.id)),
      this.plans.subscriberCounts(),
    ]);
    return plans.map((plan) => ({
      ...plan,
      models: models.get(plan.id) ?? [],
      subscribers: counts.get(plan.id) ?? 0,
    }));
  }

  async update(
    planId: string,
    name: string,
    windows: PlanWindow[],
    pricing: PlanPricing | null,
    adminId: string,
  ): Promise<AdminPlan> {
    await this.assertExists(planId);
    assertUnique(windows.map((window) => window.id), "Each window needs a different id.");
    await this.plans.update(planId, name, windows, pricing);
    await this.audit.record(adminId, "plan.update", planId, { name, windows, pricing });
    return this.find(planId);
  }

  async setModels(planId: string, models: PlanModel[], adminId: string): Promise<AdminPlan> {
    await this.assertExists(planId);
    assertUnique(models.map((model) => model.modelId), "Each model can be on a plan once.");
    await this.plans.setModels(planId, models);
    await this.audit.record(adminId, "plan.models", planId, {
      models: models.map((model) => model.modelId),
    });
    return this.find(planId);
  }

  private async find(planId: string): Promise<AdminPlan> {
    return (await this.list()).find((plan) => plan.id === planId)!;
  }

  private async assertExists(planId: string) {
    if (!(await this.plans.exists(planId))) throw new NotFoundException("Unknown plan.");
  }
}

function assertUnique(values: string[], message: string) {
  if (new Set(values).size !== values.length) throw new BadRequestException(message);
}
