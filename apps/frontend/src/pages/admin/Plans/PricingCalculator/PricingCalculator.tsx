import { useState } from "react";
import type { PlanPricing } from "@nakka/types/plans";
import { styles } from "./PricingCalculator.style";

export interface CalculatedBudgets {
  // Dollars of provider cost.
  session: number;
  weekly: number;
  premiumWeekly: number;
  monthly: number;
}

// 52 weeks / 12 months.
const WEEKS_PER_MONTH = 52 / 12;
// Round down to whole cents, so the plan never allows more than the price covers.
const cents = (dollars: number) => Math.max(Math.floor(dollars * 100) / 100, 0.01);

// "Safe" budgets: even a user who uses up every weekly window all month costs
// at most price × (1 − margin). The 5-hour session is a slice of the week,
// like Claude Code's, and premium models may use only part of the week.
function budgetsFor(p: PlanPricing): CalculatedBudgets {
  const monthly = (p.monthlyPriceInr * (1 - p.marginPercent / 100)) / p.inrPerUsd;
  const weekly = monthly / WEEKS_PER_MONTH;
  return {
    monthly,
    weekly: cents(weekly),
    session: cents(weekly / p.sessionsPerWeek),
    premiumWeekly: cents((weekly * p.premiumSharePercent) / 100),
  };
}

const DEFAULT_PRICING: PlanPricing = {
  monthlyPriceInr: 1699,
  marginPercent: 40,
  inrPerUsd: 88,
  sessionsPerWeek: 8,
  premiumSharePercent: 50,
};

const FIELDS: { key: keyof PlanPricing; label: string; prefix?: string; suffix?: string; hint: string }[] = [
  { key: "monthlyPriceInr", label: "Monthly price", prefix: "₹", hint: "What the user pays" },
  { key: "marginPercent", label: "Your margin", suffix: "%", hint: "Kept even if they use everything" },
  { key: "inrPerUsd", label: "₹ per $1", prefix: "₹", hint: "Providers bill in dollars" },
  { key: "sessionsPerWeek", label: "Sessions per week", hint: "Full 5-hour sessions a week allows" },
  { key: "premiumSharePercent", label: "Premium share", suffix: "%", hint: "Of the week, for premium models" },
];

interface PricingCalculatorProps {
  initial: PlanPricing | null | undefined;
  onApply: (pricing: PlanPricing, budgets: CalculatedBudgets) => void;
}

// Works out a paid plan's 5-hour, weekly and premium budgets from its price.
export default function PricingCalculator({ initial, onApply }: PricingCalculatorProps) {
  const [values, setValues] = useState<Record<keyof PlanPricing, string>>(() => {
    const start = initial ?? DEFAULT_PRICING;
    return Object.fromEntries(
      Object.entries(start).map(([key, value]) => [key, String(value)]),
    ) as Record<keyof PlanPricing, string>;
  });

  const pricing = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Number(value)]),
  ) as unknown as PlanPricing;
  const valid =
    pricing.monthlyPriceInr > 0 &&
    pricing.marginPercent >= 0 &&
    pricing.marginPercent <= 90 &&
    pricing.inrPerUsd > 0 &&
    pricing.sessionsPerWeek >= 1 &&
    pricing.sessionsPerWeek <= 34 &&
    pricing.premiumSharePercent >= 0 &&
    pricing.premiumSharePercent <= 100;
  const budgets = valid ? budgetsFor(pricing) : null;
  const inr = (dollars: number) => `₹${Math.round(dollars * pricing.inrPerUsd).toLocaleString()}`;

  return (
    <section className={styles.root} aria-labelledby="calculator-title">
      <div>
        <h3 id="calculator-title" className={styles.title}>Work out budgets from the price</h3>
        <p className={styles.description}>
          Safe by design: even a user who uses up every week all month costs you at most
          the price minus your margin. Like Claude Code, the 5-hour session is a slice of
          the week, and premium models get only part of the week.
        </p>
      </div>
      <div className={styles.fields}>
        {FIELDS.map((field) => (
          <label key={field.key} className={styles.field}>
            <span className={styles.label}>{field.label}</span>
            <span className={styles.inputWrap}>
              {field.prefix && <span className={styles.prefix}>{field.prefix}</span>}
              <input
                className={styles.input(Boolean(field.prefix))}
                inputMode="decimal"
                value={values[field.key]}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.key]: event.target.value.replace(/[^\d.]/g, ""),
                  }))
                }
              />
              {field.suffix && <span className={styles.suffix}>{field.suffix}</span>}
            </span>
            <span className={styles.hint}>{field.hint}</span>
          </label>
        ))}
      </div>

      {budgets ? (
        <div className={styles.result}>
          <dl className={styles.numbers}>
            <div>
              <dt>Per 5-hour session</dt>
              <dd>${budgets.session.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Per week (all models)</dt>
              <dd>${budgets.weekly.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Per week (premium models)</dt>
              <dd>${budgets.premiumWeekly.toFixed(2)}</dd>
            </div>
            <div>
              <dt>Most a user can cost you a month</dt>
              <dd>
                ${budgets.monthly.toFixed(2)} <span className={styles.inr}>({inr(budgets.monthly)})</span>
              </dd>
            </div>
          </dl>
          <button
            type="button"
            className={styles.apply}
            onClick={() => onApply(pricing, budgets)}
          >
            <span className="material-symbols-outlined text-[18px]">calculate</span>
            Use these budgets
          </button>
        </div>
      ) : (
        <p className={styles.invalid}>
          Check the numbers: margin 0–90%, sessions 1–34, premium share 0–100%.
        </p>
      )}
    </section>
  );
}
