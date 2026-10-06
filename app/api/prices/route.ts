import { NextRequest, NextResponse } from "next/server";
import { fetchLivePrices } from "@/lib/prices";

export async function GET(request: NextRequest) {
  const tickers = (request.nextUrl.searchParams.get("tickers") ?? "")
    .split(",")
    .map((ticker) => ticker.trim())
    .filter(Boolean);

  if (tickers.length === 0) {
    return NextResponse.json({});
  }

  const prices = await fetchLivePrices(tickers);
  return NextResponse.json(prices);
}
