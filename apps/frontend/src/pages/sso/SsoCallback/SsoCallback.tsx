import { useState } from "react";
import { HandleSSOCallback } from "@clerk/react";
import { useLocation, useNavigate } from "react-router-dom";
import SsoStatus from "../SsoStatus";

const NEEDS_MORE =
  "This account needs extra sign-up details that Nakka doesn't collect. Please sign up with your email instead.";

// Google/GitHub send the browser here; Clerk finishes the sign-in (or sign-up).
export default function SsoCallback() {
  const navigate = useNavigate();
  // Keep ?mode=connect (connecting from Settings) on the way to the next step.
  const { search } = useLocation();
  const [error, setError] = useState("");

  return (
    <>
      <SsoStatus
        error={error || undefined}
        backTo={
          search.includes("mode=connect") ? "/dashboard/settings" : "/product"
        }
      />
      {!error && (
        <HandleSSOCallback
          navigateToApp={() =>
            navigate(`/sso-callback/complete${search}`, { replace: true })
          }
          navigateToSignIn={() => setError(NEEDS_MORE)}
          navigateToSignUp={() => setError(NEEDS_MORE)}
        />
      )}
    </>
  );
}
