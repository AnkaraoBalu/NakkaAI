import {
  Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHmac, timingSafeEqual } from "node:crypto";
import { PlansRepository } from "../plans/plans.repository.js";
import { UsersRepository } from "../auth/users.repository.js";
import { BillingRepository, type BillingCycle } from "./billing.repository.js";
import { invoiceNumber, renderInvoice } from "./invoice-pdf.js";

const RAZORPAY_API = "https://api.razorpay.com/v1";
const hmac = (secret: string, value: string) => createHmac("sha256", secret).update(value).digest("hex");
const sameHex = (left: string, right: string) => {
  const a = Buffer.from(left, "hex");
  const b = Buffer.from(right, "hex");
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
};

@Injectable()
export class BillingService {
  constructor(
    private readonly config: ConfigService,
    private readonly plans: PlansRepository,
    private readonly users: UsersRepository,
    private readonly billing: BillingRepository,
  ) {}

  private credentials() {
    const keyId = this.config.get<string>("RAZORPAY_KEY_ID")?.trim();
    const secret = this.config.get<string>("RAZORPAY_KEY_SECRET")?.trim();
    if (!keyId || !secret) throw new ServiceUnavailableException("Online payments are not configured yet.");
    return { keyId, secret };
  }

  async summary(userId: string) {
    const [plan, allPlans, payments] = await Promise.all([
      this.plans.planFor(userId), this.plans.list(), this.billing.history(userId),
    ]);
    const pro = allPlans.find((candidate) => candidate.id === "pro");
    const monthlyRupees = Number(pro?.pricing?.monthlyPriceInr ?? 0);
    const pricingReady = Number.isFinite(monthlyRupees) && monthlyRupees >= 1;
    return {
      plan: { id: plan.id, name: plan.name, endsAt: plan.endsAt?.toISOString() ?? null },
      prices: pricingReady ? {
        monthlyPaise: Math.round(monthlyRupees * 100),
        yearlyPaise: Math.round(monthlyRupees * 12 * 0.8 * 100),
        currency: "INR" as const,
      } : null,
      checkoutEnabled: pricingReady && this.gatewayReady(),
      payments,
    };
  }

