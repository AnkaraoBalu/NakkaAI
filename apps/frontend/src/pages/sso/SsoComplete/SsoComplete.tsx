import { useEffect, useRef, useState } from "react";
import { useAuth as useClerkAuth, useClerk } from "@clerk/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { accountApi } from "../../../api/account";
import { consumeReturnTo, useAuth } from "../../../api-hooks/auth";
import SsoStatus from "../SsoStatus";

// Clerk has a session for the Google/GitHub account. Either sign in with it, or
// (?mode=connect) attach it to the signed-in user. Then sign out of Clerk so only
// our session remains.
export default function SsoComplete() {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const clerk = useClerk();
  const navigate = useNavigate();
  const { loginWithClerk } = useAuth();
  const [params] = useSearchParams();
  const connecting = params.get("mode") === "connect";
  const provider = params.get("provider") ?? "";
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (!isLoaded || started.current) return;
    started.current = true;
    void (async () => {
      try {
        const token = isSignedIn ? await getToken() : null;
        if (!token)
          throw new Error("Your sign-in didn't finish. Please try again.");
        if (connecting) {
          await accountApi.connect(token);
        } else {
          await loginWithClerk(token);
        }
        const destination = connecting
          ? `/dashboard/settings?connected=${encodeURIComponent(provider)}`
          : consumeReturnTo();
        // A cleanup failure must not turn a successful Nakka login into an error.
        await clerk.signOut({ redirectUrl: destination }).catch(() => {
          navigate(destination, { replace: true });
        });
      } catch (caught) {
        // End the Clerk session (without navigating) so the next attempt starts fresh.
        await clerk.session?.end().catch(() => undefined);
        setError(
          caught instanceof Error
            ? caught.message
            : "Something went wrong. Please try again.",
        );
      }
    })();
  }, [
    isLoaded,
    isSignedIn,
    getToken,
    loginWithClerk,
    clerk,
    connecting,
    provider,
    navigate,
  ]);

  return (
    <SsoStatus
      error={error || undefined}
      backTo={connecting ? "/dashboard/settings" : "/product"}
    />
  );
}
