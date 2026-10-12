export interface HomepageProduct {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  comparePrice?: number | string | null;
  images: { url: string; alt?: string | null }[];
  categories?: { category: { name: string; slug: string } }[];
  quantity?: number;
  status?: string;
  isFeatured?: boolean;
  brand?: string | null;
  sku?: string | null;
  lowStockAlert?: number;
  createdAt?: string | Date;
}

/**
 * Which slice of the catalogue this storefront puts on the front page.
 *
 * Solvetaworld shares its product database with a sibling store, so a plain
 * `slice(0, limit)` on the same ranked list would put the same ten items on
 * both homepages. The shelf seed fixes that without weakening the sections:
 * each one still ranks by what it claims to rank by — featured, deepest
 * discount, newest, most stock — but the picker draws from the top of that
 * ranking with a store-specific, stable shuffle instead of always taking the
 * first N.
 *
 * Stable is the point. The same seed always produces the same homepage, so the
 * page does not reshuffle under a shopper between requests, and it does not
 * differ between the server render and the client.
 */
const SHELF_SEED = process.env.NEXT_PUBLIC_SHELF_SEED ?? "solvetaworld";

/** How much of the ranking the picker is allowed to reach into, as a multiple
 *  of the section size. Three keeps the choice near the top of the ranking. */
const SHELF_DEPTH = 3;

function seedFrom(...parts: string[]): number {
  let h = 2166136261;
  for (const part of parts) {
    for (let i = 0; i < part.length; i++) {
      h ^= part.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, and identical on server and client. */
function rng(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Takes an already-ranked list and returns `limit` of its strongest entries,
 * chosen for this shelf rather than simply taken from the front, and returned
 * in the ranking's own order.
 */
export function pickForShelf<T>(ranked: T[], limit: number, shelf: string): T[] {
  if (ranked.length <= limit) return ranked;

  const pool = ranked.slice(0, Math.min(ranked.length, limit * SHELF_DEPTH));
  const order = pool.map((_, i) => i);
  const next = rng(seedFrom(SHELF_SEED, shelf));

  // Fisher-Yates over the indices, so the pick is uniform across the pool.
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  return order
    .slice(0, limit)
    .sort((a, b) => a - b)
    .map((i) => pool[i]);
}

export function getSaleProducts(products: HomepageProduct[], limit = 10): HomepageProduct[] {
  const ranked = products
    .filter((p) => {
      if (!p.comparePrice) return false;
      return Number(p.comparePrice) > Number(p.price);
    })
    .sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
  return pickForShelf(ranked, limit, "price-cuts");
}

export function getNewProducts(products: HomepageProduct[], limit = 10): HomepageProduct[] {
  const ranked = [...products].sort((a, b) => {
    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return db - da;
  });
  return pickForShelf(ranked, limit, "just-in");
}

export function getDeepStockProducts(products: HomepageProduct[], limit = 10): HomepageProduct[] {
  const ranked = [...products].sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0));
  return pickForShelf(ranked, limit, "deep-stock");
}

export function getDiscountPercent(product: HomepageProduct): number {
  const price = Number(product.price);
  const compare = product.comparePrice ? Number(product.comparePrice) : null;
  if (!compare || compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
}
