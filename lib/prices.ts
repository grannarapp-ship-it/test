export type PriceMap = Record<string, number | null>;

const STOOQ_URL = "https://stooq.com/q/l/";

// Fetches current prices for the given tickers from Stooq's free quote
// endpoint. Each ticker is resolved independently so one failure doesn't
// take down the others.
export async function fetchLivePrices(tickers: string[]): Promise<PriceMap> {
  const unique = Array.from(
    new Set(tickers.map((ticker) => ticker.trim().toUpperCase()).filter(Boolean))
  );

  const prices: PriceMap = {};
  await Promise.all(
    unique.map(async (ticker) => {
      prices[ticker] = await fetchSinglePrice(ticker);
    })
  );
  return prices;
}

async function fetchSinglePrice(ticker: string): Promise<number | null> {
  try {
    const url = `${STOOQ_URL}?s=${encodeURIComponent(ticker.toLowerCase())}.us&f=sd2t2ohlcv&h&e=csv`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;

    const text = await response.text();
    const [, dataLine] = text.trim().split("\n");
    if (!dataLine) return null;

    const close = Number(dataLine.split(",")[6]);
    return Number.isFinite(close) && close > 0 ? close : null;
  } catch {
    return null;
  }
}
