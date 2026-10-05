import { useState } from "react";
import { Link } from "react-router-dom";
import type { CostedModel, TopUser } from "@nakka/types/admin";
import { adminApi } from "../../../api/admin";
import { useApiData } from "../../../api-hooks/useApiData";
import BarChart from "../../../components/BarChart";
import DataTable, { type Column } from "../../../components/DataTable";
import SegmentedControl from "../../../components/SegmentedControl";
import StatTile from "../../../components/StatTile";
import { PROVIDER_INFO } from "../../../constants/providers";
import { formatDay, formatNumber, formatUsd } from "../../../utils/format";
import { styles } from "./Usage.style";

type Preset = "7" | "30" | "90" | "custom";

const DAY = 86_400_000;
const isoDay = (date: Date) => date.toISOString().slice(0, 10);
const lastDays = (days: number) => ({
  from: isoDay(new Date(Date.now() - (days - 1) * DAY)),
  to: isoDay(new Date()),
});

const modelColumns: Column<CostedModel>[] = [
  { header: "Model", cell: (row) => <span className={styles.strong}>{row.modelId}</span> },
  { header: "Provider", cell: (row) => PROVIDER_INFO[row.provider]?.name ?? row.provider, hideOnMobile: true },
  { header: "Requests", cell: (row) => formatNumber(row.requests), align: "right" },
  { header: "Tokens in", cell: (row) => formatNumber(row.inputTokens, { short: true }), align: "right", hideOnMobile: true },
  { header: "Tokens out", cell: (row) => formatNumber(row.outputTokens, { short: true }), align: "right", hideOnMobile: true },
  { header: "API cost", cell: (row) => formatUsd(row.costMicros), align: "right" },
];

const userColumns: Column<TopUser>[] = [
  {
    header: "User",
    cell: (row) => (
      <Link to={`/admin/users/${row.userId}`} className={styles.link}>
        {row.email}
      </Link>
    ),
  },
  { header: "Requests", cell: (row) => formatNumber(row.requests), align: "right" },
  { header: "Tokens out", cell: (row) => formatNumber(row.outputTokens, { short: true }), align: "right", hideOnMobile: true },
  { header: "API cost", cell: (row) => formatUsd(row.costMicros), align: "right" },
];

// Traffic across all users: totals, per day, per model and provider, top users.
export default function Usage() {
  const [preset, setPreset] = useState<Preset>("30");
  const [range, setRange] = useState(() => lastDays(30));
  const { data, error, loading } = useApiData(
    () => adminApi.usage(range.from, range.to),
    [range.from, range.to],
  );

  const choose = (next: Preset) => {
    setPreset(next);
    if (next !== "custom") setRange(lastDays(Number(next)));
  };
  const providerMax = Math.max(1, ...(data?.byProvider.map((row) => row.costMicros) ?? [0]));

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <p className={styles.intro}>Every request through Nakka, across all users. Days are UTC.</p>
        <SegmentedControl
          label="Period"
          value={preset}
          onChange={choose}
          options={[
            { value: "7", label: "7 days" },
            { value: "30", label: "30 days" },
            { value: "90", label: "90 days" },
            { value: "custom", label: "Custom" },
          ]}
        />
      </div>

      {preset === "custom" && (
        <div className={styles.custom}>
          <label className={styles.dateField}>
            From
            <input type="date" className={styles.dateInput} value={range.from} max={range.to}
              onChange={(event) => event.target.value && setRange((r) => ({ ...r, from: event.target.value }))} />
          </label>
          <label className={styles.dateField}>
            To
            <input type="date" className={styles.dateInput} value={range.to} min={range.from} max={isoDay(new Date())}
              onChange={(event) => event.target.value && setRange((r) => ({ ...r, to: event.target.value }))} />
          </label>
        </div>
      )}

      {error && <p className={styles.pageError}>{error}</p>}
      {!data && !error && (
        <p className={styles.loading}>
          <span className={styles.loadingIcon}>progress_activity</span>
          Loading usage…
        </p>
      )}

      {data && (
        <div className={styles.results(loading)}>
          <div className={styles.stats}>
            <StatTile icon="bolt" label="Requests" value={formatNumber(data.totals.requests)} hint={`${formatDay(data.from)} – ${formatDay(data.to)}`} />
            <StatTile icon="input" label="Tokens in" value={formatNumber(data.totals.inputTokens, { short: true })} />
            <StatTile icon="output" label="Tokens out" value={formatNumber(data.totals.outputTokens, { short: true })} />
            <StatTile icon="payments" label="API cost" value={formatUsd(data.totals.costMicros)} hint="What providers charge you" />
          </div>

          <section className={styles.card} aria-labelledby="admin-daily-title">
            <div className={styles.header}>
              <h2 id="admin-daily-title" className={styles.title}>Requests per day</h2>
            </div>
            <BarChart
              unit="requests"
              data={data.daily.map((day) => ({
                label: formatDay(day.date),
                value: day.requests,
                detail: `${formatDay(day.date)} · ${formatNumber(day.requests)} requests · ${formatUsd(day.costMicros)}`,
              }))}
            />
          </section>

          <div className={styles.split}>
            <section className={styles.card} aria-labelledby="by-model-title">
              <div className={styles.header}>
                <h2 id="by-model-title" className={styles.title}>By model</h2>
              </div>
              <DataTable columns={modelColumns} rows={data.byModel} rowKey={(row) => `${row.provider}/${row.modelId}`} empty="No requests in this period." />
            </section>

            <section className={styles.card} aria-labelledby="by-provider-title">
              <div className={styles.header}>
                <h2 id="by-provider-title" className={styles.title}>By provider</h2>
              </div>
              {data.byProvider.length ? (
                <ul className={styles.providers}>
                  {data.byProvider.map((row) => (
                    <li key={row.provider} className={styles.provider}>
                      <div className={styles.providerTop}>
                        <span className={styles.strong}>{PROVIDER_INFO[row.provider]?.name ?? row.provider}</span>
                        <span className={styles.muted}>
                          {formatUsd(row.costMicros)} · {formatNumber(row.requests)} requests
                        </span>
                      </div>
                      <div className={styles.track}>
                        <div className={styles.fill} style={{ width: `${(row.costMicros / providerMax) * 100}%`, background: PROVIDER_INFO[row.provider]?.color }} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.muted}>No requests in this period.</p>
              )}
            </section>
          </div>

          <section className={styles.card} aria-labelledby="top-users-title">
            <div className={styles.header}>
              <h2 id="top-users-title" className={styles.title}>Top users</h2>
              <p className={styles.description}>The 10 users with the most requests in this period, and what they cost you.</p>
            </div>
            <DataTable columns={userColumns} rows={data.topUsers} rowKey={(row) => row.userId} empty="No requests in this period." />
          </section>
        </div>
      )}
    </div>
  );
}
