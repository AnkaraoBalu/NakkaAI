import { useEffect, useRef, useState } from "react";
import type { OAuthProvider } from "../../api/auth";

type Status = "idle" | "submitting" | "success";

// Tracks one in-flight auth request: its spinner, its error, and the success
// message the request resolves with.
export function useAuthSubmit() {
  const [status, setStatus] = useState<Status>("idle");
  const [pending, setPending] = useState<OAuthProvider | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function run(
    task: () => Promise<string>,
    provider: OAuthProvider | null = null,
  ) {
    setStatus("submitting");
    setPending(provider);
    setError("");
    try {
      const successMessage = await task();
      if (!mounted.current) return;
      setMessage(successMessage);
      setStatus("success");
    } catch (caught) {
      if (!mounted.current) return;
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong. Please try again.",
      );
      setStatus("idle");
    } finally {
      if (mounted.current) setPending(null);
    }
  }

  return { status, pending, message, error, run };
}
