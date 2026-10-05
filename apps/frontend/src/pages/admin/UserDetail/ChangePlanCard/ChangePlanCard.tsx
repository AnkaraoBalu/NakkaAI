import { useState, type FormEvent } from "react";
import type { AdminPlan, AdminUserDetail } from "@nakka/types/admin";
import { adminApi } from "../../../../api/admin";
import { useRequest } from "../../../../components/Login/useRequest";
import PlanBadge from "../../../../components/PlanBadge";
import { FREE_PLAN_ID } from "../../../../constants/plans";
import { formatDate, formatUsd } from "../../../../utils/format";
import { styles } from "./ChangePlanCard.style";

interface ChangePlanCardProps {
  user: AdminUserDetail;
  plans: AdminPlan[];
  onChanged: (user: AdminUserDetail) => void;
}

// "YYYY-MM-DD" in the admin's own time zone, as a date input uses.
const localDay = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
const tomorrow = () => localDay(new Date(Date.now() + 86_400_000));

// Moves a user between plans by hand (payments aren't automated yet).
export default function ChangePlanCard({ user, plans, onChanged }: ChangePlanCardProps) {
  const [planId, setPlanId] = useState(user.planId);
  const [limited, setLimited] = useState(Boolean(user.planEndsAt));
  const savedEndsOn = user.planEndsAt ? localDay(new Date(user.planEndsAt)) : "";
  const [endsOn, setEndsOn] = useState(savedEndsOn);
  const [notice, setNotice] = useState("");
  const { busy, error, setError, run } = useRequest();

  const free = planId === FREE_PLAN_ID;
  const unchanged =
    planId === user.planId &&
    (free || (limited ? endsOn === savedEndsOn : !user.planEndsAt));

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    let endsAt: string | null = null;
    if (!free && limited) {
      if (!endsOn) return setError("Pick the last day of the plan.");
      // The plan lasts through the chosen day (end of that day, admin's time zone).
      endsAt = new Date(`${endsOn}T23:59:59`).toISOString();
      if (new Date(endsAt).getTime() <= Date.now()) return setError("The end date must be in the future.");
    }
    const updated = await run(() => adminApi.assignPlan(user.id, { planId, endsAt }));
    if (!updated) return;
    onChanged(updated);
    setNotice(
      free
        ? `${user.email} is back on Free.`
        : `${user.email} is now on ${updated.planName}${updated.planEndsAt ? ` until ${formatDate(updated.planEndsAt)}` : ""}.`,
    );
  }

  return (
    <form className={styles.card} onSubmit={save} noValidate aria-labelledby="change-plan-title">
      <div className={styles.cardHead}>
        <div className={styles.header}>
          <h2 id="change-plan-title" className={styles.title}>Plan</h2>
          <p className={styles.description}>
            Takes effect on the user's next request. Moving to Free keeps their usage counts.
          </p>
        </div>
        <span className="inline-flex flex-col items-end gap-0.5">
          <PlanBadge planId={user.planId} name={user.planName} />
          {user.planEndsAt && <span className={styles.muted}>until {formatDate(user.planEndsAt)}</span>}
        </span>
      </div>

      <fieldset className={styles.options}>
        <legend className="sr-only">Plan</legend>
        {plans.map((plan) => (
          <label key={plan.id} className={styles.option(plan.id === planId)}>
            <input
              type="radio"
              name="plan"
              value={plan.id}
              checked={plan.id === planId}
              onChange={() => {
                setPlanId(plan.id);
                setError("");
                setNotice("");
              }}
              className="sr-only"
            />
            <span className={styles.optionName}>{plan.name}</span>
            <span className={styles.muted}>
              {plan.models.length} {plan.models.length === 1 ? "model" : "models"}
              {plan.windows.length
                ? ` · ${plan.windows.map((w) => `${formatUsd(w.limit)} / ${w.label}`).join(", ")}`
                : " · unlimited"}
            </span>
          </label>
        ))}
      </fieldset>

      {!free && (
        <div className={styles.endRow}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={limited}
              onChange={(event) => {
                setLimited(event.target.checked);
                if (event.target.checked && !endsOn) setEndsOn(tomorrow());
              }}
            />
            Ends on a date
          </label>
          {limited && (
            <input
              type="date"
              className={styles.dateInput}
              min={tomorrow()}
              value={endsOn}
              onChange={(event) => setEndsOn(event.target.value)}
              aria-label="Last day of the plan"
            />
          )}
          {!limited && <span className={styles.muted}>No end date: stays until you change it.</span>}
        </div>
      )}

      {error && <p className={styles.error} role="alert">{error}</p>}
      {notice && (
        <p className={styles.success} role="status">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {notice}
        </p>
      )}
      <div>
        <button type="submit" className={styles.primaryButton} disabled={busy || unchanged}>
          {busy && <span className={styles.spinner}>progress_activity</span>}
          {free && user.planId !== FREE_PLAN_ID ? "Move to Free" : "Save plan"}
        </button>
      </div>
    </form>
  );
}
