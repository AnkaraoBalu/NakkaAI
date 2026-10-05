import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

// AES-256-GCM for secrets we must read back (provider API keys).
// Stored as "v1:<iv>:<tag>:<ciphertext>", each part base64. The version prefix
// leaves room to rotate the master secret later.
const VERSION = "v1";

// Any length of secret works; it is stretched to the 32 bytes AES-256 needs.
const keyFrom = (secret: string) => createHash("sha256").update(secret).digest();

export function encryptSecret(plain: string, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyFrom(secret), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [VERSION, iv, cipher.getAuthTag(), data]
    .map((part) => (typeof part === "string" ? part : part.toString("base64")))
    .join(":");
}

// Throws if the box was changed or the secret is wrong.
export function decryptSecret(box: string, secret: string): string {
  const [version, iv, tag, data] = box.split(":");
  if (version !== VERSION || !iv || !tag || !data) {
    throw new Error("Unrecognised secret format.");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    keyFrom(secret),
    Buffer.from(iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(data, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
