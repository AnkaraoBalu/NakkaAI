import {
  Global,
  Inject,
  Logger,
  Module,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from "@nestjs/common";
import pg from "pg";
import { CleanupService } from "./cleanup.service.js";
import { DATABASE } from "./constants.js";

const poolMax = Number(process.env.PG_POOL_MAX ?? 20);

// Connects with the standard PG* environment variables from .env
// (PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE).
@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      useFactory: () => {
        const pool = new pg.Pool({
          max: Number.isSafeInteger(poolMax) && poolMax > 0 ? poolMax : 20,
          enableChannelBinding: process.env.PGCHANNELBINDING === "require",
          // Opening a connection to a hosted database costs seconds (TLS, auth,
          // waking the server); a query on an open one costs milliseconds. Keep
          // idle connections for 5 minutes instead of the default 10 seconds.
          idleTimeoutMillis: 5 * 60 * 1000,
          keepAlive: true,
          // Fail fast instead of queueing forever when the pool is exhausted
          // or the database is unreachable, and never let one query hang.
          // (Neon's pooler ignores statement_timeout; query_timeout is enforced
          // here in the client either way.)
          connectionTimeoutMillis: 5_000,
          statement_timeout: 15_000,
          query_timeout: 20_000,
        });
        // A dropped idle connection (Neon scaling to zero, a pooler restart)
        // is reported here; without a listener it would crash the process.
        pool.on("error", (error) =>
          new Logger("Database").error(`Idle connection lost: ${error.message}`),
        );
        return pool;
      },
    },
    CleanupService,
  ],
  exports: [DATABASE],
})
export class DatabaseModule
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(@Inject(DATABASE) private readonly pool: pg.Pool) {}

  // Open a few connections at startup so early requests (and an AI request
  // arriving while the previous one's usage is being saved) don't wait for one.
  async onApplicationBootstrap() {
    try {
      await Promise.all([1, 2, 3].map(() => this.pool.query("SELECT 1")));
    } catch (error) {
      this.logger.error(`Database not reachable: ${(error as Error).message}`);
    }
  }

  async onApplicationShutdown() {
    await this.pool.end();
  }
}
