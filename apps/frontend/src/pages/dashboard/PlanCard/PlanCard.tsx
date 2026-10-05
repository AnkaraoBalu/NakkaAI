import type { MyUsage } from "@nakka/types/usage";
import PlanBadge from "../../../components/PlanBadge";
import UsageMeter from "../../../components/UsageMeter";
import { FREE_PLAN_ID, UPGRADE_URL } from "../../../constants/plans";
import { formatDate } from "../../../utils/format";
import { styles } from "./PlanCard.style";

// The user's plan and its allowance windows (Overview and Usage pages).
export default function PlanCard({ usage }: { usage: MyUsage }) {
  const { plan, windows } = usage;
  const free = plan.id === FREE_PLAN_ID;

  return (
    <section className={styles.card} aria-labelledby="plan-title">
      <div className={styles.head}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Your plan</p>
          <div className={styles.titleRow}>
            <h2 id="plan-title" className={styles.planName}>
              {plan.name}
            </h2>
            <PlanBadge planId={plan.id} name={free ? "Free" : "Active"} />
          </div>
          <p className={styles.description}>
            {plan.endsAt
              ? `Active until ${formatDate(plan.endsAt)}. After that you're back on Free.`
              : free
                ? "Upgrade for more powerful models and bigger 5-hour and weekly allowances."
                : "Your allowance refills automatically when each window resets."}
          </p>
        </div>
        {free && (
          <a href={UPGRADE_URL} className={styles.primaryButton}>
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
            Upgrade to Pro
          </a>
        )}
      </div>

      {windows.length ? (
        <div className={styles.meters}>
          {windows.map((usageWindow) => (
            <UsageMeter key={usageWindow.id} usage={usageWindow} />
          ))}
        </div>
      ) : (
        <p className={styles.noLimits}>
          <span className="material-symbols-outlined text-[18px]">all_inclusive</span>
          No usage limits on this plan.
        </p>
      )}
    </section>
  );
}
