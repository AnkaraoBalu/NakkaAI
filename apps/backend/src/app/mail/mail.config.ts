import { registerAs } from "@nestjs/config";

export interface MailConfig {
  host?: string;
  port: number;
  user?: string;
  pass?: string;
  from: string;
}

export const mailConfig = registerAs("mail", (): MailConfig => ({
  host: process.env.SMTP_HOST || undefined,
  port: Number(process.env.SMTP_PORT ?? 587),
  user: process.env.SMTP_USER || undefined,
  pass: process.env.SMTP_PASS || undefined,
  // Providers like Gmail only send as the signed-in account, so default to it.
  from:
    process.env.MAIL_FROM ||
    (process.env.SMTP_USER
      ? `Nakka <${process.env.SMTP_USER}>`
      : "Nakka <no-reply@example.com>"),
}));
