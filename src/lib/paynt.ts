/**
 * PayNT / OPPWA Payment Gateway Client (Copy & Pay - SAQ-A PCI DSS)
 *
 * Implements the 3-step checkout flow:
 * 1. Prepare Checkout (POST /v1/checkouts) -> returns checkoutId, integrity, scriptUrl
 * 2. Client Widget renders embedded iframe form -> form action="{shopperResultUrl}"
 * 3. Verify Payment Status (GET /v1/checkouts/{id}/payment?entityId=...)
 */

export interface PrepareCheckoutParams {
  amount: number;
  currency: string;
  orderNumber: string;
  customer: {
    email: string;
    givenName: string;
    surname: string;
    phone?: string;
    ip?: string;
  };
  billing: {
    street1: string;
    city: string;
    postcode: string;
    country: string;
  };
  cartItems?: Array<{
    name: string;
    price: number;
    quantity: number;
    total: number;
    currency: string;
    id?: string;
  }>;
}

export interface PrepareCheckoutResult {
  checkoutId: string;
  integrity?: string;
  scriptUrl: string;
  buildNumber?: string;
  timestamp?: string;
  ndc?: string;
}

export interface PaymentStatusResult {
  id: string;
  paymentType: string;
  paymentBrand?: string;
  amount: string;
  currency: string;
  result: {
    code: string;
    description: string;
  };
  card?: {
    bin?: string;
    last4Digits?: string;
    holder?: string;
    expiryMonth?: string;
    expiryYear?: string;
  };
  merchantTransactionId?: string;
  buildNumber?: string;
  timestamp?: string;
  ndc?: string;
  [key: string]: any;
}

/**
 * Validates and returns the Bearer token.
 * Prevents HTTP 500 ByteString errors caused by non-ASCII characters in headers.
 */
export function getValidPayntToken(): string {
  const token = (
    process.env.PAYNT_BEARER_TOKEN ||
    process.env.PAYBYLINK_AUTH_TOKEN ||
    ""
  ).trim();

  if (!token) {
    throw new Error(
      "PAYNT_BEARER_TOKEN (или PAYBYLINK_AUTH_TOKEN) не задан в переменных окружения."
    );
  }

  // Ensure ByteString compatibility (ASCII 0x00 - 0x7F)
  if (/[^\x00-\x7F]/.test(token)) {
    throw new Error(
      "PAYNT_BEARER_TOKEN содержит недопустимые не-ASCII символы (например кириллицу). " +
        "Убедитесь, что токен скопирован без русских букв."
    );
  }

  return token;
}

export function getPayntBaseUrl(): string {
  const url = (
    process.env.PAYNT_BASE_URL ||
    process.env.PAYBYLINK_BASE_URL ||
    "https://eu-test.oppwa.com"
  ).trim();
  return url.replace(/\/+$/, "");
}

export function getPayntEntityId(): string {
  const entityId = (
    process.env.PAYNT_ENTITY_ID ||
    process.env.PAYBYLINK_ENTITY_ID ||
    "8ac9a4c9a0ce496501a10b62873b1817"
  ).trim();

  if (!entityId) {
    throw new Error("PAYNT_ENTITY_ID не задан.");
  }

  return entityId;
}

/**
 * Maps full country name or code to ISO 3166-1 alpha-2 (required by OPPWA).
 */
export function toCountryCode2(country: string): string {
  if (!country) return "GB";
  const raw = country.trim();
  if (raw.length === 2) return raw.toUpperCase();

  const normalized = raw.toLowerCase();
  const map: Record<string, string> = {
    "united kingdom": "GB",
    "great britain": "GB",
    uk: "GB",
    england: "GB",
    scotland: "GB",
    wales: "GB",
    "northern ireland": "GB",
    "united states": "US",
    "united states of america": "US",
    usa: "US",
    germany: "DE",
    deutschland: "DE",
    latvia: "LV",
    latvija: "LV",
    lithuania: "LT",
    lietuva: "LT",
    estonia: "EE",
    eesti: "EE",
    france: "FR",
    spain: "ES",
    españa: "ES",
    italy: "IT",
    italia: "IT",
    poland: "PL",
    polska: "PL",
    netherlands: "NL",
    holland: "NL",
    belgium: "BE",
    austria: "AT",
    switzerland: "CH",
    sweden: "SE",
    norway: "NO",
    denmark: "DK",
    finland: "FI",
    ireland: "IE",
    portugal: "PT",
    greece: "GR",
    czechia: "CZ",
    "czech republic": "CZ",
    hungary: "HU",
    romania: "RO",
    bulgaria: "BG",
    croatia: "HR",
    slovakia: "SK",
    slovenia: "SI",
    cyprus: "CY",
    malta: "MT",
    luxembourg: "LU",
    canada: "CA",
    australia: "AU",
    "new zealand": "NZ",
  };

  if (map[normalized]) return map[normalized];

  // If 3-letter code known
  const alpha3Map: Record<string, string> = {
    gbr: "GB",
    usa: "US",
    deu: "DE",
    lva: "LV",
    ltu: "LT",
    est: "EE",
    fra: "FR",
    esp: "ES",
    ita: "IT",
    pol: "PL",
    nld: "NL",
    bel: "BE",
    aut: "AT",
    che: "CH",
    swe: "SE",
    nor: "NO",
    dnk: "DK",
    fin: "FI",
    irl: "IE",
    prt: "PT",
    can: "CA",
    aus: "AU",
    nzl: "NZ",
  };

  if (alpha3Map[normalized]) return alpha3Map[normalized];

  return raw.slice(0, 2).toUpperCase();
}

