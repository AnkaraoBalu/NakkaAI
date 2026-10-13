import { IsIn, IsOptional } from "class-validator";
import { ListUsersDto } from "./list-users.dto.js";

export const PAYMENT_STATUSES = ["paid", "failed", "pending"] as const;

// Search matches the payer's email or name, or a Razorpay order/payment id.
export class ListPaymentsDto extends ListUsersDto {
  @IsOptional()
  @IsIn(["", ...PAYMENT_STATUSES])
  status: "" | (typeof PAYMENT_STATUSES)[number] = "";
}
