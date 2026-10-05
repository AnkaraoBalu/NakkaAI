import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { ExtensionAuthCompleteResponse } from "@nakka/types/extension";
import { authConfig, type AuthConfig } from "../auth/auth.config.js";
import { SessionService } from "../auth/session.service.js";
import { UsersRepository } from "../auth/users.repository.js";
import { AuthStatesRepository } from "./auth-states.repository.js";

const EXPIRED =
  "This sign-in link has expired or was already used. Start signing in again from VS Code.";

// The browser half of "Sign in" in the VS Code extension.
@Injectable()
export class ExtensionAuthService {
  constructor(
    private readonly states: AuthStatesRepository,
    private readonly sessions: SessionService,
    private readonly users: UsersRepository,
    @Inject(authConfig.KEY) private readonly config: AuthConfig,
  ) {}

  // Only ever hand a token to the extension itself.
  private assertRedirect(redirect: string) {
    if (
      !redirect
        .toLowerCase()
        .startsWith(this.config.extensionRedirectPrefix.toLowerCase())
    ) {
      throw new BadRequestException(
        "This sign-in link isn't from the Nakka extension.",
      );
    }
  }

  // The /auth page opened: record the attempt.
  async start(state: string, redirect: string): Promise<void> {
    this.assertRedirect(redirect);
    await this.states.deleteStale();
    const saved = await this.states.save(state, redirect);
    const expired =
      saved.usedAt !== null ||
      Date.now() - saved.createdAt.getTime() > this.config.authStateTtlMs;
    if (saved.redirectUri !== redirect || expired) {
      throw new BadRequestException(EXPIRED);
    }
  }

  // The signed-in user confirmed: issue an extension token and build the return URL.
  async complete(
    userId: string,
    state: string,
  ): Promise<ExtensionAuthCompleteResponse> {
    const redirect = await this.states.consume(
      state,
      this.config.authStateTtlMs,
    );
    if (!redirect) throw new BadRequestException(EXPIRED);
    this.assertRedirect(redirect);

    const { token } = await this.sessions.create(userId, "extension");
    await this.users.setLoggedIn(userId, true);

    const url = new URL(redirect);
    url.searchParams.set("state", state);
    url.searchParams.set("token", token);
    return { redirectUrl: url.toString() };
  }
}
