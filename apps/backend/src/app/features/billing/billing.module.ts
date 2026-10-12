import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module.js";
import { PlansModule } from "../plans/plans.module.js";
import { BillingController } from "./billing.controller.js";
import { BillingRepository } from "./billing.repository.js";
import { BillingService } from "./billing.service.js";

@Module({
  imports: [AuthModule, PlansModule],
  controllers: [BillingController],
  providers: [BillingRepository, BillingService],
})
export class BillingModule {}
