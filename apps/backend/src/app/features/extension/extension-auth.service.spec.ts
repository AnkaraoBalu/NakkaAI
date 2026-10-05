import { BadRequestException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { ExtensionAuthService } from "./extension-auth.service.js";
import type { AuthStatesRepository } from "./auth-states.repository.js";
import type { SessionService } from "../auth/session.service.js";
import type { UsersRepository } from "../auth/users.repository.js";
import type { AuthConfig } from "../auth/auth.config.js";

function setup(storedRedirect: string | null = null) {
  const states = {
    deleteStale: vi.fn(async () => {}),
    save: vi.fn(async (state: string, redirectUri: string) => ({
      state, redirectUri, createdAt: new Date(), usedAt: null,
    })),
    consume: vi.fn(async () => storedRedirect),
  };
  const sessions = { create: vi.fn(async () => ({ token: "tok123" })) };
  const users = { setLoggedIn: vi.fn(async () => {}) };
  const service = new ExtensionAuthService(
    states as unknown as AuthStatesRepository,
    sessions as unknown as SessionService,
    users as unknown as UsersRepository,
    { authStateTtlMs: 600_000, extensionRedirectPrefix: "vscode://Nakka.nakka/" } as AuthConfig,
  );
  return { service, states };
}

describe("extension sign-in redirect check", () => {
  it.each([
    "vscode://nakka.nakka/auth?windowId=9",
    "vscode://Nakka.nakka/auth",
    "VSCODE://NAKKA.NAKKA/auth",
  ])("accepts %s, ignoring case", async (redirect) => {
    const { service, states } = setup();
    await expect(service.start("s1", redirect)).resolves.toBeUndefined();
    expect(states.save).toHaveBeenCalledWith("s1", redirect);
  });

  it.each([
    "vscode://other.ext/auth",
    "vscode://nakka.nakka.evil/auth",
    "https://evil.com/vscode://nakka.nakka/",
    "",
  ])("rejects %j", async (redirect) => {
    const { service, states } = setup();
    await expect(service.start("s1", redirect)).rejects.toThrow(BadRequestException);
    expect(states.save).not.toHaveBeenCalled();
  });

  it("keeps the extension's query and adds state and token", async () => {
    const { service } = setup("vscode://nakka.nakka/auth?windowId=9");
    const { redirectUrl } = await service.complete("u1", "s1");
    const url = new URL(redirectUrl);
    expect(redirectUrl.startsWith("vscode://nakka.nakka/auth?")).toBe(true);
    expect(url.searchParams.get("windowId")).toBe("9");
    expect(url.searchParams.get("state")).toBe("s1");
    expect(url.searchParams.get("token")).toBe("tok123");
  });
});
