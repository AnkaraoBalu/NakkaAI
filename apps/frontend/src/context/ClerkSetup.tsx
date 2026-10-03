import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/react";
import { useNavigate } from "react-router-dom";

export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Clerk only handles Google/GitHub sign-in. Without a publishable key it's
// skipped entirely and those buttons explain that they aren't set up.
export default function ClerkSetup({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  if (!CLERK_PUBLISHABLE_KEY) return <>{children}</>;
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      afterSignOutUrl="/product"
    >
      {children}
    </ClerkProvider>
  );
}
