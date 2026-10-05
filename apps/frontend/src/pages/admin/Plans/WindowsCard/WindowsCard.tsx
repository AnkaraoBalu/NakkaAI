import { useState, type FormEvent } from "react";
import type { AdminPlan } from "@nakka/types/admin";
import type { PlanPricing, PlanWindow } from "@nakka/types/plans";
import { adminApi } from "../../../../api/admin";
import { useRequest } from "../../../../components/Login/useRequest";
import { FREE_PLAN_ID } from "../../../../constants/plans";
import PricingCalculator, { type CalculatedBudgets } from "../PricingCalculator";
import { styles } from "./WindowsCard.style";

interface Row {
  label: string;
  // Dollars of provider cost, as typed.
  limit: string;
  hours: string;
  // Never resets: a one-time credit.
  oneTime: boolean;
  // Counts only premium models.
  premium: boolean;
}

const MICROS = 1_000_000;
const DOLLARS = /^\d+(\.\d{1,2})?$/;
const MAX_WINDOWS = 4;
const FREE_CREDIT: Row = { label: "Free credit", limit: "0.25", hours: "", oneTime: true, premium: false };

// A window's id comes from its kind and length, so editing a label or budget
// keeps users' current usage, while a new length starts a fresh count.
function idFor(row: Row) {
  if (row.oneTime) return "credit";
  const hours = Number(row.hours);
  const base = hours === 168 ? "week" : `${hours}h`;
  return row.premium ? `${base}-premium` : base;
}

const toRows = (windows: PlanWindow[]): Row[] =>
  windows.map((planWindow) => ({
    label: planWindow.label,
    limit: String(planWindow.limit / MICROS),
    hours: planWindow.duration_hours === null ? "" : String(planWindow.duration_hours),
    oneTime: planWindow.duration_hours === null,
    premium: Boolean(planWindow.premium_only),
  }));

function validate(name: string, rows: Row[]): string {
  if (!name.trim()) return "Give the plan a name.";
  for (const row of rows) {
    if (!row.label.trim()) return "Every window needs a label.";
    if (!DOLLARS.test(row.limit) || Number(row.limit) < 0.01)
      return "Budgets are dollar amounts of at least $0.01 (e.g. 3 or 2.50).";
    if (!row.oneTime && (!/^\d+$/.test(row.hours) || Number(row.hours) < 1 || Number(row.hours) > 8784))
      return "A resetting window needs a length between 1 hour and a year.";
  }
  const ids = rows.map(idFor);
  if (new Set(ids).size !== ids.length)
    return "Two windows are the same kind and length; change one or remove it.";
  return "";
}

const sameWindows = (rows: Row[], windows: PlanWindow[]) =>
  JSON.stringify(rows) === JSON.stringify(toRows(windows));

