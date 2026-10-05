import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdminUsersService } from "./admin-users.service.js";
import { AdminGuard, CurrentAdminId } from "./admin.guard.js";
import { AssignPlanDto } from "./dto/assign-plan.dto.js";
import { ListUsersDto } from "./dto/list-users.dto.js";

@Controller("admin/users")
@UseGuards(AdminGuard)
export class AdminUsersController {
  constructor(private readonly users: AdminUsersService) {}

  @Get()
  list(@Query() query: ListUsersDto) {
    return this.users.list(query.search, query.page, query.pageSize);
  }

  @Get(":id")
  detail(@Param("id", new ParseUUIDPipe()) userId: string) {
    return this.users.detail(userId);
  }

  @Put(":id/plan")
  assignPlan(
    @Param("id", new ParseUUIDPipe()) userId: string,
    @Body() dto: AssignPlanDto,
    @CurrentAdminId() adminId: string,
  ) {
    return this.users.assignPlan(userId, dto.planId, dto.endsAt, adminId);
  }
}
