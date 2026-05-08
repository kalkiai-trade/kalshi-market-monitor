import type { MarketQuoteSnapshot } from "./market-types";

/** Single-line snapshot for console and log files. */
export function formatQuoteLine(q: MarketQuoteSnapshot): string {
  const yb = (q.yesBidCents / 100).toFixed(2);
  const ya = (q.yesAskCents / 100).toFixed(2);
  const nb = (q.noBidCents / 100).toFixed(2);
  const na = (q.noAskCents / 100).toFixed(2);
  const lt = (q.lastCents / 100).toFixed(2);
  return `YES bid=${yb} ask=${ya}  |  NO bid=${nb} ask=${na}  |  last=${lt}  @ ${q.fetchedAt.toISOString()}`;
}
