import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { providerKeysConfig } from "./provider-keys.config.js";
import { ProviderKeysRepository } from "./provider-keys.repository.js";
import { ProviderKeysService } from "./provider-keys.service.js";

// Our API keys for the AI companies. The proxy reads them; the admin page sets them.
@Module({
  imports: [ConfigModule.forFeature(providerKeysConfig)],
  providers: [ProviderKeysRepository, ProviderKeysService],
  exports: [ProviderKeysService],
})
export class ProviderKeysModule {}
