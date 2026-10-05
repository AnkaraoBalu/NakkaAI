import { FREE_PLAN_ID } from "../../constants/plans";
import { styles } from "./PlanBadge.style";

// "Free" in grey, any paid plan highlighted.
export default function PlanBadge({ planId, name }: { planId: string; name: string }) {
  const paid = planId !== FREE_PLAN_ID;
  return (
    <span className={styles.root(paid)}>
      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
        {paid ? "workspace_premium" : "bolt"}
      </span>
      {name}
    </span>
  );
}
