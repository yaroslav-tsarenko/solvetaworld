/**
 * GBP-based exchange rates, shared by /api/exchange-rates (what the storefront
 * displays with) and /api/checkout (what the customer is charged). Both read
 * the same in-process cache, so the converted grand total shown at checkout and
 * the amount sent to the payment provider are worked out from the same rate.
 */

export type ChargeCurrency = "GBP" | "EUR" | "USD";

export type Rates = Record<ChargeCurrency, number>;

export const SUPPORTED_CURRENCIES: readonly ChargeCurrency[] = ["GBP", "EUR", "USD"];

/** Used when the rates provider is unreachable. Must match CurrencyProvider's DEFAULT_RATES. */
export const FALLBACK_RATES: Rates = { GBP: 1, EUR: 1.17, USD: 1.27 };

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

let cached: { rates: Rates; timestamp: number } | null = null;

export function isSupportedCurrency(value: unknown): value is ChargeCurrency {
  return typeof value === "string" && (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

export async function getGbpRates(): Promise<Rates> {
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) return cached.rates;

  try {
    const res = await fetch("https://api.frankfurter.dev/v1/latest?base=GBP&symbols=EUR,USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Rates request failed: ${res.status}`);
    const data = await res.json();
    const eur = Number(data?.rates?.EUR);
    const usd = Number(data?.rates?.USD);
    if (!(eur > 0) || !(usd > 0)) throw new Error("Rates response missing EUR/USD");
    cached = { rates: { GBP: 1, EUR: eur, USD: usd }, timestamp: Date.now() };
    return cached.rates;
  } catch (e) {
    console.warn("Failed to fetch exchange rates, using fallback:", e);
    return FALLBACK_RATES;
  }
}

/**
 * Converts a GBP amount into `currency`, rounded to the penny/cent exactly as
 * the storefront's CurrencyProvider.convert does.
 */
export function convertFromGbp(amountInGbp: number, currency: ChargeCurrency, rates: Rates): number {
  if (currency === "GBP") return amountInGbp;
  return Math.round(amountInGbp * rates[currency] * 100) / 100;
}
