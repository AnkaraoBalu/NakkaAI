import { Inject, Injectable, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import { hashToken } from "../auth/session.service.js";
import type { Provider } from "../provider-keys/provider-keys.config.js";
import { ProviderKeysService } from "../provider-keys/provider-keys.service.js";
import { proxyConfig, type ProxyConfig } from "./proxy.config.js";
import { ProxyRepository } from "./proxy.repository.js";
import { estimateTokens, hasPrices, requestCostMicros } from "./request-cost.js";
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

const sendError = (
  res: Response,
  status: number,
  message: string,
  extra: Record<string, unknown> = {},
) => res.status(status).json({ error: { message, ...extra } });

// Forwards AI requests to the company that serves the model, with our API key,
// and streams the answer back unchanged. Spec sections 6.5–6.7 and 7.
@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

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
    const body = req.body as { model?: unknown; stream?: unknown } | undefined;
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
    const usedUp = plan.windows
      .map((window) => ({
        window,
        row: access.usage.find((u) => u.windowId === window.id),
      }))
      .find(({ window, row }) => row && row.used >= window.limit);
    if (usedUp?.row) {
      return sendError(
        res,
        402,
        `Your ${usedUp.window.label} allowance is used up.`,
        {
          window: usedUp.window.label,
          resetsAt: usedUp.row.resetsAt.toISOString(),
          ...(this.config.manageUrl
            ? { manageUrl: this.config.manageUrl }
            : {}),
        },
      );
    }

    // 4. Forward the body as received. Only two things may change: the model
    //    name, when plan_models maps it to a different upstream name, and, for
    //    streamed OpenAI-style requests, asking for token usage, which those
    //    providers only report when asked and which the cost depends on.
    const wantsUsage =
      !anthropic &&
      body.stream === true &&
      (body as { stream_options?: { include_usage?: unknown } }).stream_options
        ?.include_usage !== true;
    const outgoing =
      model.upstreamModel === model.modelId && !wantsUsage
        ? raw
        : JSON.stringify({
            ...body,
            model: model.upstreamModel,
            ...(wantsUsage
              ? {
                  stream_options: {
                    ...(body as { stream_options?: object }).stream_options,
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
      const beta = req.headers["anthropic-beta"];
      if (beta) headers["anthropic-beta"] = String(beta);
    } else {
      headers.authorization = `Bearer ${key}`;
    }

    // Stop the upstream request if the extension goes away mid-answer.
    const abort = new AbortController();
    res.on("close", () => {
      if (!res.writableFinished) abort.abort();
    });

    let upstream: globalThis.Response;
    try {
      upstream = await fetch(this.providerKeys.url(provider), {
        method: "POST",
        headers,
        body: outgoing,
        signal: abort.signal,
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

    // Our key being refused must not look like the user's token being refused:
    // a 401 here would make the extension sign the user out.
    if (upstream.status === 401 || upstream.status === 403) {
      this.logger.error(
        `${provider} refused our API key (${upstream.status}): ${(await upstream.text()).slice(0, 300)}`,
      );
      return sendError(
        res,
        502,
        "The AI provider is unavailable right now. Please try again later.",
      );
    }

    // 5. Stream the answer straight through, reading token counts on the way.
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
          if (upstream.ok) meter.push(value);
          if (!res.write(value)) {
            await new Promise<void>((resolve) => {
              res.once("drain", resolve);
              res.once("close", resolve);
            });
          }
        }
      }
    } catch (error) {
      if (!abort.signal.aborted) {
        this.logger.warn(
          `${provider} stream broke: ${(error as Error).message}`,
        );
      }
    }

    // 6. Record usage after the stream ends (the counts arrive at the end), and
    //    only then end the response, so the extension's next request already
    //    sees this one's cost. Failed requests cost nothing. If a provider
    //    reported no usage at all, the request is charged as input by its size
    //    rather than for free.
    try {
      if (!upstream.ok) return;
      let tokens = meter.finish();
      if (!tokens.inputTokens && !tokens.outputTokens && !tokens.cacheReadTokens && !tokens.cacheWriteTokens) {
        this.logger.warn(`${provider} reported no usage for ${model.modelId}; estimating`);
        tokens = estimateTokens(raw);
      }
      await this.usage.record(
        {
          userId,
          modelId: model.modelId,
          provider,
          ...tokens,
          costMicros: requestCostMicros(tokens, model),
        },
        plan.windows,
      );
    } catch (error) {
      this.logger.error(`Couldn't record usage: ${(error as Error).message}`);
    } finally {
      if (!res.writableEnded) res.end();
    }
  }
}
