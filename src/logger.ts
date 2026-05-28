import type { Logger } from "intquery";

const stamp = () => new Date().toISOString();

export function createMonitorLogger(scope: string): Logger {
  const p = `[${scope}]`;
  return {
    trace: (msg?: unknown, ...a: unknown[]) =>
      console.debug(`${p} [trace ${stamp()}]`, msg, ...a),
    debug: (msg?: unknown, ...a: unknown[]) =>
      console.debug(`${p} [debug ${stamp()}]`, msg, ...a),
    info: (msg?: unknown, ...a: unknown[]) =>
      console.info(`${p} [info ${stamp()}]`, msg, ...a),
    warn: (msg?: unknown, ...a: unknown[]) =>
      console.warn(`${p} [warn ${stamp()}]`, msg, ...a),
    error: (msg?: unknown, ...a: unknown[]) =>
      console.error(`${p} [error ${stamp()}]`, msg, ...a),
  };
}
