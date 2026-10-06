export type Holding = {
  id: string;
  ticker: string;
  shares: number;
  costBasis: number;
};

export type HoldingInput = Omit<Holding, "id">;

// currentPrice is null when a live price hasn't been fetched yet, or the
// most recent fetch failed — callers must render an "unavailable" state
// rather than treating null as zero.
export type PricedHolding = Holding & { currentPrice: number | null };

export function gainLoss(
  holding: Pick<PricedHolding, "shares" | "costBasis" | "currentPrice">
) {
  if (holding.currentPrice === null) return null;
  return (holding.currentPrice - holding.costBasis) * holding.shares;
}

export function gainLossPercent(
  holding: Pick<PricedHolding, "shares" | "costBasis" | "currentPrice">
) {
  const gl = gainLoss(holding);
  if (gl === null) return null;
  const invested = holding.costBasis * holding.shares;
  if (invested === 0) return 0;
  return (gl / invested) * 100;
}

export function portfolioTotals(
  holdings: Pick<PricedHolding, "shares" | "costBasis" | "currentPrice">[]
) {
  const costBasis = holdings.reduce((sum, h) => sum + h.costBasis * h.shares, 0);
  // Holdings with an unavailable price fall back to their cost basis so a
  // single failed fetch doesn't understate the portfolio total.
  const currentValue = holdings.reduce(
    (sum, h) => sum + (h.currentPrice ?? h.costBasis) * h.shares,
    0
  );
  const gain = currentValue - costBasis;
  const gainPercent = costBasis === 0 ? 0 : (gain / costBasis) * 100;
  return { costBasis, currentValue, gain, gainPercent };
}

const STORAGE_KEY = "loomshift.portfolio.holdings";

export function loadHoldings(): Holding[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Holding[]) : [];
  } catch {
    return [];
  }
}

export function saveHoldings(holdings: Holding[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
}
