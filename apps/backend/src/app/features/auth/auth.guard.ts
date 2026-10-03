import {
  createParamDecorator,
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import type { Request } from "express";
import { SessionService } from "./session.service.js";

type AuthedRequest = Request & { userId?: string; sessionToken?: string };

// Requires `Authorization: Bearer <token>` for a live Nakka session.
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessions: SessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const token = request.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
    const userId = token ? await this.sessions.resolve(token) : null;
    if (!token || !userId) {
      throw new UnauthorizedException(
        "Your session has expired. Please log in again.",
      );
    }
    request.userId = userId;
    request.sessionToken = token;
    return true;
  }
}

// The signed-in user's ID, set by AuthGuard.
export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string =>
    context.switchToHttp().getRequest<AuthedRequest>().userId!,
);
