import type { User } from "@nakka/types/users";
import type { UserWithPassword } from "../users.repository.js";

export function toPublicUser({
  passwordHash: _,
  clerkUserId: _clerkUserId,
  ...user
}: UserWithPassword): User {
  return user;
}
