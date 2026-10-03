import "reflect-metadata";
import { RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app/app.module.js";
import type { AppConfig } from "./app/common/config/app.config.js";
import { createValidationPipe } from "./app/common/pipes/validation.pipe.js";

async function bootstrap() {
  // rawBody: the AI proxy forwards request bytes exactly as received.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  // AI requests can carry files, images and PDFs.
  app.useBodyParser("json", { limit: "25mb" });
  const config = app.get(ConfigService).getOrThrow<AppConfig>("app");

  app.disable("x-powered-by");
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
  app.enableCors({ origin: config.corsOrigins, credentials: true });
  app.enableShutdownHooks();

  await app.listen(config.port);
  console.log(`backend listening on http://localhost:${config.port}`);
}

void bootstrap();
