import "dotenv/config";

const BASE_PATHS = {
  prod: "https://api.elections.kalshi.com/trade-api/v2",
  demo: "https://demo-api.kalshi.co/trade-api/v2",
} as const;

const PEM_HEADER = "-----BEGIN RSA PRIVATE KEY-----";
const PEM_FOOTER = "-----END RSA PRIVATE KEY-----";

function normalizePrivateKeyPem(value: string): string {
  const trimmed = value.trim();
  let base64 = trimmed
    .replace(/-----BEGIN RSA PRIVATE KEY-----/g, "")
    .replace(/-----END RSA PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  if (!base64) return trimmed;
  const lines: string[] = [];
  for (let i = 0; i < base64.length; i += 64) {
    lines.push(base64.slice(i, i + 64));
  }
  return `${PEM_HEADER}\n${lines.join("\n")}\n${PEM_FOOTER}`;
}

function getPrivateKeyPem(): string {
  const raw = process.env.KALSHI_PRIVATE_KEY_PEM ?? "";
  if (!raw) return "";
  return normalizePrivateKeyPem(raw);
}

export const config = {
  apiKey: process.env.KALSHI_API_KEY ?? "",
  privateKeyPath: process.env.KALSHI_PRIVATE_KEY_PATH ?? "",
  get privateKeyPem(): string {
    return getPrivateKeyPem();
  },
  demo: process.env.KALSHI_DEMO === "true",
  basePath:
    process.env.KALSHI_BASE_PATH ??
    (process.env.KALSHI_DEMO === "true" ? BASE_PATHS.demo : BASE_PATHS.prod),
} as const;
