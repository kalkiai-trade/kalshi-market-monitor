# kalshi-market-monitor

Small TypeScript CLI that **polls Kalshi markets** over REST and prints **YES/NO bid and ask** (and last trade) on each tick.

## Setup

```bash
cp .env.sample .env
# Set KALSHI_API_KEY and KALSHI_PRIVATE_KEY_PATH or KALSHI_PRIVATE_KEY_PEM
npm install
```

## Run

```bash
# Poll one ticker every 2s (after each response completes)
KALSHI_MONITOR_TICKER=YOUR-MARKET-TICKER npm start

# Or resolve first open market in a series (e.g. KXBTC15M)
KALSHI_MONITOR_SERIES_TICKER=KXBTC15M npm start

# CLI flags override env
npm start -- --ticker YOUR-TICKER --interval-ms 3000

# Optional file log: KALSHI_MONITOR_LOG_DIR=logs
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run monitor (`tsx src/cli.ts`). |
| `npm run build` | Emit `dist/`. |
| `npm run typecheck` | `tsc --noEmit`. |

## Library

Import from `src/index.ts` (or `dist/index.js` after build): `fetchMarketQuote`, `startQuotePoller`, `resolveTickerFromSeries`, etc.

## References

- [Kalshi API docs](https://docs.kalshi.com/)
- [TypeScript SDK](https://docs.kalshi.com/sdks/typescript/quickstart)
