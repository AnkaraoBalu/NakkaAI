import { useCallback, useEffect, useState } from "react";
import type { BillingCycle, BillingSummary, BillingPayment } from "@nakka/types/billing";
import { billingApi, type CheckoutOrder } from "../../api/billing";
import { useAuth } from "../../api-hooks/auth";
import { usageChanged } from "../../api-hooks/usage";
import { LEGAL_CONTACT_EMAIL } from "../../constants/legal";
import { formatDate } from "../../utils/format";

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string; amount: number; currency: string; name: string; description: string;
      order_id: string; prefill: { email: string };
      handler: (result: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void | Promise<void>;
      modal: { ondismiss: () => void };
    }) => { open: () => void; on: (event: string, handler: (detail: { error?: { description?: string } }) => void) => void };
  }
}

const loadCheckout = () => new Promise<void>((resolve, reject) => {
  if (window.Razorpay) return resolve();
  const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay="checkout"]');
  if (existing) {
    existing.addEventListener("load", () => resolve(), { once: true });
    existing.addEventListener("error", () => reject(new Error("Could not load the payment form.")), { once: true });
    return;
  }
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.dataset.razorpay = "checkout";
  script.onload = () => resolve();
  script.onerror = () => reject(new Error("Could not load the payment form."));
  document.body.appendChild(script);
});

const money = (paise: number) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(paise / 100);

const dateTime = (date: string) => new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium", timeStyle: "short",
}).format(new Date(date));

