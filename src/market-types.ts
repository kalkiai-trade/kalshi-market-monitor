/** Normalized top-of-book snapshot for one Kalshi market. */
export interface MarketQuoteSnapshot {
  ticker: string;
  yesBidCents: number;
  yesAskCents: number;
  noBidCents: number;
  noAskCents: number;
  lastCents: number;
  fetchedAt: Date;
}
