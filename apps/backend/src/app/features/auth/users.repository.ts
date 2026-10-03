import { Inject, Injectable } from "@nestjs/common";
import type pg from "pg";
import type { SignedInWith, User } from "@nakka/types/users";
import { DATABASE, TABLES } from "../../common/database/constants.js";

interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password_hash: string | null;
  is_verified: boolean;
  is_logged_in: boolean;
  signed_in_with: SignedInWith;
  workspace: string | null;
  created_at: Date;
}

export interface UserWithPassword extends User {
  // Null for people who only sign in with Google/GitHub.
  passwordHash: string | null;
}

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  passwordHash: string | null;
  isVerified: boolean;
  signedInWith?: SignedInWith;
}

const COLUMNS =
  "id, first_name, last_name, email, username, password_hash, is_verified, is_logged_in, signed_in_with, workspace, created_at";

function toUser(row: UserRow): UserWithPassword {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    username: row.username,
    passwordHash: row.password_hash,
    isVerified: row.is_verified,
    isLoggedIn: row.is_logged_in,
    signedInWith: row.signed_in_with,
    workspace: row.workspace,
    createdAt: row.created_at.toISOString(),
  };
}

@Injectable()
export class UsersRepository {
  constructor(@Inject(DATABASE) private readonly db: pg.Pool) {}

  async findById(id: string): Promise<UserWithPassword | null> {
    const { rows } = await this.db.query<UserRow>(
      `SELECT ${COLUMNS} FROM ${TABLES.USERS} WHERE id = $1`,
      [id],
    );
    return rows[0] ? toUser(rows[0]) : null;
  }

  // Matches either the email or the username, ignoring case.
  async findByIdentifier(identifier: string): Promise<UserWithPassword | null> {
    const { rows } = await this.db.query<UserRow>(
      `SELECT ${COLUMNS} FROM ${TABLES.USERS}
       WHERE lower(email) = lower($1) OR lower(username) = lower($1)
       LIMIT 1`,
      [identifier],
    );
    return rows[0] ? toUser(rows[0]) : null;
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const { rows } = await this.db.query<UserRow>(
      `SELECT ${COLUMNS} FROM ${TABLES.USERS} WHERE lower(email) = lower($1)`,
      [email],
    );
    return rows[0] ? toUser(rows[0]) : null;
  }

  async usernameTaken(username: string): Promise<boolean> {
    const { rowCount } = await this.db.query(
      `SELECT 1 FROM ${TABLES.USERS} WHERE lower(username) = lower($1)`,
      [username],
    );
    return Boolean(rowCount);
  }

  async findConflict(email: string, username: string) {
    const { rows } = await this.db.query<{
      email_taken: boolean;
      username_taken: boolean;
    }>(
      `SELECT
         bool_or(lower(email) = lower($1)) AS email_taken,
         bool_or(lower(username) = lower($2)) AS username_taken
       FROM ${TABLES.USERS}
       WHERE lower(email) = lower($1) OR lower(username) = lower($2)`,
      [email, username],
    );
    return {
      emailTaken: Boolean(rows[0]?.email_taken),
      usernameTaken: Boolean(rows[0]?.username_taken),
    };
  }

  async create(user: NewUser): Promise<UserWithPassword> {
    const { rows } = await this.db.query<UserRow>(
      `INSERT INTO ${TABLES.USERS} (first_name, last_name, email, username, password_hash, is_verified, signed_in_with)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${COLUMNS}`,
      [
        user.firstName,
        user.lastName,
        user.email,
        user.username,
        user.passwordHash,
        user.isVerified,
        user.signedInWith ?? "Nakka",
      ],
    );
    return toUser(rows[0]);
  }

  // The person proved they own the email (OTP or a verified Google/GitHub email).
  async markVerified(id: string): Promise<UserWithPassword> {
    const { rows } = await this.db.query<UserRow>(
      `UPDATE ${TABLES.USERS} SET is_verified = true, updated_at = now()
       WHERE id = $1 RETURNING ${COLUMNS}`,
      [id],
    );
    return toUser(rows[0]);
  }

  async setPassword(id: string, passwordHash: string): Promise<void> {
    await this.db.query(
      `UPDATE ${TABLES.USERS} SET password_hash = $2, updated_at = now() WHERE id = $1`,
      [id, passwordHash],
    );
  }

  async setLoggedIn(id: string, loggedIn: boolean): Promise<void> {
    await this.db.query(
      `UPDATE ${TABLES.USERS}
       SET is_logged_in = $2, updated_at = now()
       WHERE id = $1`,
      [id, loggedIn],
    );
  }
}
