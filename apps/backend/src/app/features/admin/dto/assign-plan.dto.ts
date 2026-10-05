import type { AssignPlanRequest } from "@nakka/types/admin";
import { IsISO8601, IsOptional, Matches } from "class-validator";

export class AssignPlanDto implements AssignPlanRequest {
  @Matches(/^[a-z0-9_-]{1,40}$/, { message: "Unknown plan." })
  planId: string;

  @IsOptional()
  @IsISO8601({ strict: true }, { message: "endsAt must be a date." })
  endsAt?: string | null;
}
