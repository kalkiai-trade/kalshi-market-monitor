import { fetchMarketQuote } from "./fetch-quote";
import type { MarketQuoteSnapshot } from "./market-types";

/** Poll one market on a fixed delay after each completed fetch. */
export function startQuotePoller(options: {
  ticker: string;
  intervalMs: number;
  onQuote: (q: MarketQuoteSnapshot) => void;
  onError?: (err: unknown) => void;
}): () => void {
  let stopped = false;
  const tick = async () => {
    if (stopped) return;
    const q = await fetchMarketQuote(options.ticker);
    if (stopped) return;
    if (q) {
      try {
        options.onQuote(q);
      } catch (e) {
        options.onError?.(e);
      }
    } else {
      options.onError?.(new Error(`No quote for ${options.ticker}`));
    }
    if (!stopped) setTimeout(tick, options.intervalMs);
  };
  setTimeout(tick, 0);
  return () => {
    stopped = true;
  };
}
