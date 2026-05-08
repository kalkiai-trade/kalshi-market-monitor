import { MarketApi, type Market } from "kalshi-typescript";
import { createKalshiConfiguration } from "./kalshi-client";
import { createMonitorLogger } from "./logger";

const log = createMonitorLogger("discovery");

const DEFAULT_PAGE_LIMIT = 50;

/** Page open markets for a series ticker (e.g. KXBTC15M). */
export async function fetchOpenMarketsForSeries(
  seriesTicker: string,
  maxMarkets: number
): Promise<Market[]> {
  const api = new MarketApi(createKalshiConfiguration());
  const all: Market[] = [];
  let cursor: string | undefined;
  let pageSize: number;
  do {
    const res = await api.getMarkets(
      200,
      cursor,
      undefined,
      seriesTicker,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      "open",
      undefined,
      undefined
    );
    const markets = res.data.markets ?? [];
    pageSize = markets.length;
    all.push(...markets);
    cursor = res.data.cursor ?? undefined;
    if (!cursor || all.length >= maxMarkets) break;
  } while (pageSize === 200);
  return all.slice(0, maxMarkets);
}

/** Return ticker of first open market in series, or null. */
export async function resolveTickerFromSeries(
  seriesTicker: string
): Promise<string | null> {
  const markets = await fetchOpenMarketsForSeries(
    seriesTicker,
    DEFAULT_PAGE_LIMIT
  );
  const first = markets[0]?.ticker;
  if (!first) log.warn("No open markets for series", seriesTicker);
  return first ?? null;
}
