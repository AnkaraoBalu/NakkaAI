import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import type { Provider } from "../provider-keys/provider-keys.config.js";
import { AdminKeysService } from "./admin-keys.service.js";
import { AdminGuard, CurrentAdminId } from "./admin.guard.js";
import { ProviderPipe } from "./dto/provider.pipe.js";
import { SetProviderKeyDto } from "./dto/set-provider-key.dto.js";

@Controller("admin/provider-keys")
@UseGuards(AdminGuard)
export class AdminKeysController {
  constructor(private readonly keys: AdminKeysService) {}

  @Get()
  list() {
    return this.keys.list();
  }

  @Put(":provider")
  set(
    @Param("provider", ProviderPipe) provider: Provider,
    @Body() dto: SetProviderKeyDto,
    @CurrentAdminId() adminId: string,
  ) {
    return this.keys.set(provider, dto.key, adminId);
  }

  @Delete(":provider")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param("provider", ProviderPipe) provider: Provider,
    @CurrentAdminId() adminId: string,
  ) {
    await this.keys.remove(provider, adminId);
  }

  @Post(":provider/test")
  @HttpCode(HttpStatus.OK)
  test(
    @Param("provider", ProviderPipe) provider: Provider,
    @CurrentAdminId() adminId: string,
  ) {
    return this.keys.test(provider, adminId);
  }
}
