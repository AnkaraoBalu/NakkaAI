import { useState } from "react";
import type { ModelUsage } from "@nakka/types/usage";
import { useUsage } from "../../../api-hooks/usage";
import type { UsageDays } from "../../../api/usage";
import BarChart from "../../../components/BarChart";
import DataTable, { type Column } from "../../../components/DataTable";
import SegmentedControl from "../../../components/SegmentedControl";
import StatTile from "../../../components/StatTile";
import { PROVIDER_INFO } from "../../../constants/providers";
import { formatDay, formatNumber } from "../../../utils/format";
import PlanCard from "../PlanCard";
import { styles } from "./Usage.style";

const RANGES: { value: UsageDays; label: string }[] = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
];

const modelColumns: Column<ModelUsage>[] = [
  {
    header: "Model",
    cell: (row) => <span className={styles.mono}>{row.modelId}</span>,
  },
  {
    header: "Provider",
    cell: (row) => PROVIDER_INFO[row.provider]?.name ?? row.provider,
    hideOnMobile: true,
  },
  { header: "Requests", cell: (row) => formatNumber(row.requests), align: "right" },
  {
    header: "Tokens in",
    cell: (row) => formatNumber(row.inputTokens, { short: true }),
    align: "right",
    hideOnMobile: true,
  },
  {
    header: "Tokens out",
    cell: (row) => formatNumber(row.outputTokens, { short: true }),
    align: "right",
  },
];

export default function Usage() {
  const [days, setDays] = useState<UsageDays>(30);
  const { data, error, loading, refresh } = useUsage(days);

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <p className={styles.intro}>
          Your allowance, the models on your plan, and every request you've made.
        </p>
        <div className={styles.actions}>
          <SegmentedControl label="Period" options={RANGES} value={days} onChange={setDays} />
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

      {data && (
        <>
          <PlanCard usage={data} />

          <div className={styles.stats}>
            <StatTile icon="bolt" label="Requests" value={formatNumber(data.totals.requests)} hint={`Last ${data.days} days`} />
            <StatTile icon="input" label="Tokens sent" value={formatNumber(data.totals.inputTokens, { short: true })} />
            <StatTile icon="output" label="Tokens received" value={formatNumber(data.totals.outputTokens, { short: true })} />
            <StatTile icon="cached" label="Cached tokens" value={formatNumber(data.totals.cacheReadTokens, { short: true })} hint="Read from cache, cheaper" />
          </div>

          <section className={styles.card} aria-labelledby="daily-title">
            <div className={styles.header}>
              <h2 id="daily-title" className={styles.title}>Requests per day</h2>
              <p className={styles.description}>Days are in UTC.</p>
            </div>
            <BarChart
              unit="requests"
              data={data.daily.map((day) => ({
                label: formatDay(day.date),
                value: day.requests,
                detail: `${formatDay(day.date)} · ${formatNumber(day.requests)} requests · ${formatNumber(day.inputTokens + day.outputTokens, { short: true })} tokens`,
              }))}
            />
          </section>

          <div className={styles.split}>
            <section className={styles.card} aria-labelledby="models-used-title">
              <div className={styles.header}>
                <h2 id="models-used-title" className={styles.title}>By model</h2>
                <p className={styles.description}>What you used in the last {data.days} days.</p>
              </div>
              <DataTable
                columns={modelColumns}
                rows={data.byModel}
                rowKey={(row) => row.modelId}
                empty="No requests yet. Start a session in VS Code."
              />
            </section>

            <section className={styles.card} aria-labelledby="plan-models-title">
              <div className={styles.header}>
                <h2 id="plan-models-title" className={styles.title}>Models on your plan</h2>
                <p className={styles.description}>Pick these in the VS Code model menu.</p>
              </div>
              {data.models.length ? (
                <ul className={styles.models}>
                  {data.models.map((model) => (
                    <li key={model.id} className={styles.model}>
                      <span
                        className={styles.dot}
                        style={{ background: PROVIDER_INFO[model.provider]?.color }}
                        aria-hidden="true"
                      />
                      <span className={styles.mono}>{model.id}</span>
                      <span className={styles.provider}>
                        {PROVIDER_INFO[model.provider]?.name ?? model.provider}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.description}>No models are on this plan yet.</p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
