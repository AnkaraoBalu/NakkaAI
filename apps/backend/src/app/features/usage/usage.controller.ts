import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard, CurrentUserId } from "../auth/auth.guard.js";
import { UsageQueryDto } from "./dto/usage-query.dto.js";
import { UsageService } from "./usage.service.js";

@Controller("usage")
@UseGuards(AuthGuard)
export class UsageController {
  constructor(private readonly usage: UsageService) {}

  @Get()
  mine(@CurrentUserId() userId: string, @Query() query: UsageQueryDto) {
    return this.usage.forUser(userId, query.days);
  }
}
