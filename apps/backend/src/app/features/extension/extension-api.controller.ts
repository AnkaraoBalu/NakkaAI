import {
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Redirect,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { authConfig, type AuthConfig } from "../auth/auth.config.js";
import { AuthGuard, CurrentUserId } from "../auth/auth.guard.js";
import { SessionService } from "../auth/session.service.js";
import { UsersRepository } from "../auth/users.repository.js";
import { ExtensionApiService } from "./extension-api.service.js";

// Routes the VS Code extension calls, at the domain root (not under /api).
// main.ts lists them in the global prefix's exclude list.
@Controller()
export class ExtensionApiController {
  constructor(
    private readonly api: ExtensionApiService,
    private readonly sessions: SessionService,
    private readonly users: UsersRepository,
    @Inject(authConfig.KEY) private readonly config: AuthConfig,
  ) {}

  // The extension opens this in the browser; the sign-in page lives on the website.
  @Get("auth")
  @Redirect()
  auth(@Query() query: Record<string, string>) {
    return {
      url: `${this.config.frontendUrl}/auth?${new URLSearchParams(query)}`,
    };
  }

  @Post("auth/revoke")
  @HttpCode(HttpStatus.NO_CONTENT)
  async revoke(@Headers("authorization") authorization?: string) {
    const token = authorization?.match(/^Bearer (.+)$/)?.[1];
    if (!token) throw new UnauthorizedException();
    const userId = await this.sessions.resolve(token);
    await this.sessions.revoke(token);
    if (userId && !(await this.sessions.hasActiveSession(userId))) {
      await this.users.setLoggedIn(userId, false);
    }
  }

  @Get("account")
  @UseGuards(AuthGuard)
  account(@CurrentUserId() userId: string) {
    return this.api.account(userId);
  }

  @Get("v1/models")
  @UseGuards(AuthGuard)
  models(@CurrentUserId() userId: string) {
    return this.api.models(userId);
  }
}