// The plan's name and allowance windows: the Free plan's one-time credit, or a
// paid plan's 5-hour session, weekly and premium-weekly budgets.
export default function WindowsCard({ plan, onSaved }: { plan: AdminPlan; onSaved: (plan: AdminPlan) => void }) {
  const [name, setName] = useState(plan.name);
  const [rows, setRows] = useState<Row[]>(() => toRows(plan.windows));
  const [pricing, setPricing] = useState<PlanPricing | null>(plan.pricing ?? null);
  const [saved, setSaved] = useState(false);
  const { busy, error, setError, run } = useRequest();
  const free = plan.id === FREE_PLAN_ID;

  const dirty =
    name !== plan.name ||
    !sameWindows(rows, plan.windows) ||
    JSON.stringify(pricing) !== JSON.stringify(plan.pricing ?? null);

  const change = (next: Row[] | ((current: Row[]) => Row[])) => {
    setSaved(false);
    setError("");
    setRows(next);
  };
  const update = (index: number, patch: Partial<Row>) =>
    change((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  function applyBudgets(next: PlanPricing, budgets: CalculatedBudgets) {
    setPricing(next);
    change([
      { label: "Session (5hr)", limit: budgets.session.toFixed(2), hours: "5", oneTime: false, premium: false },
      { label: "Weekly (7 day)", limit: budgets.weekly.toFixed(2), hours: "168", oneTime: false, premium: false },
      ...(next.premiumSharePercent > 0 && next.premiumSharePercent < 100
        ? [{ label: "Premium models (7 day)", limit: budgets.premiumWeekly.toFixed(2), hours: "168", oneTime: false, premium: true }]
        : []),
    ]);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = validate(name, rows);
    if (problem) return setError(problem);
    const windows: PlanWindow[] = rows.map((row) => ({
      id: idFor(row),
      label: row.label.trim(),
      limit: Math.round(Number(row.limit) * MICROS),
      duration_hours: row.oneTime ? null : Number(row.hours),
      ...(row.premium ? { premium_only: true } : {}),
    }));
    const result = await run(() =>
      adminApi.updatePlan(plan.id, { name: name.trim(), windows, pricing }),
    );
    if (!result) return;
    onSaved(result);
    setName(result.name);
    setRows(toRows(result.windows));
    setPricing(result.pricing ?? null);
    setSaved(true);
  }

  return (
    <form className={styles.card} onSubmit={save} noValidate aria-labelledby="windows-title">
      <div className={styles.header}>
        <h2 id="windows-title" className={styles.title}>Name and allowances</h2>
        <p className={styles.description}>
          Like Claude Code, allowances measure cost, not requests: each request uses up
          what it cost you (its tokens × the model's prices) from every window it counts
          against. Users see the percent used, never dollars.{" "}
          {free
            ? "Give Free a one-time credit: when it's used up it doesn't come back, and the user has to upgrade."
            : "Paid plans get a 5-hour session and a weekly budget, plus a smaller weekly budget for premium models."}
        </p>
      </div>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Plan name</span>
        <input
          className={styles.input}
          value={name}
          maxLength={40}
          onChange={(event) => {
            setSaved(false);
            setName(event.target.value);
          }}
        />
      </label>

      {!free && <PricingCalculator initial={pricing} onApply={applyBudgets} />}

      {rows.length ? (
        <div className={styles.rows}>
          <div className={styles.rowHead} aria-hidden="true">
            <span>Label (users see this)</span>
            <span>Budget (USD of API cost)</span>
            <span>Resets</span>
            <span>Counts</span>
            <span />
          </div>
          {rows.map((row, index) => (
            <div key={index} className={styles.row}>
              <input
                className={styles.input}
                aria-label="Window label"
                value={row.label}
                maxLength={30}
                onChange={(event) => update(index, { label: event.target.value })}
              />
              <span className={styles.money}>
                <span className={styles.currency} aria-hidden="true">$</span>
                <input
                  className={styles.moneyInput}
                  aria-label="Budget in dollars"
                  inputMode="decimal"
                  value={row.limit}
                  onChange={(event) => update(index, { limit: event.target.value.replace(/[^\d.]/g, "") })}
                />
              </span>
              <span className={styles.resets}>
                <select
                  className={styles.select}
                  aria-label="When the window resets"
                  value={row.oneTime ? "never" : "hours"}
                  onChange={(event) =>
                    update(index, {
                      oneTime: event.target.value === "never",
                      premium: event.target.value === "never" ? false : row.premium,
                    })
                  }
                >
                  <option value="hours">Every</option>
                  <option value="never">Never (one-time)</option>
                </select>
                {!row.oneTime && (
                  <span className={styles.hours}>
                    <input
                      className={styles.hoursInput}
                      aria-label="Window length in hours"
                      inputMode="numeric"
                      value={row.hours}
                      onChange={(event) => update(index, { hours: event.target.value.replace(/\D/g, "") })}
                    />
                    <span className={styles.unit}>h</span>
                  </span>
                )}
              </span>
              <select
                className={styles.select}
                aria-label="Which models count"
                value={row.premium ? "premium" : "all"}
                disabled={row.oneTime}
                onChange={(event) => update(index, { premium: event.target.value === "premium" })}
              >
                <option value="all">All models</option>
                <option value="premium">Premium only</option>
              </select>
              <button
                type="button"
                className={styles.removeButton}
                aria-label={`Remove ${row.label || "window"}`}
                onClick={() => change((current) => current.filter((_, i) => i !== index))}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.unlimited}>
          <span className="material-symbols-outlined text-[18px]">all_inclusive</span>
          No windows: this plan has no usage limit.
        </p>
      )}

      {rows.length < MAX_WINDOWS && (
        <div className={styles.addRow}>
          {free && !rows.some((row) => row.oneTime) && (
            <button type="button" className={styles.secondaryButton} onClick={() => change([FREE_CREDIT])}>
              <span className="material-symbols-outlined text-[18px]">redeem</span>
              One-time free credit ($0.25)
            </button>
          )}
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() =>
              change((current) => [...current, { label: "", limit: "", hours: "", oneTime: false, premium: false }])
            }
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add window
          </button>
        </div>
      )}

      {error && <p className={styles.error} role="alert">{error}</p>}
      {saved && !dirty && (
        <p className={styles.success} role="status">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Saved. Applies from the next request.
        </p>
      )}
      <div className={styles.footer}>
        <button type="submit" className={styles.primaryButton} disabled={busy || !dirty}>
          {busy && <span className={styles.spinner}>progress_activity</span>}
          Save allowances
        </button>
        {dirty && (
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setName(plan.name);
              setRows(toRows(plan.windows));
              setPricing(plan.pricing ?? null);
              setError("");
            }}
          >
            Discard changes
          </button>
        )}
      </div>
    </form>
  );
}
