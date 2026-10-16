import type { BillingCycle, BillingSummary, PublicPricing } from "@nakka/types/billing";
import { download, request } from "./http";
import { tokenStore } from "./session";

export interface CheckoutOrder {
  keyId: string;
  orderId: string;
  amount: number;
  currency: "INR";
  name: string;
  description: string;
  email: string;
}

export const billingApi = {
  // Pro's price, shown on the public pricing page.
  pricing: () => request<PublicPricing>("/billing/pricing"),
  summary: () => request<BillingSummary>("/billing", { token: tokenStore.get() ?? undefined }),
  checkout: (cycle: BillingCycle) => request<CheckoutOrder>("/billing/checkout", {
    method: "POST", token: tokenStore.get() ?? undefined, body: JSON.stringify({ cycle }),
  }),
  verify: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    request<{ success: true; accessUntil: string }>("/billing/verify", {
      method: "POST", token: tokenStore.get() ?? undefined, body: JSON.stringify(data),
    }),
  downloadInvoice: (paymentId: string) =>
    download(`/billing/payments/${encodeURIComponent(paymentId)}/invoice`, "nakka-invoice.pdf", tokenStore.get() ?? undefined),
};
