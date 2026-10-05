import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { ClerkExchangeDto } from "./dto/clerk-exchange.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { SignupDetailsDto } from "./dto/signup-details.dto.js";
import { SignupDto } from "./dto/signup.dto.js";
import { VerifyOtpDto } from "./dto/verify-otp.dto.js";

function bearerToken(authorization: string | undefined): string {
  const token = authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) throw new UnauthorizedException("Missing bearer token.");
  return token;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup/check")
  @HttpCode(HttpStatus.NO_CONTENT)
  async checkSignupDetails(@Body() dto: SignupDetailsDto) {
    await this.authService.checkSignupDetails(dto);
  }

  @Post("signup/otp")
  @HttpCode(HttpStatus.OK)
  sendSignupOtp(@Body() dto: SignupDetailsDto) {
    return this.authService.sendSignupOtp(dto);
  }

  @Post("signup/otp/verify")
  @HttpCode(HttpStatus.OK)
  verifySignupOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifySignupOtp(dto);
  }

  @Post("signup")
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("oauth/clerk")
  @HttpCode(HttpStatus.OK)
  loginWithClerk(@Body() dto: ClerkExchangeDto) {
    return this.authService.loginWithClerk(dto.token);
  }

  @Get("me")
  me(@Headers("authorization") authorization?: string) {
    return this.authService.me(bearerToken(authorization));
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Headers("authorization") authorization?: string) {
    await this.authService.logout(bearerToken(authorization));
  }
}
