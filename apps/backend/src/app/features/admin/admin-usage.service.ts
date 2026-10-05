import { BadRequestException, Injectable } from "@nestjs/common";
import type { AdminOverview, AdminUsageReport } from "@nakka/types/admin";
import { ProviderKeysService } from "../provider-keys/provider-keys.service.js";
import {
  lastDays,
  UsageReportsRepository,
  type DayRange,
} from "../usage/usage-reports.repository.js";
import { AdminUsersRepository } from "./admin-users.repository.js";
import { AuditLogRepository } from "./audit-log.repository.js";

const MAX_DAYS = 366;
const DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class AdminUsageService {
  constructor(
    private readonly reports: UsageReportsRepository,
    private readonly users: AdminUsersRepository,
    private readonly keys: ProviderKeysService,
    private readonly audit: AuditLogRepository,
  ) {}

  async overview(): Promise<AdminOverview> {
    const today = lastDays(1);
    const week = lastDays(7);
    const [users, todayTotals, last7Days, providers, topUsers, recentActivity] =
      await Promise.all([
        this.users.counts(),
        this.reports.totals(today, null),
        this.reports.daily(week, null),
        this.keys.list(),
        this.reports.topUsers(week, 5),
        this.audit.recent(8),
      ]);
    return { users, today: todayTotals, last7Days, providers, topUsers, recentActivity };
  }

  async report(from?: string, to?: string): Promise<AdminUsageReport> {
    const range = this.range(from, to);
    const [totals, daily, byModel, byProvider, topUsers] = await Promise.all([
      this.reports.totals(range, null),
      this.reports.daily(range, null),
      this.reports.byModel(range, null),
      this.reports.byProvider(range),
      this.reports.topUsers(range, 10),
    ]);
    return { ...range, totals, daily, byModel, byProvider, topUsers };
  }

  private range(from?: string, to?: string): DayRange {
    const fallback = lastDays(30);
    const range = { from: from ?? fallback.from, to: to ?? fallback.to };
    const start = Date.parse(`${range.from}T00:00:00Z`);
    const end = Date.parse(`${range.to}T00:00:00Z`);
    if (Number.isNaN(start) || Number.isNaN(end)) {
      throw new BadRequestException("Dates must be real days (YYYY-MM-DD).");
    }
    if (start > end) throw new BadRequestException("The start date is after the end date.");
    if ((end - start) / DAY + 1 > MAX_DAYS) {
      throw new BadRequestException("Choose a range of at most a year.");
    }
    return range;
  }
}
