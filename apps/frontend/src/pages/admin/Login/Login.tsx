import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin";
import { useAdminAuth } from "../../../api-hooks/admin";
import { useApiData } from "../../../api-hooks/useApiData";
import AmbientBackground from "../../../components/AmbientBackground";
import PageLoader from "../../../components/PageLoader";
import TextField from "../../../components/TextField";
import { authCardStyles as styles } from "../authCard.style";

// Admin sign-in with email and password (no Google or Clerk). Until the first
// admin exists, it points to the sign-up page.
export default function Login() {
  const { status, login } = useAdminAuth();
  const setup = useApiData(() => adminApi.setupStatus(), []);
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") return <PageLoader />;
  if (status === "authenticated") return <Navigate to={from ?? "/admin"} replace />;

  const errors = {
    email: email.trim() ? "" : "Enter your email.",
    password: password ? "" : "Enter your password.",
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (errors.email || errors.password) return;
    setBusy(true);
    setError("");
    try {
      await login({ email: email.trim(), password });
      navigate(from ?? "/admin", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't sign in.");
      setBusy(false);
    }
  }

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
          <h1 className={styles.title}>Sign in to the admin dashboard</h1>
          <p className={styles.description}>For Nakka staff only.</p>
        </div>
        {setup.data?.setupNeeded && (
          <Link to="/admin/signup" className={styles.setupLink}>
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span className="flex-1">No admin account yet. Create the first one.</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        )}
        {error && (
          <p className={styles.error} role="alert">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </p>
        )}
        <TextField
          label="Email"
          type="email"
          autoComplete="username"
          autoFocus
          value={email}
          onValueChange={setEmail}
          error={submitted ? errors.email || undefined : undefined}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onValueChange={setPassword}
          error={submitted ? errors.password || undefined : undefined}
        />
        <button type="submit" className={styles.submit} disabled={busy}>
          {busy && <span className={styles.spinner}>progress_activity</span>}
          Sign in
        </button>
        {setup.data && !setup.data.setupNeeded && (
          <p className={styles.footnote}>
            Need an account? Ask an existing admin to add you.
          </p>
        )}
      </form>
    </div>
  );
}
