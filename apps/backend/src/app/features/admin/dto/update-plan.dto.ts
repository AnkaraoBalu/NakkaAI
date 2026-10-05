import type { PlanPricing, PlanWindow } from "@nakka/types/plans";
import type { UpdatePlanRequest } from "@nakka/types/admin";
import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from "class-validator";

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

export class PlanWindowDto implements PlanWindow {
  @Matches(/^[a-z0-9_-]{1,20}$/, {
    message: "Window id may use a-z, 0-9, - and _ (up to 20).",
  })
  id: string;

  @Transform(trim)
  @IsString()
  @Length(1, 30)
  label: string;

  // Micro-dollars of provider cost per window ($0.01 to $100,000).
  @IsInt()
  @Min(10_000, { message: "A window allows at least $0.01." })
  @Max(100_000_000_000)
  limit: number;

  // null: never resets (a one-time credit).
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @Min(1)
  @Max(24 * 366)
  duration_hours: number | null;

  // Counts only the plan's premium models.
  @IsOptional()
  @IsBoolean()
  premium_only?: boolean;
}

export class PlanPricingDto implements PlanPricing {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(1_000_000)
  monthlyPriceInr: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(90)
  marginPercent: number;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(1)
  @Max(1000)
  inrPerUsd: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(34)
  sessionsPerWeek: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  premiumSharePercent: number;
}

export class UpdatePlanDto implements UpdatePlanRequest {
  @Transform(trim)
  @IsString()
  @Length(1, 40)
  name: string;

  @IsArray()
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => PlanWindowDto)
  windows: PlanWindowDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PlanPricingDto)
  pricing?: PlanPricingDto | null;
}