  async createCheckout(userId: string, cycle: BillingCycle) {
    const { keyId, secret } = this.credentials();
    if (!this.config.get<string>("RAZORPAY_WEBHOOK_SECRET")?.trim()) {
      throw new ServiceUnavailableException("Payment confirmation is not configured yet.");
    }
    const pro = (await this.plans.list()).find((candidate) => candidate.id === "pro");
    const monthlyRupees = Number(pro?.pricing?.monthlyPriceInr ?? 0);
    if (!Number.isFinite(monthlyRupees) || monthlyRupees < 1) {
      throw new ServiceUnavailableException("Pro pricing has not been configured yet.");
    }
    const amountPaise = Math.round(monthlyRupees * (cycle === "yearly" ? 12 * 0.8 : 1) * 100);
    const localId = await this.billing.createPending(userId, amountPaise, cycle);
    try {
      const response = await fetch(`${RAZORPAY_API}/orders`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountPaise, currency: "INR", receipt: localId,
          notes: { billing_payment_id: localId, user_id: userId, billing_cycle: cycle },
        }),
        signal: AbortSignal.timeout(12_000),
      });
      if (!response.ok) throw new Error("Razorpay could not create the order");
      const order = await response.json() as { id?: string; amount?: number; currency?: string };
      if (!order.id || order.amount !== amountPaise || order.currency !== "INR") throw new Error("Unexpected Razorpay order response");
      await this.billing.setOrder(localId, order.id);
      const user = await this.users.findById(userId);
      return {
        keyId, orderId: order.id, amount: amountPaise, currency: "INR",
        name: "NakkaAI Pro", description: cycle === "yearly" ? "Pro plan · yearly" : "Pro plan · monthly",
        email: user?.email ?? "",
      };
    } catch {
      await this.billing.failById(localId);
      throw new ServiceUnavailableException("Could not start checkout. Please try again.");
    }
  }

  async verifyPayment(userId: string, data: {
    razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string;
  }) {
    const { keyId, secret } = this.credentials();
    const expected = hmac(secret, `${data.razorpay_order_id}|${data.razorpay_payment_id}`);
    if (!sameHex(expected, data.razorpay_signature)) throw new UnauthorizedException("Payment signature is invalid.");
    const localOrder = await this.billing.orderForUser(userId, data.razorpay_order_id);
    if (!localOrder) throw new UnauthorizedException("This payment order does not belong to your account.");
    if (localOrder.status === "failed") throw new UnauthorizedException("This payment order has failed.");
    const headers = { Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}` };
    const paymentUrl = `${RAZORPAY_API}/payments/${encodeURIComponent(data.razorpay_payment_id)}`;
    let payment = await this.fetchPayment(paymentUrl, headers);
    if (payment.order_id !== data.razorpay_order_id || payment.currency !== "INR" || payment.amount !== localOrder.amountPaise) {
      throw new UnauthorizedException("Payment does not match this order.");
    }
    // Some Razorpay accounts return an authorized payment before auto-capture.
    // Capture it server-side, then read it again before granting Pro access.
    if (payment.status === "authorized") {
      if (!Number.isSafeInteger(payment.amount) || payment.amount! < 1) {
        throw new UnauthorizedException("Payment amount is invalid.");
      }
      const capture = await fetch(`${paymentUrl}/capture`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: payment.amount, currency: payment.currency }),
        signal: AbortSignal.timeout(12_000),
      });
      if (!capture.ok) {
        // The payment may have auto-captured between the read and capture call.
        payment = await this.fetchPayment(paymentUrl, headers);
      } else {
        payment = await this.fetchPayment(paymentUrl, headers);
      }
    }
    if (payment.order_id !== data.razorpay_order_id || payment.status !== "captured" || payment.currency !== "INR") {
      throw new UnauthorizedException("Payment has not been captured for this order.");
    }
    const result = await this.billing.complete(
      data.razorpay_order_id, data.razorpay_payment_id, payment.method ?? null, payment.amount ?? -1, payment.currency,
      userId,
    );
    return { success: true, accessUntil: result.accessUntil };
  }

  // A PDF invoice for one of the user's paid payments.
  async invoice(userId: string, paymentId: string): Promise<{ fileName: string; pdf: Buffer }> {
    const [payment, user] = await Promise.all([
      this.billing.paidForUser(userId, paymentId), this.users.findById(userId),
    ]);
    if (!payment || !user) throw new NotFoundException("Invoice not found.");
    const pdf = await renderInvoice(payment, {
      name: `${user.firstName} ${user.lastName}`.trim(), email: user.email,
    });
    return { fileName: `${invoiceNumber(payment)}.pdf`, pdf };
  }

  private gatewayReady() {
    return Boolean(
      this.config.get<string>("RAZORPAY_KEY_ID")?.trim() &&
      this.config.get<string>("RAZORPAY_KEY_SECRET")?.trim() &&
      this.config.get<string>("RAZORPAY_WEBHOOK_SECRET")?.trim(),
    );
  }

  private async fetchPayment(url: string, headers: Record<string, string>) {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(12_000) });
    if (!response.ok) throw new ServiceUnavailableException("Could not confirm payment with Razorpay.");
    return await response.json() as {
      order_id?: string; status?: string; amount?: number; currency?: string; method?: string;
    };
  }

  async handleWebhook(rawBody: Buffer | undefined, signature: string | undefined, event: unknown): Promise<void> {
    const webhookSecret = this.config.get<string>("RAZORPAY_WEBHOOK_SECRET")?.trim();
    if (!webhookSecret || !rawBody || !signature || !sameHex(hmac(webhookSecret, rawBody.toString("utf8")), signature)) {
      throw new UnauthorizedException("Invalid webhook signature.");
    }
    const body = event as {
      event?: string;
      payload?: { payment?: { entity?: {
        order_id?: string; id?: string; amount?: number; currency?: string; method?: string; status?: string;
      } } };
    };
    const payment = body.payload?.payment?.entity;
    if (!payment?.order_id) return;
    if (body.event === "payment.captured" && payment.id && payment.amount && payment.currency === "INR" && payment.status === "captured") {
      await this.billing.complete(payment.order_id, payment.id, payment.method ?? null, payment.amount, payment.currency);
    } else if (body.event === "payment.failed") {
      await this.billing.failPending(payment.order_id);
    }
  }
}
