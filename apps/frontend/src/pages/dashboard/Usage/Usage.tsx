import { useUsage } from "../../../api-hooks/usage";
import PlanCard from "../PlanCard";
import { styles } from "./Usage.style";

// How much of the plan's allowance is used, and when it resets. Like Claude
// Code, users see percentages only: no request counts, tokens or costs.
export default function Usage() {
  const { data, error, loading, refresh } = useUsage();

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <p className={styles.intro}>
          How much of your allowance is used, and when it resets.
        </p>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => void refresh()}
          aria-label="Refresh"
          title="Refresh"
          disabled={loading}
        >
          <span className={`material-symbols-outlined text-[18px] ${loading ? "animate-spin" : ""}`}>
            {loading ? "progress_activity" : "refresh"}
          </span>
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {!data && !error && (
        <p className={styles.loading}>
          <span className="material-symbols-outlined text-[18px] animate-spin">
            progress_activity
          </span>
          Loading your usage…
        </p>
      )}
      {data && <PlanCard usage={data} />}
    </div>
  );
}
