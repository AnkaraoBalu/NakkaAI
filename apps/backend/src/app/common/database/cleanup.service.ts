import {
  Inject,
  Injectable,
  Logger,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from "@nestjs/common";
import type pg from "pg";
import { DATABASE, TABLES } from "./constants.js";

const HOUR = 60 * 60 * 1000;

// Rows that are never useful again, deleted hourly so tables don't grow
// forever. Safe to run on several servers at once.
const CLEANUP = [
  // Sessions ended (revoked or expired) more than 30 days ago.
  `DELETE FROM ${TABLES.AUTH_TOKENS}
   WHERE revoked_at < now() - interval '30 days' OR expires_at < now() - interval '30 days'`,
  `DELETE FROM ${TABLES.ADMIN_TOKENS}
   WHERE revoked_at < now() - interval '30 days' OR expires_at < now() - interval '30 days'`,
  // Sign-up codes and their follow-up tokens, a day after they lapsed.
  `DELETE FROM ${TABLES.EMAIL_VERIFICATIONS}
   WHERE expires_at < now() - interval '1 day'
     AND (token_expires_at IS NULL OR token_expires_at < now() - interval '1 day')`,
  // VS Code sign-in attempts are only valid for minutes.
  `DELETE FROM ${TABLES.AUTH_STATES} WHERE created_at < now() - interval '1 day'`,
];

@Injectable()
export class CleanupService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(CleanupService.name);
  private timer?: NodeJS.Timeout;

  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  onApplicationBootstrap() {
    this.timer = setInterval(() => void this.run(), HOUR);
    this.timer.unref();
  }

  onApplicationShutdown() {
    clearInterval(this.timer);
  }

  async run() {
    for (const sql of CLEANUP) {
      try {
        await this.db.query(sql);
      } catch (error) {
        this.logger.warn(`Cleanup failed: ${(error as Error).message}`);
      }
    }
  }
}
