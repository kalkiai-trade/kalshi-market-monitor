/**
 * Programmatic exports for embedding the monitor in other tools.
 */
export { VERSION } from "./version";
export type { MarketQuoteSnapshot } from "./market-types";
export { fetchMarketQuote } from "./fetch-quote";
export {
  fetchOpenMarketsForSeries,
  resolveTickerFromSeries,
} from "./discovery";
export { startQuotePoller } from "./poll";
export { formatQuoteLine } from "./format";
export { createKalshiConfiguration } from "./kalshi-client";
export { createMonitorLogger } from "./logger";
