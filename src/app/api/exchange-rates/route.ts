import { NextResponse } from "next/server";
import { getGbpRates } from "@/lib/exchange-rates";

export async function GET() {
  const rates = await getGbpRates();
  return NextResponse.json({ rates });
}
