import { Module } from "@nestjs/common";
import { PlansRepository } from "./plans.repository.js";
import { PlansService } from "./plans.service.js";
import { SubscriptionsRepository } from "./subscriptions.repository.js";

// Plans, their models and windows, and who is on which plan. Used by the
// extension API, the proxy, the Usage page and the admin dashboard.
@Module({
  providers: [PlansRepository, PlansService, SubscriptionsRepository],
  exports: [PlansRepository, PlansService, SubscriptionsRepository],
})
export class PlansModule {}
