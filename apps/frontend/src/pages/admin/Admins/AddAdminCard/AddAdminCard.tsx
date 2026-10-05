import { useState, type FormEvent } from "react";
import type { AdminAccount } from "@nakka/types/admin";
import { adminApi } from "../../../../api/admin";
import { useRequest } from "../../../../components/Login/useRequest";
import TextField from "../../../../components/TextField";
import { validateAdminAccount } from "../../adminPassword";
import { styles } from "./AddAdminCard.style";

// Adds another admin with a starting password you share with them; they can
// change it after signing in.
export default function AddAdminCard({ onAdded }: { onAdded: (admin: AdminAccount) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState("");
  const { busy, error, run } = useRequest();

  const errors = validateAdminAccount({ name, email, password, confirm });
  const show = (key: keyof typeof errors) => (submitted && errors[key]) || undefined;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setNotice("");
    if (Object.values(errors).some(Boolean)) return;
    const added = await run(() =>
      adminApi.createAdmin({ name: name.trim(), email: email.trim(), password }),
    );
    if (!added) return;
    onAdded(added);
    setName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setSubmitted(false);
    setNotice(`${added.name} can now sign in at /admin/login with ${added.email}.`);
  }

  return (
    <form className={styles.card} onSubmit={submit} noValidate aria-labelledby="add-admin-title">
      <div className={styles.header}>
        <h2 id="add-admin-title" className={styles.title}>Add an admin</h2>
        <p className={styles.description}>
          Admins can change API keys, plans and users' plans. Share the starting password
          with them privately; they can change it after signing in.
        </p>
      </div>
      {notice && (
        <p className={styles.success} role="status">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {notice}
        </p>
      )}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <TextField label="Name" autoComplete="off" value={name} onValueChange={setName} error={show("name")} />
      <TextField label="Email" type="email" autoComplete="off" value={email} onValueChange={setEmail} error={show("email")} />
      <TextField label="Starting password" type="password" autoComplete="new-password" value={password} onValueChange={setPassword} error={show("password")} />
      <TextField label="Confirm password" type="password" autoComplete="new-password" value={confirm} onValueChange={setConfirm} error={show("confirm")} />
      <div>
        <button type="submit" className={styles.primaryButton} disabled={busy}>
          {busy ? (
            <span className={styles.spinner}>progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-[18px]">person_add</span>
          )}
          Add admin
        </button>
      </div>
    </form>
  );
}
