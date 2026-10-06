"use client";

import { useEffect, useState } from "react";
import { isStale, loadPriceCache, savePriceCache, type PriceCache } from "./priceCache";

// Fetches live prices for the given tickers, caching results in
// localStorage for a day so holdings refresh at most once daily. Failed
// fetches are kept in memory only (not persisted) so they're retried the
// next time this hook runs rather than waiting a full day.
export function useLivePrices(tickers: string[]) {
  const [cache, setCache] = useState<PriceCache>({});
  const tickersKey = Array.from(new Set(tickers)).sort().join(",");

  useEffect(() => {
    // localStorage isn't available during server rendering, so the cache is
    // hydrated after mount rather than in the initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCache(loadPriceCache());
  }, []);

  useEffect(() => {
    if (!tickersKey) return;
    const uniqueTickers = tickersKey.split(",");
    const current = loadPriceCache();
    const staleTickers = uniqueTickers.filter((ticker) => isStale(current[ticker]));
    if (staleTickers.length === 0) return;

    let cancelled = false;

    fetch(`/api/prices?tickers=${encodeURIComponent(staleTickers.join(","))}`)
      .then((response) => {
        if (!response.ok) throw new Error("price fetch failed");
        return response.json() as Promise<Record<string, number | null>>;
      })
      .then((prices) => {
        if (cancelled) return;
        const now = Date.now();
        const next = { ...current };
        for (const ticker of staleTickers) {
          next[ticker] = { price: prices[ticker] ?? null, fetchedAt: now };
        }
        savePriceCache(next);
        setCache(next);
      })
      .catch(() => {
        if (cancelled) return;
        setCache((prev) => {
          const next = { ...prev };
          for (const ticker of staleTickers) {
            next[ticker] = { price: null, fetchedAt: 0 };
          }
          return next;
        });
      });

    return () => {
      cancelled = true;
    };
  }, [tickersKey]);

  return cache;
}
