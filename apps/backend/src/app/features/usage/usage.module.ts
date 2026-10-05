import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { PlansModule } from "../plans/plans.module.js";
import { UsageReportsRepository } from "./usage-reports.repository.js";
import { UsageController } from "./usage.controller.js";
import { UsageService } from "./usage.service.js";

// GET /api/usage for the website, and the usage reports the admin dashboard reuses.
@Module({
  imports: [AuthModule, PlansModule],
  controllers: [UsageController],
  providers: [UsageService, UsageReportsRepository],
  exports: [UsageReportsRepository],
})
export class UsageModule {}
