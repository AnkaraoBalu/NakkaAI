import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { extensionApi } from "../../api/extension";
import { useAuth } from "../../api-hooks/auth";
import { useAuthModal } from "../../context/authModalContext";
import { styles } from "./ExtensionAuth.style";

type Phase =
  | { name: "checking" }
  | { name: "invalid"; message: string }
  | { name: "ready" }
  | { name: "connecting" }
  | { name: "done"; redirectUrl: string };

const errorMessage = (caught: unknown) =>
  caught instanceof Error
    ? caught.message
    : "Something went wrong. Please try again.";

// Opened by the VS Code extension's "Sign in":
//   /auth?state=<64 hex>&redirect=vscode://Nakka.nakka/auth
// The person signs in (if needed), confirms, and we send them back to VS Code
// with a token for the extension.
export default function ExtensionAuth() {
  const [params] = useSearchParams();
  const state = params.get("state") ?? "";
  const redirect = params.get("redirect") ?? "";
  const { user, status, logout } = useAuth();
  const { openAuth } = useAuthModal();
  const [phase, setPhase] = useState<Phase>({ name: "checking" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state || !redirect) {
      setPhase({
        name: "invalid",
        message:
          "This page is opened by the Nakka extension. Start signing in from VS Code.",
      });
      return;
    }
    extensionApi
      .start(state, redirect)
      .then(() => setPhase({ name: "ready" }))
      .catch((caught) =>
        setPhase({ name: "invalid", message: errorMessage(caught) }),
      );
  }, [state, redirect]);

  async function connect() {
    setError("");
    setPhase({ name: "connecting" });
    try {
      const { redirectUrl } = await extensionApi.complete(state);
      setPhase({ name: "done", redirectUrl });
      window.location.href = redirectUrl;
    } catch (caught) {
      setError(errorMessage(caught));
      setPhase({ name: "ready" });
    }
  }

  const header = (
    <div className={styles.pair} aria-hidden="true">
      <img alt="" className={styles.logo} src="/logo3.png" />
      <span className={styles.link}>sync_alt</span>
      <span className={styles.vscode}>
        <span className="material-symbols-outlined text-[22px]">code</span>
      </span>
    </div>
  );

  let body;
  if (
    phase.name === "checking" ||
    (phase.name !== "invalid" && status === "loading")
  ) {
    body = (
      <>
        <span className={styles.bigSpinner} aria-hidden="true">
          progress_activity
        </span>
        <p className={styles.message}>Checking your sign-in link…</p>
      </>
    );
  } else if (phase.name === "invalid") {
    body = (
      <>
        <span className={styles.errorIcon} aria-hidden="true">
          <span className="material-symbols-outlined text-[26px]">
            link_off
          </span>
        </span>
        <p className={styles.title}>This link can't be used</p>
        <p className={styles.message}>{phase.message}</p>
      </>
    );
  } else if (phase.name === "done") {
    body = (
      <>
        <span className={styles.doneIcon} aria-hidden="true">
          <span className="material-symbols-outlined text-[26px]">check</span>
        </span>
        <p className={styles.title}>VS Code is opening</p>
        <p className={styles.message}>
          You're signed in to Nakka in VS Code. You can close this tab.
        </p>
        <a className={styles.secondary} href={phase.redirectUrl}>
          Open VS Code again
        </a>
      </>
    );
  } else if (!user) {
    body = (
      <>
        <p className={styles.title}>Sign in to connect VS Code</p>
        <p className={styles.message}>
          Log in to your Nakka account, then come back here to finish.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            onClick={() => openAuth("login")}
          >
            Log in
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => openAuth("signup")}
          >
            Create an account
          </button>
        </div>
      </>
    );
  } else {
    const busy = phase.name === "connecting";
    body = (
      <>
        <p className={styles.title}>Connect VS Code?</p>
        <p className={styles.message}>
          The Nakka extension will use this account, its plan and its allowance.
        </p>
        <div className={styles.account}>
          <span className={styles.avatar} aria-hidden="true">
            {user.firstName.charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className={styles.accountName}>
              {user.firstName} {user.lastName}
            </span>
            <span className={styles.accountEmail}>{user.email}</span>
          </span>
        </div>
        {error && (
          <p className={styles.message} role="alert">
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primary}
            onClick={connect}
            disabled={busy}
          >
            {busy && (
              <span className={styles.spinner} aria-hidden="true">
                progress_activity
              </span>
            )}
            {busy ? "Connecting..." : "Connect and open VS Code"}
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => void logout()}
            disabled={busy}
          >
            Use a different account
          </button>
        </div>
        <p className={styles.note}>
          Only continue if you started signing in from VS Code.
        </p>
      </>
    );
  }

  return (
    <div className={styles.root}>
      <div
        className={styles.card}
        role={phase.name === "invalid" ? "alert" : undefined}
      >
        {header}
        {body}
      </div>
    </div>
  );
}
