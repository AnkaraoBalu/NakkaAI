import {
  createHash,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import type {
  SendSignupOtpResponse,
  VerifySignupOtpResponse,
} from "@nakka/types/users";
import { MailService } from "../../mail/mail.service.js";
import { otpEmail } from "../../mail/templates/otp.template.js";
import { authConfig, type AuthConfig } from "./auth.config.js";
import { EmailVerificationRepository } from "./email-verification.repository.js";

const sha256 = (value: string) =>
  createHash("sha256").update(value).digest("hex");
// Salted with the email so equal codes for different people hash differently.
const hashCode = (email: string, code: string) => sha256(`${email}:${code}`);

const sameHash = (a: string, b: string) =>
  a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

const tooMany = (message: string) =>
  new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);

// Emails a 6-digit code before sign-up and confirms it.
@Injectable()
export class OtpService {
  constructor(
    private readonly verifications: EmailVerificationRepository,
    private readonly mail: MailService,
    @Inject(authConfig.KEY) private readonly config: AuthConfig,
  ) {}

  async send(email: string, firstName: string): Promise<SendSignupOtpResponse> {
    const existing = await this.verifications.find(email);
    if (existing) {
      const waitMs =
        existing.lastSentAt.getTime() +
        this.config.otpResendCooldownMs -
        Date.now();
      if (waitMs > 0) {
        throw tooMany(
          `Please wait ${Math.ceil(waitMs / 1000)} seconds before requesting another code.`,
        );
      }
    }

    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
    const expiresAt = new Date(Date.now() + this.config.otpTtlMs);
    await this.verifications.upsertCode(
      email,
      hashCode(email, code),
      expiresAt,
    );
    await this.mail.send(
      otpEmail(
        email,
        firstName,
        code,
        Math.round(this.config.otpTtlMs / 60000),
      ),
    );

    return {
      email,
      expiresAt: expiresAt.toISOString(),
      resendAvailableAt: new Date(
        Date.now() + this.config.otpResendCooldownMs,
      ).toISOString(),
    };
  }

  async verify(email: string, code: string): Promise<VerifySignupOtpResponse> {
    const record = await this.verifications.find(email);
    if (!record) {
      throw new BadRequestException("Request a verification code first.");
    }
    if (record.attempts >= this.config.otpMaxAttempts) {
      throw tooMany("Too many incorrect attempts. Request a new code.");
    }
    if (record.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException(
        "This code has expired. Request a new one.",
      );
    }
    if (!sameHash(hashCode(email, code), record.codeHash)) {
      await this.verifications.recordFailedAttempt(email);
      const left = this.config.otpMaxAttempts - record.attempts - 1;
      throw left > 0
        ? new BadRequestException(
            `That code isn't right. ${left} ${left === 1 ? "attempt" : "attempts"} left.`,
          )
        : tooMany("Too many incorrect attempts. Request a new code.");
    }

    const verificationToken = randomBytes(32).toString("base64url");
    const tokenExpiresAt = new Date(
      Date.now() + this.config.verificationTokenTtlMs,
    );
    await this.verifications.markVerified(
      email,
      sha256(verificationToken),
      tokenExpiresAt,
    );
    return { verificationToken, expiresAt: tokenExpiresAt.toISOString() };
  }

  // Throws unless `token` proves this email was verified recently.
  async assertVerified(email: string, token: string): Promise<void> {
    const record = await this.verifications.find(email);
    const valid =
      record?.verifiedAt &&
      record.verificationTokenHash &&
      record.tokenExpiresAt &&
      record.tokenExpiresAt.getTime() > Date.now() &&
      sameHash(sha256(token), record.verificationTokenHash);
    if (!valid) {
      throw new BadRequestException(
        "Please verify your email before creating your account. If you already did, the code may have expired.",
      );
    }
  }

  complete(email: string) {
    return this.verifications.delete(email);
  }
}
