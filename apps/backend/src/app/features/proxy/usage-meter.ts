// Reads token counts out of a provider's response as it streams past, without
// holding the stream back. Handles both streamed (SSE) and plain JSON replies.

// The same meaning for every provider: inputTokens excludes cached input,
// which is split into cache reads and cache writes.
export interface TokenCounts {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
}

type Json = Record<string, unknown>;
const num = (value: unknown) => (typeof value === "number" ? value : 0);
const obj = (value: unknown): Json =>
  value && typeof value === "object" ? (value as Json) : {};

export class UsageMeter {
  // True once the provider's final usage numbers have arrived. When the answer
  // is cut short (the user pressed Stop), they never do: the output is then
  // estimated from the text streamed so far, so it isn't free.
  complete = false;
  // Characters of generated text (answer, thinking, tool arguments) seen.
  private streamedChars = 0;
  readonly counts: TokenCounts = {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
  };
  // OpenAI-style prompt_tokens include cached ones; kept to split them out.
  private promptTokens = 0;
  private buffer = "";
  private readonly decoder = new TextDecoder();
  private readonly chunks: string[] = [];

  constructor(
    private readonly format: "anthropic" | "openai",
    private readonly streaming: boolean,
  ) {}

  push(chunk: Uint8Array) {
    const text = this.decoder.decode(chunk, { stream: true });
    if (!this.streaming) {
      this.chunks.push(text);
      return;
    }
    this.buffer += text;
    let newline: number;
    while ((newline = this.buffer.indexOf("\n")) >= 0) {
      const line = this.buffer.slice(0, newline).trim();
      this.buffer = this.buffer.slice(newline + 1);
      if (line.startsWith("data:")) this.readEvent(line.slice(5).trim());
    }
  }

  finish(): TokenCounts {
    if (this.streaming) {
      const rest = this.buffer.trim();
      if (rest.startsWith("data:")) this.readEvent(rest.slice(5).trim());
    } else {
      try {
        const usage = JSON.parse(this.chunks.join("") + this.decoder.decode()).usage;
        if (usage) {
          this.readUsage(obj(usage));
          this.complete = true;
        }
      } catch {
        // Not JSON, or cut short: nothing reported.
      }
    }
    if (!this.complete) {
      // About 4 characters per token.
      this.counts.outputTokens = Math.max(
        this.counts.outputTokens,
        Math.ceil(this.streamedChars / 4),
      );
    }
    return this.counts;
  }

  private readEvent(data: string) {
    if (!data || data === "[DONE]") return;
    let event: Json;
    try {
      event = obj(JSON.parse(data));
    } catch {
      return;
    }
    if (this.format === "anthropic") {
      // Input counts arrive in message_start; output totals in message_delta.
      if (event.type === "message_start")
        this.readUsage(obj(obj(event.message).usage));
      if (event.type === "content_block_delta") {
        const delta = obj(event.delta);
        this.countText(delta.text, delta.thinking, delta.partial_json);
      }
      if (event.type === "message_delta" && event.usage) {
        this.readUsage(obj(event.usage));
        this.complete = true;
      }
    } else {
      for (const choice of Array.isArray(event.choices) ? event.choices : []) {
        const delta = obj(obj(choice).delta);
        this.countText(delta.content, delta.reasoning_content, delta.reasoning);
        for (const call of Array.isArray(delta.tool_calls) ? delta.tool_calls : []) {
          this.countText(obj(obj(call).function).arguments);
        }
      }
      if (event.usage) {
        // OpenAI and compatible: the final chunk carries usage.
        this.readUsage(obj(event.usage));
        this.complete = true;
      }
    }
  }

  private readUsage(usage: Json) {
    if (this.format === "anthropic") {
      if ("input_tokens" in usage)
        this.counts.inputTokens = num(usage.input_tokens);
      if ("output_tokens" in usage)
        this.counts.outputTokens = num(usage.output_tokens);
      if ("cache_read_input_tokens" in usage) {
        this.counts.cacheReadTokens = num(usage.cache_read_input_tokens);
      }
      if ("cache_creation_input_tokens" in usage) {
        this.counts.cacheWriteTokens = num(usage.cache_creation_input_tokens);
      }
    } else {
      if ("prompt_tokens" in usage) this.promptTokens = num(usage.prompt_tokens);
      // Some providers leave reasoning tokens out of completion_tokens but
      // count them in total_tokens: bill whichever is larger.
      if ("completion_tokens" in usage || "total_tokens" in usage)
        this.counts.outputTokens = Math.max(
          num(usage.completion_tokens),
          num(usage.total_tokens) - num(usage.prompt_tokens),
          0,
        );
      const cached = obj(usage.prompt_tokens_details).cached_tokens;
      if (cached !== undefined) this.counts.cacheReadTokens = num(cached);
      this.counts.inputTokens = Math.max(
        this.promptTokens - this.counts.cacheReadTokens,
        0,
      );
    }
  }

  private countText(...parts: unknown[]) {
    for (const part of parts) {
      if (typeof part === "string") this.streamedChars += part.length;
    }
  }
}
