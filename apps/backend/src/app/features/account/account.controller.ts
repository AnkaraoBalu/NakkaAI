import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard, CurrentUserId } from "../auth/auth.guard.js";
import { ClerkExchangeDto } from "../auth/dto/clerk-exchange.dto.js";
import { AccountService } from "./account.service.js";
import { SetPasswordDto } from "./dto/set-password.dto.js";

@Controller("account")
@UseGuards(AuthGuard)
export class AccountController {
  constructor(private readonly account: AccountService) {}

  @Get("security")
  security(@CurrentUserId() userId: string) {
    return this.account.security(userId);
  }

  @Post("identities/clerk")
  @HttpCode(HttpStatus.OK)
  connect(@CurrentUserId() userId: string, @Body() dto: ClerkExchangeDto) {
    return this.account.connect(userId, dto.token);
  }

  @Delete("identities/:id")
  disconnect(
    @CurrentUserId() userId: string,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return this.account.disconnect(userId, id);
  }

  @Put("password")
  setPassword(@CurrentUserId() userId: string, @Body() dto: SetPasswordDto) {
    return this.account.setPassword(userId, dto);
  }
}
