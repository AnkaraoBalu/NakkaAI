import { Link } from "react-router-dom";
import { styles } from "./SsoStatus.style";

// Full-page card shown while Google/GitHub sign-in finishes, or if it fails.
export default function SsoStatus({
  error,
  backTo = "/product",
}: {
  error?: string;
  backTo?: string;
}) {
  return (
    <div className={styles.root}>
      <div className={styles.card} role={error ? "alert" : "status"}>
        <img alt="" className={styles.logo} src="/logo3.png" />
        {error ? (
          <>
            <span className={styles.errorIcon} aria-hidden="true">
              <span className="material-symbols-outlined text-[26px]">
                error
              </span>
            </span>
            <p className={styles.title}>We couldn't sign you in</p>
            <p className={styles.message}>{error}</p>
            <Link to={backTo} className={styles.back}>
              {backTo === "/product" ? "Back to Nakka" : "Back to settings"}
            </Link>
          </>
        ) : (
          <>
            <span className={styles.spinner} aria-hidden="true">
              progress_activity
            </span>
            <p className={styles.title}>
              {backTo === "/product"
                ? "Signing you in…"
                : "Connecting your account…"}
            </p>
            <p className={styles.message}>This only takes a moment.</p>
          </>
        )}
      </div>
    </div>
  );
}
