import { Inject, Injectable, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import { Agent, fetch, type Response as UpstreamResponse } from "undici";
import { hashToken } from "../auth/session.service.js";
import type { Provider } from "../provider-keys/provider-keys.config.js";
import type { PlanModel, PlanWindow } from "../plans/plans.repository.js";
import { spentIn, windowsFor } from "../plans/plans.service.js";
import { ProviderKeysService } from "../provider-keys/provider-keys.service.js";
import { InFlightLimiter } from "./in-flight.js";
import { proxyConfig, type ProxyConfig } from "./proxy.config.js";
import { ProxyRepository } from "./proxy.repository.js";
import { estimateTokens, hasPrices, requestCostMicros } from "./request-cost.js";
import { allowedBetas, guardBody } from "./request-guard.js";
import { UsageMeter } from "./usage-meter.js";
import { UsageRepository } from "./usage.repository.js";

export type Endpoint = "messages" | "chat";
type ProxyRequest = Request & { rawBody?: Buffer };

// Response headers worth passing back to the extension.
const PASS_HEADERS = [
  "content-type",
  "retry-after",
  "cache-control",
  "request-id",
  "x-request-id",
];

// Long thinking requests can take many minutes before the first byte, and
// streams can pause while the model works; the defaults (5 minutes) would cut
// them off after the provider has already billed us.
const upstreamAgent = new Agent({
  connectTimeout: 15_000,
  headersTimeout: 15 * 60_000,
  bodyTimeout: 10 * 60_000,
});

const sendError = (
  res: Response,
  status: number,
  message: string,
  extra: Record<string, unknown> = {},
) => res.status(status).json({ type: "error", error: { type: "error", message, ...extra } });

// Provider error text for the user, without our account details (org ids,
// anything key-like).
function cleanProviderMessage(text: string): string | undefined {
  let message: unknown;
  try {
    const body = JSON.parse(text) as { error?: { message?: unknown } | string; message?: unknown };
    message = typeof body.error === "string" ? body.error : (body.error?.message ?? body.message);
  } catch {
    return undefined;
  }
  if (typeof message !== "string" || !message.trim()) return undefined;
  return message
    .replace(/\borg-[A-Za-z0-9]+/g, "org-…")
    .replace(/\b(sk|xai|AIza)[-_A-Za-z0-9]{8,}/g, "…")
    .slice(0, 500);
}

const waitForDrain = (res: Response) =>
  new Promise<void>((resolve) => {
    const done = () => {
      res.off("drain", done);
      res.off("close", done);
      resolve();
    };
    res.on("drain", done);
    res.on("close", done);
    if (res.destroyed) done();
  });

// Forwards AI requests to the company that serves the model, with our API key,
// and streams the answer back unchanged. Spec sections 6.5–6.7 and 7.
@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly inFlight = new InFlightLimiter();

  constructor(
    private readonly access: ProxyRepository,
    private readonly usage: UsageRepository,
    private readonly providerKeys: ProviderKeysService,
    @Inject(proxyConfig.KEY) private readonly config: ProxyConfig,
  ) {}

  async handle(req: ProxyRequest, res: Response, endpoint: Endpoint) {
    // 1. Who is asking. /v1/messages also carries the token in x-api-key.
    const header = req.headers["x-api-key"];
    const token =
      req.headers.authorization?.match(/^Bearer (.+)$/)?.[1] ??
      (endpoint === "messages" && typeof header === "string"
        ? header
        : undefined);
    const raw = req.rawBody;
    const body = req.body as Record<string, unknown> | undefined;
    if (token && (!raw || typeof body?.model !== "string")) {
      return sendError(res, 400, "The request needs a JSON body with a model.");
    }

    // One query: the token's user, their plan, the model on it, current usage.
    const access = token
      ? await this.access.access(hashToken(token), String(body?.model))
      : null;
    if (!access)
      return sendError(
        res,
        401,
        "Your session has expired. Please sign in again.",
      );
    if (access.touch) this.access.touchToken(access.tokenId);
    const { userId, plan } = access;

    // 2. The model must be on the user's plan; it says which company serves it.
    const model = access.model;
    if (!model || !raw || !body) {
      return sendError(
        res,
        403,
        `${String(body?.model)} isn't available on your ${plan.name} plan.`,
      );
    }
    const provider = model.provider as Provider;
    const anthropic = provider === "anthropic";
    if (anthropic !== (endpoint === "messages")) {
      return sendError(
        res,
        400,
        `Send ${model.modelId} to ${anthropic ? "/v1/messages" : "/v1/chat/completions"}.`,
      );
    }
    // Allowances are measured in cost, so a model without prices can't be used.
    if (!hasPrices(model)) {
      this.logger.warn(`No prices set for ${model.modelId} on the ${plan.id} plan`);
      return sendError(
        res,
        503,
        "This model isn't available right now. Try another one.",
      );
    }
    // Nothing billed outside per-token prices may get through.
    const guarded = guardBody(anthropic, body);
    if (!guarded.ok) return sendError(res, 400, guarded.message);
    const key = await this.providerKeys.get(provider);
    if (!key) {
      this.logger.warn(`No API key configured for ${provider}`);
      return sendError(
        res,
        503,
        "This model isn't available right now. Try another one.",
      );
    }

    // 3. Allowance left? Like Claude Code, a request may start while every
    //    window is under 100%; its cost is added when it ends. The first
    //    used-up window (in plan order) answers 402.
    const windows = windowsFor(plan.windows, model);
    const usedUp = windows
      .map((window) => ({
        window,
        row: access.usage.find((u) => u.windowId === window.id),
      }))
      .find(({ window, row }) => spentIn(window, row) >= window.limit);
    if (usedUp) {
      // A one-time credit has no reset time: upgrading is the only way on.
      const resetsAt = usedUp.window.duration_hours === null ? null : usedUp.row?.resetsAt;
      return sendError(
        res,
        402,
        usedUp.window.duration_hours === null
          ? `Your ${usedUp.window.label} is used up. Upgrade your plan to keep going.`
          : `Your ${usedUp.window.label} allowance is used up.`,
        {
          window: usedUp.window.label,
          ...(resetsAt ? { resetsAt: resetsAt.toISOString() } : {}),
          ...(this.config.manageUrl
            ? { manageUrl: this.config.manageUrl }
            : {}),
        },
      );
    }

    // Costs land when a request ends, so cap how many run at once: on a
    // one-time credit just one, so it can't be overspent in parallel.
    const oneTime = windows.some((window) => window.duration_hours === null);
    const maxRunning = oneTime ? 1 : this.config.maxConcurrentPerUser;
    if (!this.inFlight.tryAcquire(userId, maxRunning)) {
      res.setHeader("retry-after", "5");
      return sendError(
        res,
        429,
        `You can run ${maxRunning} ${maxRunning === 1 ? "request" : "requests"} at a time. Wait for one to finish.`,
      );
    }
    try {
      await this.forward(req, res, {
        userId,
        provider,
        anthropic,
        model,
        windows,
        key,
        raw,
        body: guarded.body,
        bodyChanged: guarded.changed,
      });
    } finally {
      this.inFlight.release(userId);
    }
  }

  private async forward(
    req: ProxyRequest,
    res: Response,
    request: {
      userId: string;
      provider: Provider;
      anthropic: boolean;
      model: PlanModel;
      windows: PlanWindow[];
      key: string;
      raw: Buffer;
      body: Record<string, unknown>;
      bodyChanged: boolean;
    },
  ) {
    const { userId, provider, anthropic, model, windows, key, raw, body } = request;

    // 4. Forward the body as received. Only these may change: the model name,
    //    when plan_models maps it to a different upstream name; unpriced
    //    options removed by the guard; and, for streamed OpenAI-style requests,
    //    asking for token usage, which those providers only report when asked.
    const wantsUsage =
      !anthropic &&
      body.stream === true &&
      (body.stream_options as { include_usage?: unknown } | undefined)?.include_usage !== true;
    const outgoing =
      model.upstreamModel === model.modelId && !wantsUsage && !request.bodyChanged
        ? raw
        : JSON.stringify({
            ...body,
            model: model.upstreamModel,
            ...(wantsUsage
              ? {
                  stream_options: {
                    ...(body.stream_options as object | undefined),
                    include_usage: true,
                  },
                }
              : {}),
          });
    const headers: Record<string, string> = {
      "content-type": "application/json",
    };
    if (anthropic) {
      headers["x-api-key"] = key;
      headers["anthropic-version"] = String(
        req.headers["anthropic-version"] ?? "2023-06-01",
      );
      const betas = allowedBetas(req.headers["anthropic-beta"], this.config.extraAnthropicBetas);
      if (betas) headers["anthropic-beta"] = betas;
    } else {
      headers.authorization = `Bearer ${key}`;
    }

    // Stop the upstream request if the extension goes away mid-answer.
    const abort = new AbortController();
    res.on("close", () => {
      if (!res.writableFinished) abort.abort();
    });

    let upstream: UpstreamResponse;
    try {
      upstream = await fetch(this.providerKeys.url(provider), {
        method: "POST",
        headers,
        body: outgoing,
        signal: abort.signal,
        dispatcher: upstreamAgent,
      });
    } catch (error) {
      if (abort.signal.aborted) return;
      this.logger.error(`${provider} unreachable: ${(error as Error).message}`);
      return sendError(
        res,
        502,
        "Couldn't reach the AI provider. Please try again.",
      );
    }

    // 5. Errors from the provider: never pass on our account details, and
    //    never answer 401/403 for our key (the extension would sign the user out).
    if (!upstream.ok) {
      const text = (await upstream.text().catch(() => "")).slice(0, 8_000);
      this.logger.warn(`${provider} answered ${upstream.status} for ${model.modelId}: ${text.slice(0, 300)}`);
      if (upstream.status === 401 || upstream.status === 403) {
        return sendError(res, 502, "The AI provider is unavailable right now. Please try again later.");
      }
      if (upstream.status === 429) {
        const retryAfter = upstream.headers.get("retry-after");
        if (retryAfter) res.setHeader("retry-after", retryAfter);
        return sendError(res, 429, "The AI provider is busy. Please try again in a moment.");
      }
      if (upstream.status >= 500) {
        return sendError(res, 502, "The AI provider had a problem. Please try again.");
      }
      return sendError(
        res,
        upstream.status,
        cleanProviderMessage(text) ?? "The AI provider couldn't handle this request.",
      );
    }

    // 6. Stream the answer straight through, reading token counts on the way.
    res.status(upstream.status);
    for (const name of PASS_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) res.setHeader(name, value);
    }
    res.setHeader("x-accel-buffering", "no"); // tell proxies not to buffer
    res.flushHeaders();

    const streaming = (upstream.headers.get("content-type") ?? "").includes(
      "text/event-stream",
    );
    const meter = new UsageMeter(anthropic ? "anthropic" : "openai", streaming);
    try {
      if (upstream.body) {
        const reader = upstream.body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          meter.push(value);
          if (res.destroyed) break;
          if (!res.write(value)) await waitForDrain(res);
        }
      }
    } catch (error) {
      if (!abort.signal.aborted) {
        this.logger.warn(
          `${provider} stream broke: ${(error as Error).message}`,
        );
      }
    }

    // 7. Record usage after the stream ends (the counts arrive at the end), and
    //    only then end the response, so the extension's next request already
    //    sees this one's cost. An answer cut short is charged for the input and
    //    the output streamed so far; if nothing at all was reported, the
    //    request is charged as input by its size rather than for free.
    try {
      let tokens = meter.finish();
      if (!meter.complete && !tokens.inputTokens && !tokens.cacheReadTokens && !tokens.cacheWriteTokens) {
        tokens = { ...estimateTokens(raw), outputTokens: tokens.outputTokens };
      }
      if (!meter.complete) {
        this.logger.warn(`${provider} gave no final usage for ${model.modelId}; estimated`);
      }
      await this.usage.record(
        {
          userId,
          modelId: model.modelId,
          provider,
          ...tokens,
          costMicros: requestCostMicros(tokens, model),
        },
        windows,
      );
    } catch (error) {
      this.logger.error(`Couldn't record usage: ${(error as Error).message}`);
    } finally {
      if (!res.writableEnded) res.end();
    }
  }
}