/**
 * Extracts client IP with public IP fallback for 3DS requirement.
 * OPPWA rejects transactions without public IP: code 100.900.400.
 */
export function getClientIp(headers: Headers | Record<string, string | string[] | undefined>): string {
  let ip = "";

  const getHeader = (name: string): string | undefined => {
    if ("get" in headers && typeof (headers as Headers).get === "function") {
      return (headers as Headers).get(name) || undefined;
    }
    const val = (headers as Record<string, string | string[] | undefined>)[name];
    if (Array.isArray(val)) return val[0];
    return val;
  };

  const xff = getHeader("x-forwarded-for");
  if (xff) {
    ip = xff.split(",")[0].trim();
  }

  if (!ip) {
    ip = getHeader("cf-connecting-ip") || getHeader("x-real-ip") || "";
  }

  // Check if IP is localhost / private loopback
  const isLoopback =
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "localhost" ||
    ip === "0.0.0.0" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.");

  if (isLoopback) {
    // Provide a valid public fallback IP for local dev testing so 3DS does not reject with 100.900.400
    return "195.12.13.14";
  }

  return ip;
}

/**
 * Step 1: Prepare Checkout
 * Sends POST /v1/checkouts to create the Copy & Pay session.
 *
 * IMPORTANT NOTE:
 * shopperResultUrl must NOT be included in this POST body.
 * In Copy & Pay, shopperResultUrl is set exclusively on the HTML form:
 * <form action="{shopperResultUrl}" class="paymentWidgets" ...>
 */
export async function prepareCheckout(params: PrepareCheckoutParams): Promise<PrepareCheckoutResult> {
  const baseUrl = getPayntBaseUrl();
  const token = getValidPayntToken();
  const entityId = getPayntEntityId();

  const body = new URLSearchParams();
  body.append("entityId", entityId);
  body.append("amount", params.amount.toFixed(2));
  body.append("currency", params.currency.toUpperCase());
  body.append("paymentType", "DB");
  body.append("integrity", "true");
  body.append("merchantTransactionId", params.orderNumber);

  if (params.customer.email) {
    body.append("customer.email", params.customer.email);
  }
  if (params.customer.givenName) {
    body.append("customer.givenName", params.customer.givenName);
  }
  if (params.customer.surname) {
    body.append("customer.surname", params.customer.surname);
  }
  if (params.customer.phone) {
    body.append("customer.mobile", params.customer.phone);
  }
  if (params.customer.ip) {
    body.append("customer.ip", params.customer.ip);
  }

  body.append("billing.street1", params.billing.street1);
  body.append("billing.city", params.billing.city);
  body.append("billing.postcode", params.billing.postcode);
  body.append("billing.country", toCountryCode2(params.billing.country));

  if (params.cartItems && params.cartItems.length > 0) {
    params.cartItems.forEach((item, index) => {
      body.append(`cart.items[${index}].name`, item.name);
      body.append(`cart.items[${index}].description`, item.name);
      body.append(`cart.items[${index}].price`, item.price.toFixed(2));
      body.append(`cart.items[${index}].quantity`, String(item.quantity));
      body.append(`cart.items[${index}].currency`, params.currency.toUpperCase());
      body.append(`cart.items[${index}].totalAmount`, item.total.toFixed(2));
      if (item.id) {
        body.append(`cart.items[${index}].merchantItemId`, item.id);
      }
    });
  }

  const endpoint = `${baseUrl}/v1/checkouts`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayNT prepareCheckout error:", response.status, errorText);
    throw new Error(`PayNT prepareCheckout failed [${response.status}]: ${errorText}`);
  }

  const data = await response.json();

  if (!data?.id) {
    throw new Error(`PayNT invalid checkout response: ${JSON.stringify(data)}`);
  }

  return {
    checkoutId: data.id,
    integrity: data.integrity,
    scriptUrl: `${baseUrl}/v1/paymentWidgets.js?checkoutId=${data.id}`,
    buildNumber: data.buildNumber,
    timestamp: data.timestamp,
    ndc: data.ndc,
  };
}

/**
 * Step 3: Check Payment Status
 * Calls GET {baseUrl}{resourcePath}?entityId={entityId}
 *
 * THROTTLING NOTICE:
 * Maximum 2 requests per minute allowed per checkoutId.
 * Do not poll in a loop! Call once upon shopper return.
 */
export async function getPaymentStatus(resourcePath: string): Promise<PaymentStatusResult> {
  const baseUrl = getPayntBaseUrl();
  const token = getValidPayntToken();
  const entityId = getPayntEntityId();

  const cleanPath = resourcePath.startsWith("/") ? resourcePath : `/${resourcePath}`;
  const url = `${baseUrl}${cleanPath}?entityId=${encodeURIComponent(entityId)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayNT getPaymentStatus error:", response.status, errorText);
    throw new Error(`PayNT getPaymentStatus failed [${response.status}]: ${errorText}`);
  }

  const data: PaymentStatusResult = await response.json();
  return data;
}

/**
 * Checks if OPPWA result.code represents a successful payment.
 *
 * 000.000.000 (Live success)
 * 000.100.110 / 000.100.112 (Integrator / test mode success)
 * 000.300... / 000.600... (Conditional success)
 */
export function isPaymentSuccessful(code: string | undefined): boolean {
  if (!code) return false;
  return /^(000\.000\.|000\.100\.1|000\.[36])/.test(code);
}

/**
 * Checks if payment is pending (e.g. 3DS or bank authorization in flight).
 */
export function isPaymentPending(code: string | undefined): boolean {
  if (!code) return false;
  return /^(000\.200)/.test(code);
}
