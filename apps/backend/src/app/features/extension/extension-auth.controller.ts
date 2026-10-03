import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard, CurrentUserId } from "../auth/auth.guard.js";
import {
  CompleteExtensionAuthDto,
  StartExtensionAuthDto,
} from "./dto/extension-auth.dto.js";
import { ExtensionAuthService } from "./extension-auth.service.js";

// Called by the website's /auth page (under /api).
@Controller("extension/auth")
export class ExtensionAuthController {
  constructor(private readonly extensionAuth: ExtensionAuthService) {}

  @Post("start")
  @HttpCode(HttpStatus.NO_CONTENT)
  start(@Body() dto: StartExtensionAuthDto) {
    return this.extensionAuth.start(dto.state, dto.redirect);
  }

  @Post("complete")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  complete(
    @CurrentUserId() userId: string,
    @Body() dto: CompleteExtensionAuthDto,
  ) {
    return this.extensionAuth.complete(userId, dto.state);
  }
}
