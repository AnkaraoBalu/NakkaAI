import {
  Global,
  Inject,
  Logger,
  Module,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from "@nestjs/common";
import pg from "pg";
import { DATABASE } from "./constants.js";

// Connects with the standard PG* environment variables from .env
// (PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE).
@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      useFactory: () =>
        new pg.Pool({
          max: 10,
          enableChannelBinding: process.env.PGCHANNELBINDING === "require",
          // Opening a connection to a hosted database costs seconds (TLS, auth,
          // waking the server); a query on an open one costs milliseconds. Keep
          // idle connections for 5 minutes instead of the default 10 seconds.
          idleTimeoutMillis: 5 * 60 * 1000,
          keepAlive: true,
        }),
    },
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
