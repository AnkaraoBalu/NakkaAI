import { useState } from "react";
import type { AdminPlan } from "@nakka/types/admin";
import { adminApi } from "../../../api/admin";
import { useApiData } from "../../../api-hooks/useApiData";
import SegmentedControl from "../../../components/SegmentedControl";
import { formatNumber } from "../../../utils/format";
import ModelsCard from "./ModelsCard";
import WindowsCard from "./WindowsCard";
import { styles } from "./Plans.style";

// Each plan's allowance windows and models. Changes apply to the next request.
export default function Plans() {
  const { data, setData, error } = useApiData(() => adminApi.plans(), []);
  const [selected, setSelected] = useState<string>("free");

  const replace = (plan: AdminPlan) =>
    setData((current) => current?.map((item) => (item.id === plan.id ? plan : item)) ?? null);

  if (error) return <p className={styles.pageError}>{error}</p>;
  if (!data) {
    return (
      <p className={styles.loading}>
        <span className={styles.loadingIcon}>progress_activity</span>
        Loading plans…
      </p>
    );
  }

  const plan = data.find((item) => item.id === selected) ?? data[0];
  if (!plan) return <p className={styles.pageError}>No plans exist.</p>;

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <p className={styles.intro}>
          Choose which models each plan can use and how much API cost it allows per window.
          Changes apply to everyone on the plan from their next request.
        </p>
        <SegmentedControl
          label="Plan"
          options={data.map((item) => ({ value: item.id, label: item.name }))}
          value={plan.id}
          onChange={setSelected}
        />
      </div>
      <p className={styles.muted}>
        {formatNumber(plan.subscribers)} {plan.subscribers === 1 ? "user is" : "users are"} on{" "}
        {plan.name} right now.
      </p>
      <WindowsCard key={`windows-${plan.id}`} plan={plan} onSaved={replace} />
      <ModelsCard key={`models-${plan.id}`} plan={plan} onSaved={replace} />
    </div>
  );
}
