import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PlansModule } from "../plans/plans.module.js";
import { ProviderKeysModule } from "../provider-keys/provider-keys.module.js";
import { UsageModule } from "../usage/usage.module.js";
import { adminConfig } from "./admin.config.js";
import { AdminGuard } from "./admin.guard.js";
import { AdminAdminsController } from "./admin-admins.controller.js";
import { AdminAdminsService } from "./admin-admins.service.js";
import { AdminAuthController } from "./admin-auth.controller.js";
import { AdminAuthService } from "./admin-auth.service.js";
import { AdminKeysController } from "./admin-keys.controller.js";
import { AdminKeysService } from "./admin-keys.service.js";
import { AdminPlansController } from "./admin-plans.controller.js";
import { AdminPlansService } from "./admin-plans.service.js";
import { AdminUsageController } from "./admin-usage.controller.js";
import { AdminUsageService } from "./admin-usage.service.js";
import { AdminUsersController } from "./admin-users.controller.js";
import { AdminUsersRepository } from "./admin-users.repository.js";
import { AdminUsersService } from "./admin-users.service.js";
import { AdminsRepository } from "./admins.repository.js";
import { AuditLogRepository } from "./audit-log.repository.js";

// The admin dashboard, under /api/admin. Admins sign in separately from users.
@Module({
  imports: [
    PlansModule,
    ProviderKeysModule,
    UsageModule,
    ConfigModule.forFeature(adminConfig),
  ],
  controllers: [
    AdminAuthController,
    AdminAdminsController,
    AdminKeysController,
    AdminPlansController,
    AdminUsersController,
    AdminUsageController,
  ],
  providers: [
    AdminsRepository,
    AdminGuard,
    AdminAuthService,
    AdminAdminsService,
    AuditLogRepository,
    AdminKeysService,
    AdminPlansService,
    AdminUsersRepository,
    AdminUsersService,
    AdminUsageService,
  ],
})
export class AdminModule {}
