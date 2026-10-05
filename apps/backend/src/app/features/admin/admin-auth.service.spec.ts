import { UnauthorizedException, type ExecutionContext } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { hashPassword } from "../auth/password-hash.js";
import { hashToken } from "../auth/session.service.js";
import { AdminAuthService } from "./admin-auth.service.js";
import { AdminGuard } from "./admin.guard.js";
import type { AdminConfig } from "./admin.config.js";
import type { AdminsRepository } from "./admins.repository.js";
import type { AuditLogRepository } from "./audit-log.repository.js";

async function setup() {
  const admin = {
    id: "a1", name: "Admin", email: "admin@nakka.in",
    passwordHash: await hashPassword("correct-horse-battery"),
  };
  const tokens = new Map<string, string>();
  const admins = {
    findByEmail: vi.fn(async (email: string) =>
      email.toLowerCase() === admin.email ? admin : null),
    findById: vi.fn(async () => admin),
    markLoggedIn: vi.fn(),
    createToken: vi.fn(async (id: string, hash: string) => void tokens.set(hash, id)),
    resolveToken: vi.fn(async (hash: string) => tokens.get(hash) ?? null),
    revokeToken: vi.fn(async (hash: string) => void tokens.delete(hash)),
    exists: vi.fn(async () => true),
    createFirst: vi.fn(async (data: { name: string; email: string }) => ({ id: "a2", ...data })),
    passwordHash: vi.fn(async () => admin.passwordHash),
    setPassword: vi.fn(),
  };
  const audit = { record: vi.fn() };
  const service = new AdminAuthService(
    admins as unknown as AdminsRepository,
    audit as unknown as AuditLogRepository,
    { sessionTtlMs: 3_600_000, maxLoginAttempts: 3, loginLockMs: 60_000 } as AdminConfig,
  );
  const guard = new AdminGuard(admins as unknown as AdminsRepository);
  return { service, guard, admins, audit };
}

const contextFor = (authorization?: string) => {
  const request = { headers: { authorization } } as Record<string, unknown>;
  return {
    request,
    context: { switchToHttp: () => ({ getRequest: () => request }) } as unknown as ExecutionContext,
  };
};

describe("admin sign-in", () => {
  it("issues a token that only the hash of is stored, and audits the sign-in", async () => {
    const { service, admins, audit } = await setup();
    const result = await service.login({ email: "Admin@Nakka.in", password: "correct-horse-battery" }, "1.2.3.4");
    expect(result.admin).toEqual({ id: "a1", name: "Admin", email: "admin@nakka.in" });
    expect(admins.createToken).toHaveBeenCalledWith("a1", hashToken(result.token), expect.any(Date));
    expect(audit.record).toHaveBeenCalledWith("a1", "admin.login", null, { ip: "1.2.3.4" });
  });

  it("gives the same answer for an unknown email and a wrong password", async () => {
    const { service } = await setup();
    await expect(
      service.login({ email: "x@y.z", password: "whatever" }, "ip"),
    ).rejects.toThrow("Email or password is incorrect.");
    await expect(
      service.login({ email: "admin@nakka.in", password: "wrong" }, "ip"),
    ).rejects.toThrow("Email or password is incorrect.");
  });

  it("pauses an email + address after too many failures, even with the right password", async () => {
    const { service } = await setup();
    for (let i = 0; i < 3; i++) {
      await expect(service.login({ email: "admin@nakka.in", password: "nope" }, "ip")).rejects.toBeInstanceOf(UnauthorizedException);
    }
    await expect(
      service.login({ email: "admin@nakka.in", password: "correct-horse-battery" }, "ip"),
    ).rejects.toThrow(/Too many/);
    // Another address isn't locked out.
    await expect(
      service.login({ email: "admin@nakka.in", password: "correct-horse-battery" }, "other-ip"),
    ).resolves.toBeDefined();
  });
});

describe("admin guard", () => {
  it("lets a live admin token through and rejects anything else", async () => {
    const { service, guard } = await setup();
    const { token } = await service.login({ email: "admin@nakka.in", password: "correct-horse-battery" }, "ip");

    const ok = contextFor(`Bearer ${token}`);
    await expect(guard.canActivate(ok.context)).resolves.toBe(true);
    expect(ok.request.adminId).toBe("a1");

    await expect(guard.canActivate(contextFor("Bearer user-token").context)).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(guard.canActivate(contextFor().context)).rejects.toBeInstanceOf(UnauthorizedException);

    await service.logout(token);
    await expect(guard.canActivate(contextFor(`Bearer ${token}`).context)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

describe("admin signup and password", () => {
  it("opens signup only while no admin exists", async () => {
    const { service, admins } = await setup();
    expect(await service.setupStatus()).toEqual({ setupNeeded: false });
    admins.exists.mockResolvedValueOnce(false);
    expect(await service.setupStatus()).toEqual({ setupNeeded: true });
  });

  it("creates the first admin with a hashed password and signs them in", async () => {
    const { service, admins, audit } = await setup();
    const result = await service.setup(
      { name: "First", email: "first@nakka.in", password: "a-long-password-1" }, "ip");
    expect(result.admin).toMatchObject({ id: "a2", email: "first@nakka.in" });
    expect(result.token).toBeTruthy();
    const saved = admins.createFirst.mock.calls[0]![0] as unknown as { passwordHash: string };
    expect(saved.passwordHash).toMatch(/^scrypt\$/);
    expect(audit.record).toHaveBeenCalledWith("a2", "admin.setup", null, { ip: "ip" });
  });

  it("refuses signup once an admin exists, and weak passwords", async () => {
    const { service, admins } = await setup();
    admins.createFirst.mockResolvedValueOnce(null as never);
    await expect(service.setup(
      { name: "Late", email: "late@nakka.in", password: "a-long-password-1" }, "ip"),
    ).rejects.toThrow(/already exists/);
    await expect(service.setup(
      { name: "Weak", email: "weak@nakka.in", password: "short1" }, "ip"),
    ).rejects.toThrow(/at least 12/);
    await expect(service.setup(
      { name: "Weak", email: "weak@nakka.in", password: "no-digits-at-all" }, "ip"),
    ).rejects.toThrow(/letter and a number/);
  });

  it("changes the password only with the current one, keeping this session", async () => {
    const { service, admins } = await setup();
    await expect(service.changePassword("a1", "tok", {
      currentPassword: "wrong", newPassword: "another-password-2" }),
    ).rejects.toThrow(/current password/);
    await expect(service.changePassword("a1", "tok", {
      currentPassword: "correct-horse-battery", newPassword: "short1" }),
    ).rejects.toThrow(/at least 12/);
    await service.changePassword("a1", "tok", {
      currentPassword: "correct-horse-battery", newPassword: "another-password-2" });
    expect(admins.setPassword).toHaveBeenCalledWith("a1", expect.stringMatching(/^scrypt\$/), hashToken("tok"));
  });
});
