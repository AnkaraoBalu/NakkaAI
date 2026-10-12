import { Inject, Injectable, ServiceUnavailableException } from "@nestjs/common";
import type pg from "pg";
import { DATABASE } from "./common/database/constants.js";

@Injectable()
export class AppService {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  // A load balancer stops sending traffic here when the database is unreachable.
  async health() {
    try {
      await Promise.race([
        this.db.query("SELECT 1"),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 2_000).unref()),
      ]);
      return { status: "ok" };
    } catch {
      throw new ServiceUnavailableException("Database unreachable.");
    }
  }
}
