import type { User } from "@nakka/types/users";
import type { UserWithPassword } from "../users.repository.js";

export function toPublicUser({
  passwordHash: _,
  ...user
}: UserWithPassword): User {
  return user;
}
