import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { AdminPlansService } from "./admin-plans.service.js";
import { AdminGuard, CurrentAdminId } from "./admin.guard.js";
import { SetPlanModelsDto } from "./dto/set-plan-models.dto.js";
import { UpdatePlanDto } from "./dto/update-plan.dto.js";

@Controller("admin/plans")
@UseGuards(AdminGuard)
export class AdminPlansController {
  constructor(private readonly plans: AdminPlansService) {}

  @Get()
  list() {
    return this.plans.list();
  }

  @Put(":id")
  update(
    @Param("id") planId: string,
    @Body() dto: UpdatePlanDto,
    @CurrentAdminId() adminId: string,
  ) {
    return this.plans.update(planId, dto.name, dto.windows, adminId);
  }

  @Put(":id/models")
  setModels(
    @Param("id") planId: string,
    @Body() dto: SetPlanModelsDto,
    @CurrentAdminId() adminId: string,
  ) {
    return this.plans.setModels(planId, dto.models, adminId);
  }
}
