import { useEffect, useState, type FormEvent } from "react";
import { SignIn } from "@clerk/react";
import { CLERK_PUBLISHABLE_KEY } from "../../../context/ClerkSetup";
import { rememberReturn } from "../../../api-hooks/auth/useOAuth";
import type { OAuthProvider } from "../../../api/auth";
import { useAuth, useOAuth } from "../../../api-hooks/auth";
import TextField from "../../TextField";
import SocialButtons from "../SocialButtons";
import { useAuthSubmit } from "../useAuthSubmit";
import { focusFirstInvalid } from "../focusFirstInvalid";
import { styles } from "./LoginForm.style";

interface LoginFormProps {
  onSwitch: () => void;
  onDone: () => void;
}

type Field = "identifier" | "password";

export default function LoginForm({ onSwitch, onDone }: LoginFormProps) {
  const [legacy, setLegacy] = useState(!CLERK_PUBLISHABLE_KEY);
  useEffect(() => { if (!legacy) rememberReturn(); }, [legacy]);
  if (legacy) return (
    <>
      <LegacyLoginForm onSwitch={onSwitch} onDone={onDone} />
      {CLERK_PUBLISHABLE_KEY && <button type="button" className={styles.switchButton} onClick={() => setLegacy(false)}>Back to standard sign-in</button>}
    </>
  );
  return (
    <div className={styles.form}>
      <SignIn routing="hash" forceRedirectUrl="/sso-callback/complete"
        appearance={{ elements: { rootBox: { width: "100%" }, cardBox: { width: "100%", boxShadow: "none" }, header: { display: "none" }, footerAction: { display: "none" } } }} />
      <p className={styles.switchText}>Already had a Nakka password account? <button type="button" className={styles.switchButton} onClick={() => setLegacy(true)}>Use existing account</button></p>
      <p className={styles.switchText}>Don't have an account? <button type="button" className={styles.switchButton} onClick={onSwitch}>Sign up</button></p>
    </div>
  );
}

function LegacyLoginForm({ onSwitch, onDone }: LoginFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const { login } = useAuth();
  const startOAuth = useOAuth();
  const { status, pending, error, run } = useAuthSubmit();
  // Stays busy after success while the modal closes and the dashboard opens.
  const busy = status !== "idle";

  const errors: Record<Field, string> = {
    identifier: identifier.trim() ? "" : "Enter your username or email.",
    password: password ? "" : "Enter your password.",
  };
  const visibleError = (field: Field) =>
    (submitted || touched[field]) && errors[field] ? errors[field] : undefined;
  const touch = (field: Field) => () =>
    setTouched((previous) => ({ ...previous, [field]: true }));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) {
      focusFirstInvalid(event.currentTarget);
      return;
    }
    const name = identifier.trim();
    run(async () => {
      await login({ identifier: name, password });
      onDone();
      return "";
    });
  }

  function chooseProvider(provider: OAuthProvider) {
    run(() => startOAuth(provider), provider);
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {error && (
        <p className={styles.errorBanner} role="alert">
          {error}
        </p>
      )}
      <fieldset className={styles.fields} disabled={busy}>
        <TextField
          label="Username or email"
          name="username"
          autoComplete="username"
          autoFocus
          value={identifier}
          onValueChange={setIdentifier}
          onBlur={touch("identifier")}
          error={visibleError("identifier")}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onValueChange={setPassword}
          onBlur={touch("password")}
          error={visibleError("password")}
        />
      </fieldset>

      <button className={styles.submit} type="submit" disabled={busy}>
        {busy && !pending && (
          <span className={styles.spinner} aria-hidden="true">
            progress_activity
          </span>
        )}
        {busy && !pending ? "Logging in..." : "Log in"}
      </button>

      <SocialButtons
        onSelect={chooseProvider}
        pending={pending}
        disabled={busy}
      />

      <p className={styles.switchText}>
        Don't have an account?
        <button
          type="button"
          className={styles.switchButton}
          onClick={onSwitch}
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
