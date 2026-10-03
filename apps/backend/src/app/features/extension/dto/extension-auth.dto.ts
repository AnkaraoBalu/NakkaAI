import type {
  ExtensionAuthCompleteRequest,
  ExtensionAuthStartRequest,
} from "@nakka/types/extension";
import { IsString, Matches, MaxLength } from "class-validator";

// The extension sends 64 hex characters.
const STATE = /^[0-9a-fA-F]{64}$/;

export class StartExtensionAuthDto implements ExtensionAuthStartRequest {
  @Matches(STATE, { message: "state must be 64 hex characters" })
  state: string;

  @IsString()
  @MaxLength(512)
  redirect: string;
}

export class CompleteExtensionAuthDto implements ExtensionAuthCompleteRequest {
  @Matches(STATE, { message: "state must be 64 hex characters" })
  state: string;
}
