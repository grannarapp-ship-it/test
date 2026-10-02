export type Holding = {
  id: string;
  ticker: string;
  shares: number;
  costBasis: number;
  currentPrice: number;
};

export type HoldingInput = Omit<Holding, "id">;

export function gainLoss(holding: Pick<Holding, "shares" | "costBasis" | "currentPrice">) {
  return (holding.currentPrice - holding.costBasis) * holding.shares;
}

export function gainLossPercent(holding: Pick<Holding, "shares" | "costBasis" | "currentPrice">) {
  const invested = holding.costBasis * holding.shares;
  if (invested === 0) return 0;
  return (gainLoss(holding) / invested) * 100;
}

export function portfolioTotals(
  holdings: Pick<Holding, "shares" | "costBasis" | "currentPrice">[]
) {
  const costBasis = holdings.reduce((sum, h) => sum + h.costBasis * h.shares, 0);
  const currentValue = holdings.reduce((sum, h) => sum + h.currentPrice * h.shares, 0);
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
