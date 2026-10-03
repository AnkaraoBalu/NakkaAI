import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { appConfig } from "./common/config/app.config.js";
import { DatabaseModule } from "./common/database/database.module.js";
import { AuthModule } from "./features/auth/auth.module.js";
import { AccountModule } from "./features/account/account.module.js";
import { ExtensionModule } from "./features/extension/extension.module.js";
import { ProxyModule } from "./features/proxy/proxy.module.js";
import { MailModule } from "./mail/mail.module.js";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    DatabaseModule,
    MailModule,
    AuthModule,
    AccountModule,
    ExtensionModule,
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
