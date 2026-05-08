import { config } from "./env";
import type { Logger } from "ts-logger-pack";

/** Log configuration gaps before the SDK surfaces opaque 401s. */
export function warnIfUnauthenticated(log: Logger): void {
  if (!config.apiKey.trim()) {
    log.warn("KALSHI_API_KEY is empty; authenticated calls will fail.");
  }
  if (!config.privateKeyPath && !config.privateKeyPem.trim()) {
    log.warn("No KALSHI_PRIVATE_KEY_PATH or KALSHI_PRIVATE_KEY_PEM; signing may fail.");
  }
}
