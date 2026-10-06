export type PriceCacheEntry = {
  price: number | null;
  fetchedAt: number;
};

export type PriceCache = Record<string, PriceCacheEntry>;

const STORAGE_KEY = "loomshift.portfolio.priceCache";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function loadPriceCache(): PriceCache {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PriceCache) : {};
  } catch {
    return {};
  }
}

export function savePriceCache(cache: PriceCache) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
}

export function isStale(entry: PriceCacheEntry | undefined, now = Date.now()) {
  return !entry || now - entry.fetchedAt > MAX_AGE_MS;
}
