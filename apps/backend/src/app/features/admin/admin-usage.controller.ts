import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AdminUsageService } from "./admin-usage.service.js";
import { AdminGuard } from "./admin.guard.js";
import { UsageRangeDto } from "./dto/usage-range.dto.js";

@Controller("admin")
@UseGuards(AdminGuard)
export class AdminUsageController {
  constructor(private readonly usage: AdminUsageService) {}

  @Get("overview")
  overview() {
    return this.usage.overview();
  }

  @Get("usage")
  report(@Query() query: UsageRangeDto) {
    return this.usage.report(query.from, query.to);
  }
}
