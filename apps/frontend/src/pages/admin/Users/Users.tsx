import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AdminUserRow } from "@nakka/types/admin";
import { adminApi } from "../../../api/admin";
import { useApiData } from "../../../api-hooks/useApiData";
import DataTable, { type Column } from "../../../components/DataTable";
import PlanBadge from "../../../components/PlanBadge";
import { formatDate, formatNumber, formatRelative } from "../../../utils/format";
import { styles } from "./Users.style";

const PAGE_SIZE = 25;

const columns: Column<AdminUserRow>[] = [
  {
    header: "User",
    cell: (user) => (
      <span className={styles.identity}>
        <span className={styles.avatar} aria-hidden="true">
          {(user.name || user.email).charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className={styles.name}>{user.name || user.username}</span>
          <span className={styles.email}>{user.email}</span>
        </span>
      </span>
    ),
  },
  {
    header: "Plan",
    cell: (user) => (
      <span className="inline-flex flex-col items-start gap-0.5">
        <PlanBadge planId={user.planId} name={user.planName} />
        {user.planEndsAt && <span className={styles.muted}>until {formatDate(user.planEndsAt)}</span>}
      </span>
    ),
  },
  { header: "Signs in with", cell: (user) => user.signedInWith, hideOnMobile: true },
  { header: "Joined", cell: (user) => formatDate(user.createdAt), hideOnMobile: true },
  {
    header: "Last active",
    cell: (user) => (user.lastActiveAt ? formatRelative(user.lastActiveAt) : "Never"),
    align: "right",
    hideOnMobile: true,
  },
];

// Everyone who has signed up, newest first. Search, then open a user to change their plan.
export default function Users() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const [draft, setDraft] = useState(search);

  // Search as you type, a moment after the last keystroke.
  useEffect(() => {
    if (draft.trim() === search) return;
    const timer = setTimeout(() => {
      setParams(draft.trim() ? { q: draft.trim() } : {}, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [draft, search, setParams]);

  const { data, error, loading } = useApiData(
    () => adminApi.users(search, page, PAGE_SIZE),
    [search, page],
  );
  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const goTo = (next: number) =>
    setParams({ ...(search ? { q: search } : {}), ...(next > 1 ? { page: String(next) } : {}) });

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <label className={styles.searchBox}>
          <span className="material-symbols-outlined text-[20px] text-outline">search</span>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search by email, username or name"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Search users"
          />
        </label>
        {data && (
          <p className={styles.muted}>
            {formatNumber(data.total)} {data.total === 1 ? "user" : "users"}
            {search ? ` matching "${search}"` : ""}
          </p>
        )}
      </div>

      {error && <p className={styles.pageError}>{error}</p>}
      <section className={styles.card} aria-label="Users" aria-busy={loading}>
        {!data && !error ? (
          <p className={styles.loading}>
            <span className={styles.loadingIcon}>progress_activity</span>
            Loading users…
          </p>
        ) : (
          data && (
            <DataTable
              columns={columns}
              rows={data.items}
              rowKey={(user) => user.id}
              empty={search ? "No users match that search." : "No one has signed up yet."}
              onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
            />
          )
        )}
        {data && pages > 1 && (
          <div className={styles.pager}>
            <button type="button" className={styles.secondaryButton} disabled={page <= 1 || loading} onClick={() => goTo(page - 1)}>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              Previous
            </button>
            <span className={styles.muted}>
              Page {page} of {pages}
            </span>
            <button type="button" className={styles.secondaryButton} disabled={page >= pages || loading} onClick={() => goTo(page + 1)}>
              Next
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
