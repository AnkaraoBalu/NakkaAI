import { describe, expect, it } from "vitest";
import { UsageMeter } from "./usage-meter.js";

const bytes = (text: string) => new TextEncoder().encode(text);

describe("UsageMeter", () => {
  it("reads Anthropic stream counts from message_start and message_delta", () => {
    const meter = new UsageMeter("anthropic", true);
    const stream =
      'event: message_start\ndata: {"type":"message_start","message":{"usage":{"input_tokens":11,"cache_read_input_tokens":3,"output_tokens":1}}}\n\n' +
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
    });
  });

  it("reads OpenAI-compatible usage from the final chunk", () => {
    const meter = new UsageMeter("openai", true);
    meter.push(bytes('data: {"choices":[{"delta":{"content":"a"}}]}\n\n'));
    meter.push(
      bytes(
        'data: {"choices":[],"usage":{"prompt_tokens":20,"completion_tokens":9,"prompt_tokens_details":{"cached_tokens":4}}}\n\ndata: [DONE]\n\n',
      ),
    );
    expect(meter.finish()).toEqual({
      inputTokens: 20,
      outputTokens: 9,
      cacheReadTokens: 4,
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
    });

    const openai = new UsageMeter("openai", false);
    openai.push(bytes('{"usage":{"prompt_tokens":8,"completion_tokens":3}}'));
    expect(openai.finish()).toEqual({
      inputTokens: 8,
      outputTokens: 3,
      cacheReadTokens: 0,
    });
  });

  it("counts nothing when no usage is reported", () => {
    const meter = new UsageMeter("openai", true);
    meter.push(bytes('data: {"choices":[]}\n\ndata: [DONE]\n\n'));
    expect(meter.finish()).toEqual({
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
    });
  });
});
