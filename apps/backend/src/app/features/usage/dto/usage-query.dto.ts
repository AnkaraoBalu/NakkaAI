import { Type } from "class-transformer";
import { IsIn, IsOptional } from "class-validator";

export const USAGE_DAYS = [7, 30, 90] as const;

export class UsageQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsIn(USAGE_DAYS, { message: "days must be 7, 30 or 90" })
  days: (typeof USAGE_DAYS)[number] = 30;
}
