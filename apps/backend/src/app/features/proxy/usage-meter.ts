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
        this.readUsage(
          obj(JSON.parse(this.chunks.join("") + this.decoder.decode()).usage),
        );
      } catch {
        // Not JSON: nothing to count.
      }
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
      if (event.type === "message_delta") this.readUsage(obj(event.usage));
    } else if (event.usage) {
      // OpenAI and compatible: the final chunk carries usage.
      this.readUsage(obj(event.usage));
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
      if ("completion_tokens" in usage)
        this.counts.outputTokens = num(usage.completion_tokens);
      const cached = obj(usage.prompt_tokens_details).cached_tokens;
      if (cached !== undefined) this.counts.cacheReadTokens = num(cached);
      this.counts.inputTokens = Math.max(
        this.promptTokens - this.counts.cacheReadTokens,
        0,
      );
    }
  }
}
