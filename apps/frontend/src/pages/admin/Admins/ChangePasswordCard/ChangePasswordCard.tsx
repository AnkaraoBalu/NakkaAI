import { useState, type FormEvent } from "react";
import { adminApi } from "../../../../api/admin";
import { useRequest } from "../../../../components/Login/useRequest";
import TextField from "../../../../components/TextField";
import { adminPasswordError } from "../../adminPassword";
import { styles } from "./ChangePasswordCard.style";

// The signed-in admin's password. Other sessions are signed out; this one stays.
export default function ChangePasswordCard() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const { busy, error, run } = useRequest();

  const errors = {
    current: current ? "" : "Enter your current password.",
    password: adminPasswordError(password),
    confirm: !confirm ? "Re-enter the new password." : confirm === password ? "" : "Passwords don't match.",
  };
  const show = (key: keyof typeof errors) => (submitted && errors[key]) || undefined;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setSaved(false);
    if (Object.values(errors).some(Boolean)) return;
    const done = await run(async () => {
      await adminApi.changePassword({ currentPassword: current, newPassword: password });
      return true;
    });
    if (!done) return;
    setCurrent("");
    setPassword("");
    setConfirm("");
    setSubmitted(false);
    setSaved(true);
  }

  return (
    <form className={styles.card} onSubmit={submit} noValidate aria-labelledby="password-title">
      <div className={styles.header}>
        <h2 id="password-title" className={styles.title}>Your password</h2>
        <p className={styles.description}>
          Changing it signs you out everywhere else.
        </p>
      </div>
      {saved && (
        <p className={styles.success} role="status">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Password changed.
        </p>
      )}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <TextField label="Current password" type="password" autoComplete="current-password" value={current} onValueChange={setCurrent} error={show("current")} />
      <TextField label="New password" type="password" autoComplete="new-password" value={password} onValueChange={setPassword} error={show("password")} />
      <TextField label="Confirm new password" type="password" autoComplete="new-password" value={confirm} onValueChange={setConfirm} error={show("confirm")} />
      <p className={styles.muted}>At least 12 characters, with a letter and a number.</p>
      <div>
        <button type="submit" className={styles.primaryButton} disabled={busy}>
          {busy && <span className={styles.spinner}>progress_activity</span>}
          Change password
        </button>
      </div>
    </form>
  );
}
