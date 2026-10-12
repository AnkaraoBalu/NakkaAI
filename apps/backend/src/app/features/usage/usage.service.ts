import { Injectable } from "@nestjs/common";
import type { MyUsage } from "@nakka/types/usage";
import { PlansRepository } from "../plans/plans.repository.js";
import { PlansService } from "../plans/plans.service.js";

// The website's usage screen: the user's plan and how much of each allowance
// window is used. Two small queries, since every dashboard page asks for it.
@Injectable()
export class UsageService {
  constructor(
    private readonly plans: PlansRepository,
    private readonly planWindows: PlansService,
  ) {}

  async forUser(userId: string): Promise<MyUsage> {
    const plan = await this.plans.planFor(userId);
    return {
      plan: { id: plan.id, name: plan.name, endsAt: plan.endsAt?.toISOString() ?? null },
      windows: await this.planWindows.windowsFor(userId, plan),
    };
  }
}
