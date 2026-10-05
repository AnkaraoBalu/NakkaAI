import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { OtpService } from "./otp.service.js";
import type { EmailVerificationRepository } from "./email-verification.repository.js";
import type { MailService } from "../../mail/mail.service.js";
import type { AuthConfig } from "./auth.config.js";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

function setup() {
  const email = "new@example.com";
  const record = {
    email, codeHash: hash(`${email}:123456`), attempts: 0,
    expiresAt: new Date(Date.now() + 600_000),
    lastSentAt: new Date(Date.now() - 61_000),
    verifiedAt: null as Date | null,
    verificationTokenHash: null as string | null,
    tokenExpiresAt: null as Date | null,
  };
  const repository = {
    find: vi.fn(async () => record),
    upsertCode: vi.fn(), recordFailedAttempt: vi.fn(), delete: vi.fn(),
    markVerified: vi.fn(async (_email: string, tokenHash: string, expiresAt: Date) => {
      record.verifiedAt = new Date();
      record.verificationTokenHash = tokenHash;
      record.tokenExpiresAt = expiresAt;
    }),
  };
  const mail = { send: vi.fn(async (_message: { text: string }) => {}) };
  const service = new OtpService(
    repository as unknown as EmailVerificationRepository,
    mail as unknown as MailService,
    { otpTtlMs: 600_000, otpResendCooldownMs: 60_000,
      otpMaxAttempts: 5, verificationTokenTtlMs: 1_800_000 } as AuthConfig,
  );
  return { service, repository, mail, record, email };
}

describe("signup OTP", () => {
  it("sends a six-digit code and stores its hash", async () => {
    const { service, repository, mail, email } = setup();
    const response = await service.send(email, "New");
    const message = mail.send.mock.calls[0]![0];
    const code = message.text.match(/\b\d{6}\b/)?.[0];
    expect(code).toBeDefined();
    expect(repository.upsertCode).toHaveBeenCalledWith(email, hash(`${email}:${code}`), expect.any(Date));
    expect(response.email).toBe(email);
  });

  it("only authorizes registration with the verified token and email", async () => {
    const { service, email } = setup();
    await expect(service.assertVerified(email, "unverified")).rejects.toThrow(/verify/);
    const { verificationToken } = await service.verify(email, "123456");
    await expect(service.assertVerified(email, verificationToken)).resolves.toBeUndefined();
    await expect(service.assertVerified(email, "wrong-token")).rejects.toThrow(/verify/);
  });

  it("rejects incorrect and expired codes", async () => {
    const { service, repository, record, email } = setup();
    await expect(service.verify(email, "000000")).rejects.toThrow(/isn't right/);
    expect(repository.recordFailedAttempt).toHaveBeenCalledWith(email);
    record.expiresAt = new Date(0);
    await expect(service.verify(email, "123456")).rejects.toThrow(/expired/);
  });

  it("does not report success when email delivery fails", async () => {
    const { service, mail, email } = setup();
    mail.send.mockRejectedValueOnce(new Error("SMTP unavailable"));
    await expect(service.send(email, "New")).rejects.toThrow("SMTP unavailable");
  });
});
