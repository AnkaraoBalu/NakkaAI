import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { authConfig } from "../auth/auth.config.js";
import { proxyConfig } from "../proxy/proxy.config.js";
import { AuthModule } from "../auth/auth.module.js";
import { PlansModule } from "../plans/plans.module.js";
import { AuthStatesRepository } from "./auth-states.repository.js";
import { ExtensionApiController } from "./extension-api.controller.js";
import { ExtensionApiService } from "./extension-api.service.js";
import { ExtensionAuthController } from "./extension-auth.controller.js";
import { ExtensionAuthService } from "./extension-auth.service.js";

// Everything the VS Code extension talks to.
@Module({
  imports: [
    AuthModule,
    PlansModule,
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(proxyConfig),
  ],
  controllers: [ExtensionApiController, ExtensionAuthController],
  providers: [
    AuthStatesRepository,
    ExtensionAuthService,
    ExtensionApiService,
  ],
})
export class ExtensionModule {}
