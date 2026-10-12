import { describe, expect, it } from "vitest";
import { UsageMeter } from "./usage-meter.js";

const bytes = (text: string) => new TextEncoder().encode(text);

describe("UsageMeter", () => {
  it("reads Anthropic stream counts from message_start and message_delta", () => {
    const meter = new UsageMeter("anthropic", true);
    const stream =
      'event: message_start\ndata: {"type":"message_start","message":{"usage":{"input_tokens":11,"cache_read_input_tokens":3,"cache_creation_input_tokens":5,"output_tokens":1}}}\n\n' +
      'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"text":"hi"}}\n\n' +
      'event: message_delta\ndata: {"type":"message_delta","usage":{"output_tokens":7}}\n\n';
    // Split mid-line, the way network chunks arrive.
    meter.push(bytes(stream.slice(0, 40)));
    meter.push(bytes(stream.slice(40, 170)));
    meter.push(bytes(stream.slice(170)));
    expect(meter.finish()).toEqual({
      inputTokens: 11,
      outputTokens: 7,
      cacheReadTokens: 3,
      cacheWriteTokens: 5,
    });
  });

  it("reads OpenAI-compatible usage from the final chunk, splitting out cached input", () => {
    const meter = new UsageMeter("openai", true);
    meter.push(bytes('data: {"choices":[{"delta":{"content":"a"}}]}\n\n'));
    meter.push(
      bytes(
        'data: {"choices":[],"usage":{"prompt_tokens":20,"completion_tokens":9,"prompt_tokens_details":{"cached_tokens":4}}}\n\ndata: [DONE]\n\n',
      ),
    );
    expect(meter.finish()).toEqual({
      inputTokens: 16,
      outputTokens: 9,
      cacheReadTokens: 4,
      cacheWriteTokens: 0,
    });
  });

  it("reads usage from a non-streamed JSON reply", () => {
    const anthropic = new UsageMeter("anthropic", false);
    anthropic.push(bytes('{"content":[],"usage":{"input_tokens":5,'));
    anthropic.push(bytes('"output_tokens":2}}'));
    expect(anthropic.finish()).toEqual({
      inputTokens: 5,
      outputTokens: 2,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
    });

    const openai = new UsageMeter("openai", false);
    openai.push(bytes('{"usage":{"prompt_tokens":8,"completion_tokens":3}}'));
    expect(openai.finish()).toEqual({
      inputTokens: 8,
      outputTokens: 3,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
    });
  });

  it("counts nothing when no usage is reported", () => {
    const meter = new UsageMeter("openai", true);
    meter.push(bytes('data: {"choices":[]}\n\ndata: [DONE]\n\n'));
    expect(meter.finish()).toEqual({
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
    });
  });

  it("estimates the output of a stream cut short (Stop pressed) from its text", () => {
    const meter = new UsageMeter("anthropic", true);
    meter.push(bytes(
      'data: {"type":"message_start","message":{"usage":{"input_tokens":50,"output_tokens":1}}}\n\n' +
      `data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"${"x".repeat(400)}"}}\n\n`,
    ));
    const counts = meter.finish();
    expect(meter.complete).toBe(false);
    expect(counts).toMatchObject({ inputTokens: 50, outputTokens: 100 });
  });

  it("estimates a cut-short OpenAI-style stream, counting reasoning and tool arguments", () => {
    const meter = new UsageMeter("openai", true);
    meter.push(bytes(
      `data: {"choices":[{"delta":{"content":"${"a".repeat(40)}","reasoning_content":"${"b".repeat(40)}"}}]}\n\n` +
      `data: {"choices":[{"delta":{"tool_calls":[{"function":{"arguments":"${"c".repeat(40)}"}}]}}]}\n\n`,
    ));
    expect(meter.finish().outputTokens).toBe(30);
    expect(meter.complete).toBe(false);
  });

  it("bills reasoning tokens reported only in total_tokens", () => {
    const meter = new UsageMeter("openai", true);
    meter.push(bytes('data: {"choices":[],"usage":{"prompt_tokens":10,"completion_tokens":5,"total_tokens":95}}\n\n'));
    expect(meter.finish()).toMatchObject({ inputTokens: 10, outputTokens: 85 });
    expect(meter.complete).toBe(true);
  });
});
