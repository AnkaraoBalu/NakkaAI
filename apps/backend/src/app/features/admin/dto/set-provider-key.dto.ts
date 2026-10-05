import type { SetProviderKeyRequest } from "@nakka/types/admin";
import { Transform } from "class-transformer";
import { IsString, Length, Matches } from "class-validator";

export class SetProviderKeyDto implements SetProviderKeyRequest {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @IsString()
  @Length(10, 500, { message: "That doesn't look like an API key." })
  @Matches(/^\S+$/, { message: "An API key can't contain spaces." })
  key: string;
}
