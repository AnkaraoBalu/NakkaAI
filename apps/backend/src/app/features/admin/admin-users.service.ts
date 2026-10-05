import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { AdminUserDetail, AdminUserList } from "@nakka/types/admin";
import { DEFAULT_PLAN, PlansRepository } from "../plans/plans.repository.js";
import { PlansService } from "../plans/plans.service.js";
import { SubscriptionsRepository } from "../plans/subscriptions.repository.js";
import { lastDays, UsageReportsRepository } from "../usage/usage-reports.repository.js";
import { AdminUsersRepository } from "./admin-users.repository.js";
import { AuditLogRepository } from "./audit-log.repository.js";

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly users: AdminUsersRepository,
    private readonly plans: PlansRepository,
    private readonly planWindows: PlansService,
    private readonly subscriptions: SubscriptionsRepository,
    private readonly reports: UsageReportsRepository,
    private readonly audit: AuditLogRepository,
  ) {}

  async list(search: string, page: number, pageSize: number): Promise<AdminUserList> {
    const { items, total } = await this.users.list(search, page, pageSize);
    return { items, total, page, pageSize };
  }

  async detail(userId: string): Promise<AdminUserDetail> {
    const user = await this.users.find(userId);
    if (!user) throw new NotFoundException("User not found.");
    const plan = await this.plans.planFor(userId);
    const range = lastDays(30);
    const [windows, last30Days, daily, byModel] = await Promise.all([
      this.planWindows.spendFor(userId, plan),
      this.reports.totals(range, userId),
      this.reports.daily(range, userId),
      this.reports.byModel(range, userId),
    ]);
    return { ...user, windows, last30Days, daily, byModel };
  }

  // Manual plan change (no payment gateway yet). Free cancels the paid plan.
  async assignPlan(
    userId: string,
    planId: string,
    endsAt: string | null | undefined,
    adminId: string,
  ): Promise<AdminUserDetail> {
    const before = await this.users.find(userId);
    if (!before) throw new NotFoundException("User not found.");

    if (planId === DEFAULT_PLAN) {
      await this.subscriptions.cancel(userId, adminId);
    } else {
      if (!(await this.plans.exists(planId))) throw new BadRequestException("Unknown plan.");
      const end = endsAt ? new Date(endsAt) : null;
      if (end && end.getTime() <= Date.now()) {
        throw new BadRequestException("The end date must be in the future.");
      }
      await this.subscriptions.assign(userId, planId, end, adminId);
    }
    await this.audit.record(adminId, "subscription.assign", userId, {
      email: before.email,
      from: before.planId,
      to: planId,
      endsAt: planId === DEFAULT_PLAN ? null : (endsAt ?? null),
    });
    return this.detail(userId);
  }
}
