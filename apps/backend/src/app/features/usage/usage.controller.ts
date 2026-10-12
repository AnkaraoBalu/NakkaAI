import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard, CurrentUserId } from "../auth/auth.guard.js";
import { UsageService } from "./usage.service.js";

@Controller("usage")
@UseGuards(AuthGuard)
export class UsageController {
  constructor(private readonly usage: UsageService) {}

  @Get()
  mine(@CurrentUserId() userId: string) {
    return this.usage.forUser(userId);
  }
}
