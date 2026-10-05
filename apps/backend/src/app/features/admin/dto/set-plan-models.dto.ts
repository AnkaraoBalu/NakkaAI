import type { PlanModel, Provider } from "@nakka/types/plans";
import type { SetPlanModelsRequest } from "@nakka/types/admin";
import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  Matches,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import { PROVIDERS } from "../../provider-keys/provider-keys.config.js";

const MODEL_NAME = /^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,99}$/;
const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

export class PlanModelDto implements PlanModel {
  @Transform(trim)
  @Matches(MODEL_NAME, { message: "Model id may use letters, digits and . _ : / @ -" })
  modelId: string;

  @IsIn(PROVIDERS)
  provider: Provider;

  @Transform(trim)
  @Matches(MODEL_NAME, { message: "Provider model name may use letters, digits and . _ : / @ -" })
  upstreamModel: string;

  // US dollars per million tokens. Input and output are required: allowances
  // are measured in cost, so a model must never be free by accident.
  @IsNumber({ maxDecimalPlaces: 4 }, { message: "Prices are dollars per million tokens." })
  @Min(0.0001, { message: "Set the model's input price." })
  @Max(10_000)
  inputPrice: number;

  @IsNumber({ maxDecimalPlaces: 4 }, { message: "Prices are dollars per million tokens." })
  @Min(0.0001, { message: "Set the model's output price." })
  @Max(10_000)
  outputPrice: number;

  // Null: charged at the input price.
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(10_000)
  cacheReadPrice: number | null = null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(10_000)
  cacheWritePrice: number | null = null;
}

export class SetPlanModelsDto implements SetPlanModelsRequest {
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => PlanModelDto)
  models: PlanModelDto[];
}
