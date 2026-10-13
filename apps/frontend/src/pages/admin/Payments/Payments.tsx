import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AdminPaymentRow } from "@nakka/types/admin";
import { adminApi } from "../../../api/admin";
import { useApiData } from "../../../api-hooks/useApiData";
import DataTable, { type Column } from "../../../components/DataTable";
import SegmentedControl from "../../../components/SegmentedControl";
import StatTile from "../../../components/StatTile";
import { formatDate, formatDateTime, formatNumber } from "../../../utils/format";
import { styles } from "./Payments.style";

const PAGE_SIZE = 25;

type StatusFilter = "" | "paid" | "failed" | "pending";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "", label: "All" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
];

const money = (paise: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(paise / 100);

const columns: Column<AdminPaymentRow>[] = [
  {
    header: "User",
    cell: (payment) => (
      <span className={styles.identity}>
        <span className={styles.avatar} aria-hidden="true">
          {(payment.name || payment.email).charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className={styles.name}>{payment.name || payment.email}</span>
          <span className={styles.email}>{payment.email}</span>
        </span>
      </span>
    ),
  },
  {
    header: "Plan",
    cell: (payment) => (
      <span className="min-w-0">
        <span className={styles.name}>Pro · {payment.cycle === "yearly" ? "Yearly" : "Monthly"}</span>
        <span className={styles.reference}>{payment.paymentId ?? payment.orderId ?? "No order yet"}</span>
      </span>
    ),
    hideOnMobile: true,
  },
  { header: "Amount", cell: (payment) => money(payment.amountPaise) },
  { header: "Method", cell: (payment) => <span className="capitalize">{payment.method ?? "—"}</span>, hideOnMobile: true },
  { header: "Date", cell: (payment) => formatDateTime(payment.paidAt ?? payment.createdAt), hideOnMobile: true },
  { header: "Status", cell: (payment) => <span className={styles.status(payment.status)}>{payment.status}</span> },
  {
    header: "Access until",
    cell: (payment) => (payment.accessUntil ? formatDate(payment.accessUntil) : "—"),
    align: "right",
    hideOnMobile: true,
  },
];

// Every Razorpay payment, newest first, with who made it. Open a row to see that user.
export default function Payments() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const rawStatus = params.get("status") ?? "";
  const status: StatusFilter = STATUS_OPTIONS.some((option) => option.value === rawStatus)
    ? (rawStatus as StatusFilter)
    : "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const [draft, setDraft] = useState(search);

  const update = (next: { q?: string; status?: StatusFilter; page?: number }) => {
    const q = next.q ?? search;
    const s = next.status ?? status;
    const p = next.page ?? 1;
    setParams({ ...(q ? { q } : {}), ...(s ? { status: s } : {}), ...(p > 1 ? { page: String(p) } : {}) });
  };

  // Search as you type, a moment after the last keystroke.
  useEffect(() => {
    if (draft.trim() === search) return;
    const timer = setTimeout(() => update({ q: draft.trim() }), 300);
    return () => clearTimeout(timer);
  });

  const { data, error, loading } = useApiData(
    () => adminApi.payments(search, status, page, PAGE_SIZE),
    [search, status, page],
  );
  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const totals = data?.totals;

  return (
    <div className={styles.page}>
      {totals && (
        <div className={styles.stats}>
          <StatTile icon="payments" label="Revenue" value={money(totals.revenuePaise)} hint={`${money(totals.revenueLast30DaysPaise)} in the last 30 days`} />
          <StatTile icon="group" label="Paying users" value={formatNumber(totals.payingUsers)} />
          <StatTile icon="check_circle" label="Paid payments" value={formatNumber(totals.paid)} />
          <StatTile icon="error" label="Failed / pending" value={`${formatNumber(totals.failed)} / ${formatNumber(totals.pending)}`} hint="Pending means checkout opened but not completed." />
        </div>
      )}

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <label className={styles.searchBox}>
            <span className="material-symbols-outlined text-[20px] text-outline">search</span>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Search by email, name or payment id"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              aria-label="Search payments"
            />
          </label>
          <SegmentedControl label="Payment status" options={STATUS_OPTIONS} value={status} onChange={(next) => update({ status: next })} />
        </div>
        {data && (
          <p className={styles.muted}>
            {formatNumber(data.total)} {data.total === 1 ? "payment" : "payments"}
            {search ? ` matching "${search}"` : ""}
          </p>
        )}
      </div>

      {error && <p className={styles.pageError}>{error}</p>}
      <section className={styles.card} aria-label="Payments" aria-busy={loading}>
        {!data && !error ? (
          <p className={styles.loading}>
            <span className={styles.loadingIcon}>progress_activity</span>
            Loading payments…
          </p>
        ) : (
          data && (
            <DataTable
              columns={columns}
              rows={data.items}
              rowKey={(payment) => payment.id}
              empty={search || status ? "No payments match these filters." : "No payments yet."}
              onRowClick={(payment) => navigate(`/admin/users/${payment.userId}`)}
            />
          )
        )}
        {data && pages > 1 && (
          <div className={styles.pager}>
            <button type="button" className={styles.secondaryButton} disabled={page <= 1 || loading} onClick={() => update({ page: page - 1 })}>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              Previous
            </button>
            <span className={styles.muted}>
              Page {page} of {pages}
            </span>
            <button type="button" className={styles.secondaryButton} disabled={page >= pages || loading} onClick={() => update({ page: page + 1 })}>
              Next
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
