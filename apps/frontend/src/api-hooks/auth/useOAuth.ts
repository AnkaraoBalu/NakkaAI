import { useSignIn } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { ApiError, type OAuthProvider } from "../../api/auth";
import { CLERK_PUBLISHABLE_KEY } from "../../context/ClerkSetup";

const providerNames: Record<OAuthProvider, string> = {
  google: "Google",
  github: "GitHub",
};

// "login" signs in (or up). "connect" attaches the account to the signed-in user.
export type OAuthMode = "login" | "connect";

const RETURN_KEY = "nakka.returnTo";

// Signing in from the VS Code sign-in page returns there instead of the dashboard.
function rememberReturn() {
  try {
    if (window.location.pathname === "/auth") {
      sessionStorage.setItem(
        RETURN_KEY,
        window.location.pathname + window.location.search,
      );
    } else {
      sessionStorage.removeItem(RETURN_KEY);
    }
  } catch {
    // Without storage, Google/GitHub sign-in ends on the dashboard.
  }
}

// Where to go after a Google/GitHub sign-in finishes.
export function consumeReturnTo(): string {
  try {
    const value = sessionStorage.getItem(RETURN_KEY);
    sessionStorage.removeItem(RETURN_KEY);
    if (value?.startsWith("/auth?")) return value;
  } catch {
    // Fall through to the dashboard.
  }
  return "/dashboard";
}

// Sends the browser to Google/GitHub through Clerk. It comes back to /sso-callback.
function useClerkOAuth() {
  const { signIn } = useSignIn();
  const navigate = useNavigate();
  return async (
    provider: OAuthProvider,
    mode: OAuthMode = "login",
  ): Promise<string> => {
    const query =
      mode === "connect" ? `?mode=connect&provider=${provider}` : "";
    if (mode === "login") rememberReturn();
    const { error } = await signIn.sso({
      strategy: `oauth_${provider}`,
      redirectCallbackUrl: `/sso-callback${query}`,
      redirectUrl: `/sso-callback/complete${query}`,
    });
    // A Clerk session left over from an unfinished sign-in: just finish it.
    if (error?.code === "session_exists") {
      navigate(`/sso-callback/complete${query}`);
    } else if (error) {
      throw new ApiError(error.longMessage ?? error.message, 400);
    }
    // The page is navigating away; keep the button's spinner until it does.
    return new Promise<string>(() => {});
  };
}

function useOAuthUnavailable() {
  return async (provider: OAuthProvider): Promise<string> => {
    throw new ApiError(
      `${providerNames[provider]} sign-in isn't set up yet. Use your email instead.`,
      501,
    );
  };
}

export const OAUTH_ENABLED = Boolean(CLERK_PUBLISHABLE_KEY);

// Chosen once at load (the key can't change at runtime), so hook order stays stable.
export const useOAuth = OAUTH_ENABLED ? useClerkOAuth : useOAuthUnavailable;
