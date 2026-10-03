import { styles } from "./PageLoader.style";

// Shown while a saved session is being checked.
export default function PageLoader() {
  return (
    <div className={styles.loading} role="status" aria-label="Loading">
      <span className={styles.spinner} aria-hidden="true">
        progress_activity
      </span>
    </div>
  );
}
