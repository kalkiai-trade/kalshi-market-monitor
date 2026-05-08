#!/usr/bin/env node
import "dotenv/config";
import {
  MONITOR_TICKER,
  MONITOR_SERIES_TICKER,
  MONITOR_INTERVAL_MS,
  MONITOR_LOG_DIR,
} from "./env";
import { createMonitorLogger } from "./logger";
import { warnIfUnauthenticated } from "./credentials";
import { resolveTickerFromSeries } from "./discovery";
import { startQuotePoller } from "./poll";
import { formatQuoteLine } from "./format";
import { appendLine } from "./file-log";
import { SERVICE_NAME } from "./constants";
import { VERSION } from "./version";

const log = createMonitorLogger("cli");

function parseArgs(argv: string[]): {
  ticker?: string;
  series?: string;
  intervalMs?: number;
} {
  let ticker: string | undefined;
  let series: string | undefined;
  let intervalMs: number | undefined;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--ticker" && argv[i + 1]) {
      ticker = argv[++i];
    } else if (a === "--series" && argv[i + 1]) {
      series = argv[++i];
    } else if (a === "--interval-ms" && argv[i + 1]) {
      intervalMs = parseInt(argv[++i], 10);
    } else if (a === "--help" || a === "-h") {
      console.log(
        `Usage: npm start -- [--ticker T] [--series S] [--interval-ms N]\n` +
          `Env: KALSHI_MONITOR_TICKER, KALSHI_MONITOR_SERIES_TICKER, KALSHI_MONITOR_INTERVAL_MS, KALSHI_MONITOR_LOG_DIR`
      );
      process.exit(0);
    }
  }
  return { ticker, series, intervalMs };
}

async function main(): Promise<void> {
  warnIfUnauthenticated(log);
  log.info(`${SERVICE_NAME} v${VERSION}`);
  const args = parseArgs(process.argv);
  let ticker: string | undefined =
    (args.ticker || MONITOR_TICKER).trim() || undefined;
  const series = args.series || MONITOR_SERIES_TICKER;
  const intervalMs =
    args.intervalMs ??
    (Number.isFinite(MONITOR_INTERVAL_MS) ? MONITOR_INTERVAL_MS : 2000);

  if (!ticker && series) {
    log.info("Resolving ticker from series", series);
    ticker = (await resolveTickerFromSeries(series)) ?? undefined;
  }

  if (!ticker) {
    log.error(
      "Provide --ticker or KALSHI_MONITOR_TICKER, or --series / KALSHI_MONITOR_SERIES_TICKER."
    );
    process.exit(1);
  }

  const marketTicker = ticker;

  log.info(
    `Polling ${marketTicker} every ${intervalMs}ms after each response (${SERVICE_NAME})`
  );

  const logDir = MONITOR_LOG_DIR;
  const stop = startQuotePoller({
    ticker: marketTicker,
    intervalMs,
    onQuote: (q) => {
      const line = `[${q.ticker}] ${formatQuoteLine(q)}`;
      console.log(line);
      if (logDir) appendLine(logDir, "kalshi-monitor.log", line);
    },
    onError: (e) => log.warn("poll error", e),
  });

  process.on("SIGINT", () => {
    log.info("Stopping");
    stop();
    process.exit(0);
  });
}

main().catch((e) => {
  log.error(e);
  process.exit(1);
});
