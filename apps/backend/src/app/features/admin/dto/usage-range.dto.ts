import { IsOptional, Matches } from "class-validator";

const DAY = /^\d{4}-\d{2}-\d{2}$/;

// Inclusive UTC days; defaults to the last 30 days.
export class UsageRangeDto {
  @IsOptional()
  @Matches(DAY, { message: "from must be YYYY-MM-DD" })
  from?: string;

  @IsOptional()
  @Matches(DAY, { message: "to must be YYYY-MM-DD" })
  to?: string;
}
