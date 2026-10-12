/**
 * Delivery terms for Solvetaworld — the single source of truth.
 *
 * Every price here is in GBP (the store's base currency, see BASE_CURRENCY in
 * CurrencyProvider). The basket, checkout, the checkout API, emails and the
 * delivery policy all read from this file, so what the site shows, what the
 * customer is charged and what the policies say cannot drift apart.
 *
 * Safe to import from both client and server code (no server-only deps).
 */

export type ShippingMethodKey = "standard" | "express";

/** Order subtotal (after discounts, before tax) at which standard delivery is free. */
export const FREE_STANDARD_MIN = 120;

export interface ShippingMethod {
  key: ShippingMethodKey;
  /** Price in GBP. */
  price: number;
  /** Discounted subtotal (GBP) from which this method is free; null = always charged. */
  freeFrom: number | null;
  /** next-intl key (in the `checkout` namespace) for the method's name. */
  labelKey: `methods.${ShippingMethodKey}`;
}

export const SHIPPING_METHODS: readonly ShippingMethod[] = [
  { key: "standard", price: 6.49, freeFrom: FREE_STANDARD_MIN, labelKey: "methods.standard" },
  { key: "express", price: 14.49, freeFrom: null, labelKey: "methods.express" },
] as const;

export const SHIPPING_METHOD_KEYS = SHIPPING_METHODS.map((m) => m.key) as readonly ShippingMethodKey[];

export const DEFAULT_SHIPPING_METHOD: ShippingMethodKey = "standard";

export function isShippingMethod(value: unknown): value is ShippingMethodKey {
  return typeof value === "string" && (SHIPPING_METHOD_KEYS as readonly string[]).includes(value);
}

export function getShippingMethod(key: ShippingMethodKey): ShippingMethod {
  return SHIPPING_METHODS.find((m) => m.key === key)!;
}

const toPence = (amount: number) => Math.round(amount * 100);

/** True when the discounted subtotal (GBP) earns free standard delivery (>= £120). */
export function qualifiesForFreeStandard(discountedSubtotal: number): boolean {
  return toPence(discountedSubtotal) >= toPence(FREE_STANDARD_MIN);
}

/**
 * Delivery charge in GBP for a method, given the order subtotal (GBP) after
 * discounts and before tax.
 */
export function shippingCost(method: ShippingMethodKey, discountedSubtotal: number): number {
  const m = getShippingMethod(method);
  if (m.freeFrom !== null && toPence(discountedSubtotal) >= toPence(m.freeFrom)) return 0;
  return m.price;
}

/** GBP still needed to reach free standard delivery (0 when already reached). */
export function amountToFreeStandard(discountedSubtotal: number): number {
  return Math.max(toPence(FREE_STANDARD_MIN) - toPence(discountedSubtotal), 0) / 100;
}

// ── Delivery times ────────────────────────────────────────────────────────

export type DeliveryZoneKey = "uk" | "europe" | "northAmerica" | "asiaOceania" | "africaSouthAmerica";

export interface DeliveryZone {
  key: DeliveryZoneKey;
  /** English name, as used in the delivery policy. */
  name: string;
  /** Business days from dispatch, per method. */
  days: Record<ShippingMethodKey, string>;
}

/** Estimated transit times from dispatch. The delivery policy renders this table. */
export const DELIVERY_ZONES: readonly DeliveryZone[] = [
  { key: "uk", name: "United Kingdom", days: { standard: "1–3", express: "1–2" } },
  { key: "europe", name: "Europe", days: { standard: "3–7", express: "2–4" } },
  { key: "northAmerica", name: "North America", days: { standard: "5–10", express: "3–5" } },
  { key: "asiaOceania", name: "Asia & Oceania", days: { standard: "7–14", express: "4–7" } },
  { key: "africaSouthAmerica", name: "Africa & South America", days: { standard: "8–15", express: "5–8" } },
] as const;

const UK = new Set(["GB", "UK", "GG", "JE", "IM"]);

const EUROPE = new Set([
  "AD", "AL", "AT", "AX", "BA", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FO", "FR",
  "GI", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "MD", "ME", "MK", "MT", "NL",
  "NO", "PL", "PT", "RO", "RS", "SE", "SI", "SJ", "SK", "SM", "TR", "UA", "VA", "XK",
]);

const NORTH_AMERICA = new Set([
  "US", "CA", "MX", "GL", "PM", "BM",
  // Central America & the Caribbean
  "AG", "AI", "AW", "BB", "BL", "BQ", "BS", "BZ", "CR", "CW", "DM", "DO", "GD", "GP", "GT", "HN", "HT",
  "JM", "KN", "KY", "LC", "MF", "MQ", "MS", "PA", "PR", "SV", "SX", "TC", "TT", "VC", "VG", "VI",
]);

const SOUTH_AMERICA = new Set(["AR", "BO", "BR", "CL", "CO", "EC", "FK", "GF", "GY", "PE", "PY", "SR", "UY"]);

const AFRICA = new Set([
  "AO", "BF", "BI", "BJ", "BW", "CG", "CI", "CM", "CV", "DJ", "DZ", "EG", "EH", "ET", "GA", "GH", "GM",
  "GN", "GQ", "KE", "KM", "LR", "LS", "MA", "MG", "MR", "MU", "MW", "MZ", "NA", "NE", "NG", "RE", "RW",
  "SC", "SH", "SL", "SN", "ST", "SZ", "TD", "TG", "TN", "TZ", "UG", "YT", "ZA", "ZM",
]);

/** Delivery zone for an ISO 3166-1 alpha-2 country code. Defaults to the UK when unknown/empty. */
export function deliveryZone(countryCode?: string | null): DeliveryZone {
  const code = (countryCode || "").trim().toUpperCase();
  const find = (key: DeliveryZoneKey) => DELIVERY_ZONES.find((z) => z.key === key)!;
  if (!code || UK.has(code)) return find("uk");
  if (EUROPE.has(code)) return find("europe");
  if (NORTH_AMERICA.has(code)) return find("northAmerica");
  if (SOUTH_AMERICA.has(code) || AFRICA.has(code)) return find("africaSouthAmerica");
  return find("asiaOceania");
}

/** Business-day range from dispatch for a method to a destination country. */
export function deliveryDays(method: ShippingMethodKey, countryCode?: string | null): string {
  return deliveryZone(countryCode).days[method];
}

// ── Formatting helpers for fixed GBP copy (policies, emails, seed data) ──

export function formatGbp(amount: number, locale: string = "en-GB"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "GBP",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export const STANDARD_PRICE = getShippingMethod("standard").price;
export const EXPRESS_PRICE = getShippingMethod("express").price;
