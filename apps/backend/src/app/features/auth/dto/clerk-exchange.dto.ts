import type { ClerkExchangeRequest } from "@nakka/types/users";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ClerkExchangeDto implements ClerkExchangeRequest {
  // Clerk session token from the browser, right after Google/GitHub sign-in.
  @IsString()
  @IsNotEmpty()
  @MaxLength(8192)
  token: string;
}
