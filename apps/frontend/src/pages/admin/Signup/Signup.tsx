import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin";
import { useAdminAuth } from "../../../api-hooks/admin";
import { useApiData } from "../../../api-hooks/useApiData";
import AmbientBackground from "../../../components/AmbientBackground";
import PageLoader from "../../../components/PageLoader";
import TextField from "../../../components/TextField";
import { validateAdminAccount } from "../adminPassword";
import { authCardStyles as styles } from "../authCard.style";

// Creates the first admin account with email and password. Open only while no
// admin exists; after that, admins add each other from the Admins page.
export default function Signup() {
  const { status, setup } = useAdminAuth();
  const navigate = useNavigate();
  const setupStatus = useApiData(() => adminApi.setupStatus(), []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading" || (setupStatus.loading && !setupStatus.data)) return <PageLoader />;
  if (status === "authenticated") return <Navigate to="/admin" replace />;

  const errors = validateAdminAccount({ name, email, password, confirm });
  const show = (key: keyof typeof errors) => (submitted && errors[key]) || undefined;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    setBusy(true);
    setError("");
    try {
      await setup({ name: name.trim(), email: email.trim(), password });
      navigate("/admin", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't create the account.");
      setBusy(false);
      void setupStatus.reload();
    }
  }

  const closed = setupStatus.data && !setupStatus.data.setupNeeded;

  return (
    <div className={styles.root}>
      <AmbientBackground />
      <form className={styles.card} onSubmit={submit} noValidate>
        <div className={styles.brand}>
          <img alt="" className={styles.logo} src="/logo3.png" />
          <span className={styles.brandName}>Nakka</span>
          <span className={styles.tag}>Admin</span>
        </div>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {closed ? "Admin sign-up is closed" : "Create the admin account"}
          </h1>
          {!closed && (
            <p className={styles.description}>
              You'll be the first admin. After this, sign-up closes and only admins can add
              other admins.
            </p>
          )}
        </div>

        {closed ? (
          <div className={styles.closed} role="status">
            <p>An admin account already exists, so sign-up is closed.</p>
            <p>Ask an existing admin to add you from the Admins page.</p>
            <Link to="/admin/login" className={styles.link}>Go to sign in</Link>
          </div>
        ) : (
          <>
            {(error || setupStatus.error) && (
              <p className={styles.error} role="alert">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error || setupStatus.error}
              </p>
            )}
            <TextField label="Name" autoComplete="name" autoFocus value={name} onValueChange={setName} error={show("name")} />
            <TextField label="Email" type="email" autoComplete="username" value={email} onValueChange={setEmail} error={show("email")} />
            <TextField
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onValueChange={setPassword}
              error={show("password")}
              hint={!show("password") && <p className={styles.footnote}>At least 12 characters, with a letter and a number.</p>}
            />
            <TextField label="Confirm password" type="password" autoComplete="new-password" value={confirm} onValueChange={setConfirm} error={show("confirm")} />
            <button type="submit" className={styles.submit} disabled={busy}>
              {busy && <span className={styles.spinner}>progress_activity</span>}
              Create admin account
            </button>
            <p className={styles.footnote}>
              Already have an account? <Link to="/admin/login" className={styles.link}>Sign in</Link>
            </p>
          </>
        )}
      </form>
    </div>
  );
}
