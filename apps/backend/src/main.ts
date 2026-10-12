import "reflect-metadata";
import { Logger, RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { json, type Request } from "express";
import { AppModule } from "./app/app.module.js";
import type { AppConfig } from "./app/common/config/app.config.js";
import { checkProductionEnv } from "./app/common/config/production-env.js";
import { createValidationPipe } from "./app/common/pipes/validation.pipe.js";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const { missing, warnings } = checkProductionEnv();
  for (const warning of warnings) logger.warn(warning);
  if (missing.length) {
    throw new Error(`Missing production settings: ${missing.join(", ")}`);
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  // AI requests can carry files, images and PDFs, and the proxy forwards their
  // bytes exactly as received (rawBody). Every other route takes small bodies,
  // so a flood of large ones can't exhaust memory before auth runs.
  const keepRaw = (req: Request & { rawBody?: Buffer }, _res: unknown, buf: Buffer) => {
    req.rawBody = buf;
  };
  app.use("/v1", json({ limit: "25mb", verify: keepRaw }));
  app.use("/api/billing/webhook", json({ limit: "100kb", verify: keepRaw }));
  app.use(json({ limit: "100kb" }));
  const config = app.get(ConfigService).getOrThrow<AppConfig>("app");

  app.disable("x-powered-by");
  // Behind a load balancer, the client's address comes from X-Forwarded-For.
  // Set TRUST_PROXY to the number of proxies in front (e.g. 1); rate limits and
  // the admin lockout key on that address.
  if (config.trustProxy !== false) app.set("trust proxy", config.trustProxy);
  // The website uses /api/*. The VS Code extension's URLs are fixed at the root.
  app.setGlobalPrefix("api", {
    exclude: [
      { path: "auth", method: RequestMethod.GET },
      { path: "auth/revoke", method: RequestMethod.POST },
      { path: "account", method: RequestMethod.GET },
      { path: "v1/models", method: RequestMethod.GET },
      { path: "v1/messages", method: RequestMethod.POST },
      { path: "v1/chat/completions", method: RequestMethod.POST },
    ],
  });
  app.useGlobalPipes(createValidationPipe());
  // Bearer tokens, not cookies: no credentials needed cross-origin.
  app.enableCors({ origin: config.corsOrigins });
  app.enableShutdownHooks();

  await app.listen(config.port);
  logger.log(`backend listening on port ${config.port}`);
}

void bootstrap();
