import { BadRequestException, Injectable, type PipeTransform } from "@nestjs/common";
import { PROVIDERS, type Provider } from "../../provider-keys/provider-keys.config.js";

// Validates the :provider route parameter.
@Injectable()
export class ProviderPipe implements PipeTransform<string, Provider> {
  transform(value: string): Provider {
    if (!(PROVIDERS as readonly string[]).includes(value)) {
      throw new BadRequestException(`Unknown provider "${value}".`);
    }
    return value as Provider;
  }
}
