import { describe, expect, it } from "vitest";
import { frontendUrlFromEnv } from "./auth.config.js";

describe("frontendUrlFromEnv", () => {
  it("uses the website origin for the auth handoff", () => {
    expect(frontendUrlFromEnv("https://nakka.in/")).toBe("https://nakka.in");
  });

  it("uses only the first origin when multiple origins are mistakenly configured", () => {
    expect(
      frontendUrlFromEnv("https://nakka.in,https://www.nakka.in"),
    ).toBe("https://nakka.in");
  });

  it("uses the local website in development when unset", () => {
    expect(frontendUrlFromEnv(undefined)).toBe("http://localhost:3000");
  });
});
