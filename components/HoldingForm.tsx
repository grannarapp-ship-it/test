"use client";

import { useState, type FormEvent } from "react";
import type { Holding, HoldingInput } from "@/lib/portfolio";

type HoldingFormProps = {
  initialValue?: Holding;
  onSubmit: (holding: HoldingInput) => void;
  onCancel?: () => void;
  submitLabel: string;
};

export function HoldingForm({
  initialValue,
  onSubmit,
  onCancel,
  submitLabel,
}: HoldingFormProps) {
  const [ticker, setTicker] = useState(initialValue?.ticker ?? "");
  const [shares, setShares] = useState(initialValue?.shares?.toString() ?? "");
  const [costBasis, setCostBasis] = useState(
    initialValue?.costBasis?.toString() ?? ""
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsedShares = Number(shares);
    const parsedCostBasis = Number(costBasis);
    if (
      !ticker.trim() ||
      !Number.isFinite(parsedShares) ||
      !Number.isFinite(parsedCostBasis)
    ) {
      return;
    }
    onSubmit({
      ticker: ticker.trim().toUpperCase(),
      shares: parsedShares,
      costBasis: parsedCostBasis,
    });
    if (!initialValue) {
      setTicker("");
      setShares("");
      setCostBasis("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap"
    >
      <label className="flex flex-col gap-1 text-sm">
        Ticker
        <input
          className="rounded border border-black/[.08] px-2 py-1 dark:border-white/[.145] dark:bg-black"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="AAPL"
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Shares
        <input
          type="number"
          step="any"
          className="rounded border border-black/[.08] px-2 py-1 dark:border-white/[.145] dark:bg-black"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          placeholder="10"
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Cost basis / share
        <input
          type="number"
          step="any"
          className="rounded border border-black/[.08] px-2 py-1 dark:border-white/[.145] dark:bg-black"
          value={costBasis}
          onChange={(e) => setCostBasis(e.target.value)}
          placeholder="150.00"
          required
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="h-9 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-9 rounded-full border border-black/[.08] px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