function PaymentRow({ payment }: { payment: BillingPayment }) {
  const state = payment.status;
  return (
    <tr className="border-t border-outline-variant/40 text-on-surface">
      <td className="px-4 py-4">
        <p className="font-medium">Pro · {payment.cycle === "yearly" ? "Yearly" : "Monthly"}</p>
        <p className="mt-1 text-xs text-on-surface-variant">{payment.paymentId ?? payment.orderId ?? "Payment pending"}</p>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">{money(payment.amountPaise)}</td>
      <td className="px-4 py-4 capitalize">{payment.method ?? "—"}</td>
      <td className="px-4 py-4 whitespace-nowrap">{dateTime(payment.paidAt ?? payment.createdAt)}</td>
      <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${state === "paid" ? "bg-emerald-100 text-emerald-800" : state === "failed" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{state}</span></td>
      <td className="px-4 py-4 whitespace-nowrap">{payment.accessUntil ? formatDate(payment.accessUntil) : "—"}</td>
    </tr>
  );
}

export default function Billing() {
  const { user } = useAuth();
  const [data, setData] = useState<BillingSummary | null>(null);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const result = await billingApi.summary();
    setData(result);
  }, []);

  useEffect(() => {
    void refresh().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load billing details."))
      .finally(() => setLoading(false));
  }, [refresh]);

  const startCheckout = async () => {
    setPaying(true);
    setError(null);
    setNotice(null);
    try {
      const order: CheckoutOrder = await billingApi.checkout(cycle);
      await loadCheckout();
      if (!window.Razorpay) throw new Error("Payment form is unavailable. Please refresh and try again.");
      const checkout = new window.Razorpay({
        key: order.keyId, amount: order.amount, currency: order.currency,
        name: order.name, description: order.description, order_id: order.orderId,
        prefill: { email: user?.email ?? order.email },
        handler: async (result) => {
          try {
            await billingApi.verify(result);
            usageChanged();
            await refresh();
            setNotice("Payment confirmed. Your Pro plan is active.");
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Payment confirmation is pending. Refresh in a moment.");
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      checkout.on("payment.failed", (detail) => {
        setError(detail.error?.description ?? "Payment failed. Please try again.");
        setPaying(false);
      });
      checkout.open();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not start payment.");
      setPaying(false);
    }
  };

  if (loading) return <p className="flex items-center gap-2 text-on-surface-variant"><span className="material-symbols-outlined animate-spin">progress_activity</span>Loading billing details…</p>;

  const amount = data?.prices ? (cycle === "monthly" ? data.prices.monthlyPaise : data.prices.yearlyPaise) : null;
  const isPro = data?.plan.id === "pro";
  const lastPaidExpiry = data?.payments.find((payment) => payment.status === "paid")?.accessUntil ?? null;
  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <p className="text-on-surface-variant">Manage your Pro plan and view your payment records.</p>
      {error && <p role="alert" className="rounded-xl bg-error-container/60 p-3 text-on-error-container">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-[#e6fcf5] p-3 text-[#087f5b]">{notice}</p>}

      <section className="rounded-2xl border border-outline-variant/50 bg-surface-container-low p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-outline">Current plan</p>
            <h2 className="mt-2 text-2xl font-semibold text-on-surface">{data?.plan.name ?? "Free"}</h2>
            <p className="mt-2 text-sm text-on-surface-variant">{data?.plan.endsAt ? `Access through ${formatDate(data.plan.endsAt)}. Your plan returns to Free after this date.` : isPro ? "Your Pro plan has no scheduled expiry." : lastPaidExpiry ? `You’re currently on Free. Your last Pro access ended ${formatDate(lastPaidExpiry)}.` : "You’re currently on the Free plan."}</p>
          </div>
          <span className="rounded-full bg-primary-container px-3 py-1 text-sm font-semibold text-on-primary-container">{isPro ? "Active" : "Free"}</span>
        </div>
      </section>

      <section className="rounded-2xl border border-outline-variant/50 bg-surface p-5 sm:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-outline">Upgrade</p>
          <h2 className="mt-2 text-xl font-semibold text-on-surface">Get NakkaAI Pro</h2>
          <p className="mt-2 text-sm text-on-surface-variant">Secure one-time payment through Razorpay. Your plan will not auto-renew.</p>
        </div>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-fit rounded-xl bg-surface-container-low p-1" role="group" aria-label="Billing period">
            {(["monthly", "yearly"] as const).map((option) => (
              <button key={option} type="button" onClick={() => setCycle(option)} aria-pressed={cycle === option} className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${cycle === option ? "bg-surface text-on-surface shadow-sm" : "text-on-surface-variant"}`}>{option}</button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {amount !== null && <p className="text-xl font-semibold text-on-surface">{money(amount)} <span className="text-sm font-normal text-on-surface-variant">/ {cycle === "monthly" ? "month" : "year"}</span></p>}
            <button type="button" disabled={!data?.checkoutEnabled || paying || !data.prices} onClick={() => void startCheckout()} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-50">
              <span className="material-symbols-outlined text-[18px]">{paying ? "progress_activity" : "lock"}</span>
              {paying ? "Opening checkout…" : isPro ? "Renew Pro" : "Continue to payment"}
            </button>
          </div>
        </div>
        {!data?.checkoutEnabled && <p className="mt-4 text-sm text-on-surface-variant">Online payment is not available yet. Please check back later.</p>}
      </section>

      <section className="overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface">
        <div className="flex items-start justify-between gap-4 p-5 sm:p-7"><div><h2 className="text-xl font-semibold text-on-surface">Payment history</h2><p className="mt-1 text-sm text-on-surface-variant">Payments, payment method and the Pro access period for each purchase.</p></div><button type="button" onClick={() => void refresh().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not refresh billing details."))} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary-container/40"><span className="material-symbols-outlined text-[18px]">refresh</span><span className="hidden sm:inline">Refresh</span></button></div>
        {!data?.payments.length ? <p className="border-t border-outline-variant/40 px-5 py-8 text-sm text-on-surface-variant sm:px-7">No payments yet.</p> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-surface-container-low text-xs uppercase tracking-wide text-outline"><tr><th className="px-4 py-3 font-semibold">Plan / reference</th><th className="px-4 py-3 font-semibold">Amount</th><th className="px-4 py-3 font-semibold">Method</th><th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Access until</th></tr></thead><tbody>{data.payments.map((payment) => <PaymentRow key={payment.id} payment={payment} />)}</tbody></table></div>
        )}
      </section>
      <p className="text-xs text-on-surface-variant">Questions about a charge? Contact <a className="underline" href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>.</p>
    </div>
  );
}
