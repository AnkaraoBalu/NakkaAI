import { useState, type FormEvent } from "react";
import type { AccountSecurity } from "@nakka/types/users";
import { accountApi } from "../../../../api/account";
import TextField from "../../../../components/TextField";
import { validatePassword } from "../../../../components/Login/SignupForm/validation";
import { styles } from "./PasswordCard.style";

interface PasswordCardProps {
  hasPassword: boolean;
  onSaved: (security: AccountSecurity) => void;
}

// Change the password, or add one to an account that only signs in with Google/GitHub.
export default function PasswordCard({
  hasPassword,
  onSaved,
}: PasswordCardProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const errors = {
    current: hasPassword && !current ? "Enter your current password." : "",
    ...validatePassword(password, confirm),
  };
  const show = (key: keyof typeof errors) =>
    submitted && errors[key] ? errors[key] : undefined;

  function reset() {
    setOpen(false);
    setCurrent("");
    setPassword("");
    setConfirm("");
    setSubmitted(false);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    setBusy(true);
    setError("");
    try {
      onSaved(
        await accountApi.setPassword({
          password,
          currentPassword: hasPassword ? current : undefined,
        }),
      );
      reset();
      setSaved(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Couldn't save your password.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.card} aria-labelledby="password-title">
      <div className={styles.header}>
        <h2 id="password-title" className={styles.title}>
          Password
        </h2>
        <p className={styles.description}>
          {hasPassword
            ? "Use your email or username and password to sign in."
            : "You sign in with Google or GitHub. Add a password to also sign in with your email."}
        </p>
      </div>

      {saved && !open && (
        <p className={styles.success} role="status">
          <span className="material-symbols-outlined text-[18px]">
            check_circle
          </span>
          Your password has been saved.
        </p>
      )}

      {!open ? (
        <div>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setSaved(false);
              setOpen(true);
            }}
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
            {hasPassword ? "Change password" : "Add a password"}
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={submit} noValidate>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          {hasPassword && (
            <TextField
              label="Current password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={current}
              onValueChange={setCurrent}
              error={show("current")}
            />
          )}
          <div className={styles.fields}>
            <TextField
              label="New password"
              type="password"
              autoComplete="new-password"
              autoFocus={!hasPassword}
              value={password}
              onValueChange={setPassword}
              error={show("password")}
            />
            <TextField
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onValueChange={setConfirm}
              error={show("confirmPassword")}
            />
          </div>
          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={busy}
            >
              {busy && (
                <span className={styles.spinner} aria-hidden="true">
                  progress_activity
                </span>
              )}
              {busy ? "Saving..." : "Save password"}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={reset}
              disabled={busy}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
