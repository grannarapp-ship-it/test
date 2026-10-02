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
