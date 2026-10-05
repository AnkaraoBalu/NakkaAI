import { describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret } from "./secret-box.js";

const SECRET = "master-secret-for-tests";

describe("secret box", () => {
  it("round-trips and never stores the plain text", () => {
    const box = encryptSecret("sk-live-1234567890", SECRET);
    expect(box.startsWith("v1:")).toBe(true);
    expect(box).not.toContain("sk-live");
    expect(decryptSecret(box, SECRET)).toBe("sk-live-1234567890");
  });

  it("uses a fresh IV each time", () => {
    expect(encryptSecret("same", SECRET)).not.toBe(encryptSecret("same", SECRET));
  });

  it("rejects the wrong secret", () => {
    const box = encryptSecret("sk-live-1234567890", SECRET);
    expect(() => decryptSecret(box, "other-secret")).toThrow();
  });

  it("rejects a tampered box", () => {
    const [v, iv, tag, data] = encryptSecret("sk-live-1234567890", SECRET).split(":");
    const flipped = Buffer.from(data!, "base64");
    flipped[0] = flipped[0]! ^ 1;
    expect(() =>
      decryptSecret([v, iv, tag, flipped.toString("base64")].join(":"), SECRET),
    ).toThrow();
  });

  it("rejects an unknown format", () => {
    expect(() => decryptSecret("plain-text", SECRET)).toThrow(/format/);
  });
});
