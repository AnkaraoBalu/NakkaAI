import { Link } from "react-router-dom";
import { adminApi } from "../../../api/admin";
import { useApiData } from "../../../api-hooks/useApiData";
import BarChart from "../../../components/BarChart";
import StatTile from "../../../components/StatTile";
import { PROVIDER_INFO } from "../../../constants/providers";
import { formatDay, formatNumber, formatRelative, formatUsd } from "../../../utils/format";
import { describeAudit } from "../auditLabels";
import { styles } from "./Overview.style";

export default function Overview() {
  const { data, error } = useApiData(() => adminApi.overview(), []);

  if (error) return <p className={styles.pageError}>{error}</p>;
  if (!data) {
    return (
      <p className={styles.loading}>
        <span className={styles.loadingIcon}>progress_activity</span>
        Loading…
      </p>
    );
  }

  const configured = data.providers.filter((provider) => provider.configured);
  const week = data.last7Days.reduce((sum, day) => sum + day.requests, 0);
  const weekCost = data.last7Days.reduce((sum, day) => sum + day.costMicros, 0);

  return (
    <div className={styles.page}>
      {!configured.length && (
        <Link to="/admin/keys" className={styles.setup}>
          <span className="material-symbols-outlined text-[20px]">key</span>
          <span className="flex-1">
            No provider keys yet, so every model is unavailable. Add your first key.
          </span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      )}

      <div className={styles.stats}>
        <StatTile icon="group" label="Users" value={formatNumber(data.users.total)} hint={`+${formatNumber(data.users.newLast7Days)} in the last 7 days`} />
        <StatTile icon="workspace_premium" label="Paid users" value={formatNumber(data.users.paid)} hint={data.users.total ? `${Math.round((data.users.paid / data.users.total) * 100)}% of users` : undefined} />
        <StatTile icon="bolt" label="Requests today" value={formatNumber(data.today.requests)} hint={`${formatNumber(week)} in 7 days`} />
        <StatTile icon="payments" label="API cost today" value={formatUsd(data.today.costMicros)} hint={`${formatUsd(weekCost)} in 7 days`} />
      </div>

      <div className={styles.split}>
        <section className={styles.card} aria-labelledby="traffic-title">
          <div className={styles.cardHead}>
            <div className={styles.header}>
              <h2 id="traffic-title" className={styles.title}>Requests, last 7 days</h2>
              <p className={styles.description}>All users, UTC days.</p>
            </div>
            <Link to="/admin/usage" className={styles.link}>
              Usage <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <BarChart
            unit="requests"
            data={data.last7Days.map((day) => ({
              label: formatDay(day.date),
              value: day.requests,
              detail: `${formatDay(day.date)} · ${formatNumber(day.requests)} requests · ${formatUsd(day.costMicros)}`,
            }))}
          />
        </section>

        <section className={styles.card} aria-labelledby="providers-title">
          <div className={styles.cardHead}>
            <h2 id="providers-title" className={styles.title}>Providers</h2>
            <Link to="/admin/keys" className={styles.link}>
              API keys <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <ul className={styles.list}>
            {data.providers.map((provider) => {
              const state = !provider.configured
                ? { label: "No key", tone: "off" as const }
                : provider.lastCheckOk === false
                  ? { label: "Key failing", tone: "bad" as const }
                  : provider.lastCheckOk
                    ? { label: "Working", tone: "good" as const }
                    : { label: "Not tested", tone: "unknown" as const };
              return (
                <li key={provider.provider} className={styles.row}>
                  <span className={styles.dot} style={{ background: PROVIDER_INFO[provider.provider].color }} aria-hidden="true" />
                  <span className={styles.strong}>{PROVIDER_INFO[provider.provider].name}</span>
                  <span className={styles.status(state.tone)}>{state.label}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className={styles.split}>
        <section className={styles.card} aria-labelledby="top-title">
          <div className={styles.header}>
            <h2 id="top-title" className={styles.title}>Most active users</h2>
            <p className={styles.description}>Last 7 days, by API cost.</p>
          </div>
          {data.topUsers.length ? (
            <ol className={styles.list}>
              {data.topUsers.map((user, index) => (
                <li key={user.userId}>
                  <Link to={`/admin/users/${user.userId}`} className={styles.userRow}>
                    <span className={styles.rank}>{index + 1}</span>
                    <span className={styles.email}>{user.email}</span>
                    <span className={styles.muted}>{formatUsd(user.costMicros)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.muted}>No requests in the last 7 days.</p>
          )}
        </section>

        <section className={styles.card} aria-labelledby="activity-title">
          <div className={styles.header}>
            <h2 id="activity-title" className={styles.title}>Recent admin activity</h2>
          </div>
          {data.recentActivity.length ? (
            <ul className={styles.list}>
              {data.recentActivity.map((entry) => {
                const { icon, text } = describeAudit(entry);
                return (
                  <li key={entry.id} className={styles.activity}>
                    <span className={styles.activityIcon}>{icon}</span>
                    <span className="flex-1 min-w-0">
                      <span className={styles.strong}>{entry.adminName ?? "Removed admin"}</span>{" "}
                      <span className={styles.activityText}>{text}</span>
                    </span>
                    <span className={styles.time}>{formatRelative(entry.createdAt)}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.muted}>Nothing yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
