import { request } from "./http";
import type {
  AuthResponse,
  LoginRequest,
  SendSignupOtpResponse,
  SignupDetails,
  SignupRequest,
  User,
  VerifySignupOtpRequest,
  VerifySignupOtpResponse,
} from "@nakka/types/users";

export { ApiError } from "./http";

export type OAuthProvider = "google" | "github";

export const authApi = {
  checkSignupDetails: (details: SignupDetails) =>
    request<void>("/auth/signup/check", { method: "POST", body: JSON.stringify(details) }),
  // Sign-up step 1: email a 6-digit code for these details.
  sendSignupOtp: (details: SignupDetails) =>
    request<SendSignupOtpResponse>("/auth/signup/otp", {
      method: "POST",
      body: JSON.stringify(details),
    }),
  // Sign-up step 2: confirm the code; returns the token step 3 needs.
  verifySignupOtp: (data: VerifySignupOtpRequest) =>
    request<VerifySignupOtpResponse>("/auth/signup/otp/verify", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // Sign-up step 3: create the verified account.
  signup: (data: SignupRequest) =>
    request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data: LoginRequest) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: (token: string) => request<User>("/auth/me", { token }),
  logout: (token: string) =>
    request<void>("/auth/logout", { method: "POST", token }),
  // Google/GitHub: trade the Clerk session token for a Nakka session.
  loginWithClerk: (token: string) =>
    request<AuthResponse>("/auth/oauth/clerk", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
};
