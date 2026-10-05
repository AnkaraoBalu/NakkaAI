import { useState, type FormEvent } from "react";
import type { AdminPlan } from "@nakka/types/admin";
import type { PlanWindow } from "@nakka/types/plans";
import { adminApi } from "../../../../api/admin";
import { useRequest } from "../../../../components/Login/useRequest";
import { styles } from "./WindowsCard.style";

interface Row {
  label: string;
  // Dollars of provider cost, as typed.
  limit: string;
  hours: string;
}

const PRESETS: Row[] = [
  { label: "5-hour", limit: "3", hours: "5" },
  { label: "Weekly", limit: "25", hours: "168" },
];
const MICROS = 1_000_000;
const DOLLARS = /^\d+(\.\d{1,2})?$/;
const MAX_WINDOWS = 4;

// A window's id is derived from its length, so editing a label or limit keeps
// users' current counts, while a new length starts a fresh count.
const idFor = (hours: number) => (hours === 168 ? "week" : `${hours}h`);

const toRows = (windows: PlanWindow[]): Row[] =>
  windows.map((planWindow) => ({
    label: planWindow.label,
    limit: String(planWindow.limit / MICROS),
    hours: String(planWindow.duration_hours),
  }));

function validate(name: string, rows: Row[]): string {
  if (!name.trim()) return "Give the plan a name.";
  for (const row of rows) {
    if (!row.label.trim()) return "Every window needs a label.";
    if (!DOLLARS.test(row.limit) || Number(row.limit) < 0.01)
      return "Budgets are dollar amounts of at least $0.01 (e.g. 3 or 2.50).";
    if (!/^\d+$/.test(row.hours) || Number(row.hours) < 1 || Number(row.hours) > 8784)
      return "Window length must be between 1 hour and a year.";
  }
  const hours = rows.map((row) => Number(row.hours));
  if (new Set(hours).size !== hours.length) return "Two windows can't have the same length.";
  return "";
}

// The plan's name and allowance windows (e.g. $3 of API cost per 5 hours, $25 per week).
export default function WindowsCard({ plan, onSaved }: { plan: AdminPlan; onSaved: (plan: AdminPlan) => void }) {
  const [name, setName] = useState(plan.name);
  const [rows, setRows] = useState<Row[]>(() => toRows(plan.windows));
  const [saved, setSaved] = useState(false);
  const { busy, error, setError, run } = useRequest();

  const dirty =
    name !== plan.name || JSON.stringify(rows) !== JSON.stringify(toRows(plan.windows));

  const update = (index: number, patch: Partial<Row>) => {
    setSaved(false);
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = validate(name, rows);
    if (problem) return setError(problem);
    const windows: PlanWindow[] = rows.map((row) => ({
      id: idFor(Number(row.hours)),
      label: row.label.trim(),
      limit: Math.round(Number(row.limit) * MICROS),
      duration_hours: Number(row.hours),
    }));
    const result = await run(() => adminApi.updatePlan(plan.id, { name: name.trim(), windows }));
    if (!result) return;
    onSaved(result);
    setName(result.name);
    setRows(toRows(result.windows));
    setSaved(true);
  }

  const missingPresets = PRESETS.filter(
    (preset) => !rows.some((row) => row.hours === preset.hours),
  );

  return (
    <form className={styles.card} onSubmit={save} noValidate aria-labelledby="windows-title">
      <div className={styles.header}>
        <h2 id="windows-title" className={styles.title}>Name and allowances</h2>
        <p className={styles.description}>
          Like Claude Code, allowances measure cost, not requests: each request uses up
          what it cost us (its tokens × the model's prices) from every window, so a long
          request on a big model uses far more than a short one on a small model. Users
          see the percent used and when it resets, never dollars. With no windows the
          plan is unlimited.
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

      {rows.length ? (
        <div className={styles.rows}>
          <div className={styles.rowHead} aria-hidden="true">
            <span>Label</span>
            <span>Budget (USD of API cost)</span>
            <span>Every (hours)</span>
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
              <input
                className={styles.input}
                aria-label="Window length in hours"
                inputMode="numeric"
                value={row.hours}
                onChange={(event) => update(index, { hours: event.target.value.replace(/\D/g, "") })}
              />
              <button
                type="button"
                className={styles.removeButton}
                aria-label={`Remove ${row.label || "window"}`}
                onClick={() => {
                  setSaved(false);
                  setRows((current) => current.filter((_, i) => i !== index));
                }}
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
          {missingPresets.map((preset) => (
            <button
              key={preset.hours}
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                setSaved(false);
                setRows((current) => [...current, preset]);
              }}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              {preset.label} window
            </button>
          ))}
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setSaved(false);
              setRows((current) => [...current, { label: "", limit: "", hours: "" }]);
            }}
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Custom window
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
