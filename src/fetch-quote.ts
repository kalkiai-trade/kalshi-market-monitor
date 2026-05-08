import { MarketApi } from "kalshi-typescript";
import { createKalshiConfiguration } from "./kalshi-client";
import { withRetry } from "./retry";
import type { MarketQuoteSnapshot } from "./market-types";
import { createMonitorLogger } from "./logger";

const log = createMonitorLogger("quote");

function dollarsToCents(dollars: string | undefined): number {
  if (dollars == null || dollars === "") return 0;
  const n = parseFloat(dollars);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export async function fetchMarketQuote(
  ticker: string
): Promise<MarketQuoteSnapshot | null> {
  const api = new MarketApi(createKalshiConfiguration());
  try {
    const res = await withRetry(() => api.getMarket(ticker), {
      attempts: 2,
      baseDelayMs: 250,
    });
    const m = res.data.market;
    if (!m) return null;
    return {
      ticker: m.ticker,
      yesBidCents: dollarsToCents(m.yes_bid_dollars),
      yesAskCents: dollarsToCents(m.yes_ask_dollars),
      noBidCents: dollarsToCents(m.no_bid_dollars),
      noAskCents: dollarsToCents(m.no_ask_dollars),
      lastCents: dollarsToCents(m.last_price_dollars),
      fetchedAt: new Date(),
    };
  } catch (e) {
    log.warn("fetchMarketQuote failed", ticker, e);
    return null;
  }
}
