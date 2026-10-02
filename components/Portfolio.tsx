"use client";

import { useEffect, useState } from "react";
import {
  gainLoss,
  loadHoldings,
  saveHoldings,
  type Holding,
  type HoldingInput,
} from "@/lib/portfolio";
import { HoldingForm } from "./HoldingForm";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // localStorage isn't available during server rendering, so holdings are
    // hydrated from storage after mount rather than in the initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHoldings(loadHoldings());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveHoldings(holdings);
  }, [holdings, loaded]);

  function addHolding(input: HoldingInput) {
    setHoldings((prev) => [...prev, { id: crypto.randomUUID(), ...input }]);
  }

  function updateHolding(id: string, input: HoldingInput) {
    setHoldings((prev) =>
      prev.map((holding) => (holding.id === id ? { id, ...input } : holding))
    );
    setEditingId(null);
  }

  function removeHolding(id: string) {
    setHoldings((prev) => prev.filter((holding) => holding.id !== id));
    if (editingId === id) setEditingId(null);
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">Add a holding</h2>
        <HoldingForm submitLabel="Add" onSubmit={addHolding} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Your portfolio</h2>
        {holdings.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            You don&apos;t have any holdings yet. Add your first holding above
            to see it here.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/[.08] text-left dark:border-white/[.145]">
                <th className="py-2 pr-2">Ticker</th>
                <th className="py-2 pr-2">Shares</th>
                <th className="py-2 pr-2">Cost basis</th>
                <th className="py-2 pr-2">Current price</th>
                <th className="py-2 pr-2">Gain/Loss</th>
                <th className="py-2 pr-2" />
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => {
                if (editingId === holding.id) {
                  return (
                    <tr key={holding.id} className="border-b border-black/[.08] dark:border-white/[.145]">
                      <td colSpan={6} className="py-3">
                        <HoldingForm
                          initialValue={holding}
                          submitLabel="Save"
                          onSubmit={(input) => updateHolding(holding.id, input)}
                          onCancel={() => setEditingId(null)}
                        />
                      </td>
                    </tr>
                  );
                }

                const gl = gainLoss(holding);
                return (
                  <tr
                    key={holding.id}
                    className="border-b border-black/[.08] dark:border-white/[.145]"
                  >
                    <td className="py-2 pr-2 font-medium">{holding.ticker}</td>
                    <td className="py-2 pr-2">{holding.shares}</td>
                    <td className="py-2 pr-2">{currency.format(holding.costBasis)}</td>
                    <td className="py-2 pr-2">{currency.format(holding.currentPrice)}</td>
                    <td
                      className={`py-2 pr-2 ${
                        gl >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {gl >= 0 ? "+" : ""}
                      {currency.format(gl)}
                    </td>
                    <td className="py-2 pr-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingId(holding.id)}
                          className="text-xs font-medium underline underline-offset-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeHolding(holding.id)}
                          className="text-xs font-medium text-red-600 underline underline-offset-2 dark:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
