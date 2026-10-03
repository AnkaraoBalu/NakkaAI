import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module.js";
import { proxyConfig } from "./proxy.config.js";
import { ProxyController } from "./proxy.controller.js";
import { ProxyRepository } from "./proxy.repository.js";
import { ProxyService } from "./proxy.service.js";
import { UsageRepository } from "./usage.repository.js";

@Module({
  imports: [AuthModule, ConfigModule.forFeature(proxyConfig)],
  controllers: [ProxyController],
  providers: [ProxyService, ProxyRepository, UsageRepository],
})
export class ProxyModule {}
