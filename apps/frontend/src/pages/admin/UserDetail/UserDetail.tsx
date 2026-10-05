import { Link, useParams } from "react-router-dom";
import type { CostedModel } from "@nakka/types/admin";
import { adminApi } from "../../../api/admin";
import { useApiData } from "../../../api-hooks/useApiData";
import BarChart from "../../../components/BarChart";
import DataTable, { type Column } from "../../../components/DataTable";
import StatTile from "../../../components/StatTile";
import UsageMeter from "../../../components/UsageMeter";
import { PROVIDER_INFO } from "../../../constants/providers";
import { formatDate, formatDay, formatNumber, formatRelative, formatUsd } from "../../../utils/format";
import ChangePlanCard from "./ChangePlanCard";
import { styles } from "./UserDetail.style";

const modelColumns: Column<CostedModel>[] = [
  { header: "Model", cell: (row) => <span className={styles.strong}>{row.modelId}</span> },
  { header: "Provider", cell: (row) => PROVIDER_INFO[row.provider]?.name ?? row.provider, hideOnMobile: true },
  { header: "Requests", cell: (row) => formatNumber(row.requests), align: "right" },
  { header: "Tokens out", cell: (row) => formatNumber(row.outputTokens, { short: true }), align: "right", hideOnMobile: true },
  { header: "API cost", cell: (row) => formatUsd(row.costMicros), align: "right" },
];

// One user: who they are, their plan (changeable) and the last 30 days of usage.
export default function UserDetail() {
  const { userId = "" } = useParams();
  const user = useApiData(() => adminApi.user(userId), [userId]);
  const plans = useApiData(() => adminApi.plans(), []);
  const data = user.data;

  return (
    <div className={styles.page}>
      <Link to="/admin/users" className={styles.back}>
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        All users
      </Link>

      {user.error && <p className={styles.pageError}>{user.error}</p>}
      {!data && !user.error && (
        <p className={styles.loading}>
          <span className={styles.loadingIcon}>progress_activity</span>
          Loading user…
        </p>
      )}

      {data && (
        <>
          <section className={styles.profile} aria-labelledby="user-name">
            <span className={styles.avatar} aria-hidden="true">
              {(data.name || data.email).charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="user-name" className={styles.name}>{data.name || data.username}</h2>
              <p className={styles.email}>{data.email}</p>
            </div>
            <dl className={styles.facts}>
              <div><dt className={styles.factLabel}>Username</dt><dd>@{data.username}</dd></div>
              <div><dt className={styles.factLabel}>Signs in with</dt><dd>{data.signedInWith}</dd></div>
              <div><dt className={styles.factLabel}>Joined</dt><dd>{formatDate(data.createdAt)}</dd></div>
              <div><dt className={styles.factLabel}>Last active</dt><dd>{data.lastActiveAt ? formatRelative(data.lastActiveAt) : "Never"}</dd></div>
            </dl>
          </section>

          <div className={styles.split}>
            {plans.data ? (
              <ChangePlanCard
                user={data}
                plans={plans.data}
                onChanged={(updated) => user.setData(updated)}
              />
            ) : (
              <p className={plans.error ? styles.pageError : styles.loading}>
                {plans.error || "Loading plans…"}
              </p>
            )}

            <section className={styles.card} aria-labelledby="allowance-title">
              <div className={styles.header}>
                <h2 id="allowance-title" className={styles.title}>Allowance right now</h2>
                <p className={styles.description}>
                  The user sees the percentages; the dollar amounts are what their requests cost you.
                </p>
              </div>
              {data.windows.length ? (
                <div className={styles.meters}>
                  {data.windows.map((usageWindow) => (
                    <UsageMeter
                      key={usageWindow.id}
                      usage={usageWindow}
                      detail={`${formatUsd(usageWindow.spentMicros)} of ${formatUsd(usageWindow.limitMicros)}`}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.muted}>This plan has no limits.</p>
              )}
            </section>
          </div>

          <div className={styles.stats}>
            <StatTile icon="bolt" label="Requests" value={formatNumber(data.last30Days.requests)} hint="Last 30 days" />
            <StatTile icon="input" label="Tokens sent" value={formatNumber(data.last30Days.inputTokens, { short: true })} />
            <StatTile icon="output" label="Tokens received" value={formatNumber(data.last30Days.outputTokens, { short: true })} />
            <StatTile icon="payments" label="API cost" value={formatUsd(data.last30Days.costMicros)} hint="What this user cost you" />
          </div>

          <section className={styles.card} aria-labelledby="user-daily-title">
            <div className={styles.header}>
              <h2 id="user-daily-title" className={styles.title}>Requests per day</h2>
              <p className={styles.description}>Last 30 days, UTC.</p>
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

          <section className={styles.card} aria-labelledby="user-models-title">
            <div className={styles.header}>
              <h2 id="user-models-title" className={styles.title}>By model</h2>
            </div>
            <DataTable
              columns={modelColumns}
              rows={data.byModel}
              rowKey={(row) => row.modelId}
              empty="No requests in the last 30 days."
            />
          </section>
        </>
      )}
    </div>
  );
}
